import express from 'express';
import { MongoClient } from 'mongodb';
import { readFile } from 'fs/promises';
import { ObjectId } from 'mongodb';


const app = express();
const port = 3000;
const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

async function startServer() {

  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const markersCollection = client.db("Parking").collection("marker");
  console.log("Connected to MongoDB Atlas");

  const markersWithStatus = await markersCollection.find().toArray();

  const leafletJS = await readFile('./node_modules/leaflet/dist/leaflet.js', 'utf-8');
  const leafletCSS = await readFile('./node_modules/leaflet/dist/leaflet.css', 'utf-8');

app.get('/', (req, res) => {
  let html = `
    <html>
      <head>
        <title>Parki - Parking</title>
        <link rel="shortcut icon" type="image/png" href="https://i.postimg.cc/NMbHx9JP/favicon.png" />
        <style>${leafletCSS}</style>
      </head>

      <body>
        <div class="main-body">
          <div id="map" style="height: 800px; width: 90%;"></div>
        </div>
        <button id="locateME">Locate Me Parkie</button>

        <script>${leafletJS}</script>
        
        <script>
          const L = window.L;

          var map = L.map('map').setView([${markersWithStatus[0].lat}, ${markersWithStatus[0].long}], 16);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
          }).addTo(map);

          const myIcon = L.icon({
            iconUrl: 'https://i.ibb.co/09HNBnz/my-icon.png"',
            iconSize: [30, 45],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          });

          const markersWithStatus = ${JSON.stringify(markersWithStatus)};
          
          markersWithStatus.forEach(marker => {
            let markerPopup = L.popup();
          
            const popupContent = document.createElement('div');
            const status = document.createElement('p');
            status.id = marker.id;
            status.textContent = 'Available: ' + marker.status;
            const bookButton = document.createElement('button');
            bookButton.textContent = 'Book Now';
            
            // click btn to open booking form
            bookButton.addEventListener('click', (event) => {
              const bookingForm = document.createElement('form');
              bookingForm.innerHTML =
               
                '<input type="text" id="name" name="name" placeholder="Enter your full name" style="border-radius: 12px; padding: 10px 10px; margin: 5px 0px;" required > <br> ' +
                '<input type="email" id="email" name="email" placeholder="Enter your email" style="border-radius: 12px; padding: 10px 10px; margin:5px 0px" required> <br> ' +
                '<button type="submit" style="padding: 7px 10px; border-radius: 10px; margin: 5px 0px; cursor: pointer;">Book Now</button>';
              const bookingFormPopup = L.popup().setContent(bookingForm);
              map.closePopup(markerPopup);
              map.openPopup(bookingFormPopup, L.latLng(marker.lat, marker.long));
            
              // submit btn
              bookingForm.addEventListener('submit', (event) => {
              
                  event.preventDefault();
                

                const formData = new FormData(bookingForm);
                  const data = new URLSearchParams();
                  data.append('name', formData.get('name'));
                  data.append('email', formData.get('email'));
                  data.append('markerId', marker._id);

                  // fetching the booking data
                  fetch("/book", {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/x-www-form-urlencoded"
                      },
                      body: data
                  })
                      .then(response => {
                          if (response.ok) {
                              return response.json();
                          } else if (response.status === 409) {
                              throw new Error("Marker book kar dia hai");
                          } else {
                              throw new Error(response.statusText);
                          }
                      })  
                      .then(data => {
                          alert(data.message);
                      })
                      .catch(error => {
                          console.error(error);
                          alert(error.message);
                      });
                                                         
              });
            });
          
            popupContent.appendChild(status);
            popupContent.appendChild(bookButton);
            markerPopup.setContent(popupContent);
            L.marker([marker.lat, marker.long], {icon: myIcon})
              .addTo(map)
              .bindPopup(markerPopup);
          }); 

             </script>
           </body>
         </html>
       `;
       res.send(html);
     });

     app.post('/book', async (req, res) => {
      const { name, email, markerId } = req.body;
    
      try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true });
        const markersCollection = client.db("Parking").collection("marker");
    
        const marker = await markersCollection.findOne({ _id: new ObjectId(markerId) });
    
        if (marker.status === "available") {
          const updatedMarker = await markersCollection.findOneAndUpdate(
            { _id: new ObjectId(markerId) },
            { $set: { name, email, status: 'booked' } },
            { returnOriginal: false }
          );
    
          console.log(`Marker ${markerId} has been booked by ${name} (${email})`);
    
          res.json({ message: 'Marker has been booked' });
           
        } else {
          // Marker is already booked, send an error message to the user
          res.status(409).json({ message: 'Marker is already booked !!⚠️' });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'We are facing unexpected error !!⚠️⚠️' + err.message });
      }
    });
    
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
} 


startServer();
