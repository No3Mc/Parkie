import express from 'express';
import { MongoClient } from 'mongodb';
import { readFile } from 'fs/promises';

const app = express();
const port = 3000;
const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

app.use(express.static('public'));

async function startServer() {
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const markersCollection = client.db("Parking").collection("marker");
  console.log("Connected to MongoDB Atlas");

  const markers = await markersCollection.find().toArray();

  const leafletJS = await readFile('./node_modules/leaflet/dist/leaflet.js', 'utf-8');
  const leafletCSS = await readFile('./node_modules/leaflet/dist/leaflet.css', 'utf-8');

  app.get('/', (req, res) => {
    let html = `
      <html>
        <head>
          <title>Parki - Parking</title>

          <link rel="shortcut icon" type="image/png" href="https://i.postimg.cc/NMbHx9JP/favicon.png" />
          <style>
          /* font connection */
          @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300&display=swap');
          /* icons style */
          .material-symbols-outlined {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 48
        }
      
        * {
           box-sizing: border-box;
           font-family: 'Unbounded', cursive;
           text-decoration: none;
           list-style: none;
           scroll-behavior: smooth;
       }  
       body {
           margin: auto;
           padding: 0;
           overflow-x: hidden;
       }
      
       /* Nav bar */
       .navbar {
           display: flex;
           position: relative;
           justify-content: space-between;
           align-items: center;
           background-color: white;
           color: black;
           margin: 0px 94px; 
       }
       .brand-title > a {
           font-size: 1.8rem;
           margin: .5rem;
           color: #1FA637;
       } 
       .navbar-links {
           height: 100%;
       } 
       .navbar-links ul {
           display: flex;
           margin: 0;
           padding: 0;
       }  
       .navbar-links li {
           list-style: none;
       }  
       .navbar-links li a {
           display: block;
           text-decoration: none;
           color: #747774;
           padding: 1.588rem;   
           transition: all 0.8s;
      
           font-size: 13px;
       }
       .navbar-links li a:hover{
        color: #000000;
       }
       
       /* .navbar-links li:hover {
           background-color: #555;
       } */
       
       .toggle-button {
           position: absolute;
           top: .75rem;
           right: 1rem;
           display: none;
           flex-direction: column;
           justify-content: space-around;
           width: 30px;
           height: 21px;
       }
       .toggle-button .bar {
           height: 3px;
           width: 100%;
           background-color: black;
           border-radius: 10px;
           transition: all ease 1s;
       }
       @media (max-width: 1200px) {
           .navbar {
               flex-direction: column;
                align-items: flex-start; 
           }
           .toggle-button {
               display: flex; 
           }
           .navbar-links {
               display: none;
               width: 100%;
           }
           .navbar-links ul {
               width: 100%;
               flex-direction: column;
           }
           .navbar-links ul li {
               text-align: center;
           }
           .navbar-links ul li a {
               padding: .5rem 1rem;
               /* background-color: black;
               color: white; */
                margin: 0px 13px;
                padding: 10px 0px; 
           }
           .navbar-links.active {
               display: flex;
           }
       }
      
      
          /* bro(@itsumarsoomro) is ko comment is lie kia hai kuin ke ye keera kar raha tha and main bhool gaya tha
       ke isko comment kar ke apna keera apply kar skta. Waise to name bhei change kar skta tha but html main mein ne pher 
       udhar se .reg-btn kar dia To bro just kuch stuff ki wajah se isko hata dia
       Kuin ke apne sath keera ho raha tha but tumhara code bht next level tha no doubt */
      
       .login-button {
        position: relative;
      }
      
      .dropdown-icon {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        border-left: 1px solid #9d9d9d;
        border-bottom: 1px solid #9d9d9d;
        transition: transform 0.3s ease;
      }
      
      .dropdown-content {
        position: absolute;
        top: 100%;
        right: 0;
        width: 400px;
        height: 600px;
        background-color: #fff;
        border: 1px solid #000;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        display: none;
        z-index: 1;
      }
      
      .login-button:hover .dropdown-icon {
        transform: translateY(-50%) rotate(-45deg);
      }
      
      .login-button:hover .dropdown-content {
        display: block;
      }
      
      .login-iframe {
        width: 100%;
        height: 100%;
      }
    
       /* login btn */
       /* .log-btn{ */
        /* background-color: white; */
        /* color: #3CAD4F;
        padding: 7px 26px;
        border-radius: 16px;
        border: 1px solid;
        border-color: black; */
      
      
        /* From https://css.glass */
        /* background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        border: 1px solid rgb(245, 244, 244);
        
        transition: all 1s;
        } */
      
      
        /* login btn */
        .reg-btn{
        /* background-color: white; */
        color: #3CAD4F;
        padding: 7px 26px;
        border-radius: 16px;
        border: 1px solid;
        border-color: black;
      
      
        /* From https://css.glass */
        background: rgba(255, 255, 255, 1);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        -webkit-backdrop-filter: blur(20px);
        backdrop-filter: blur(20px);
        border: 1px solid rgb(245, 244, 244);
        
        transition: all 1s;
        }
      
        .reg-btn:hover{
        /* padding: 5px 30px; */
        /* background-image: url("https://cdn-icons-png.flaticon.com/512/2989/2989981.png"); */
        /* From https://css.glass */
        /* background: rgba(255, 255, 255, 0.83);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(7.9px);
        -webkit-backdrop-filter: blur(7.9px);
        border: 1px solid rgba(255, 255, 255, 1); */
        /* background: rgb(245, 241, 241); */
        opacity: 85%;
        border-color: #24AA81;
        }
      
      
        /* Body */
      
        .main-body{
          position: relative;
          height: 800px;
          width: 100%;
          background-color: white;
          margin: 60px 0px;
        }
        .main-body > div {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -52%);
          border-radius: 12px;
      
          /* shadow genrator */
          -webkit-box-shadow: 1px 11px 18px 5px rgba(212,201,212,1);
          -moz-box-shadow: 1px 11px 18px 5px rgba(212,201,212,1);
          box-shadow: 1px 11px 18px 5px rgba(212,201,212,1);
        }
       .Sidebar__SidebarInner-sc-g307zv-9{
          padding: 10px 10px;
       }
        /* Footer */
      
           /* footer */
           .footer{
            margin: 6px 100px;
        }
        .foot-box{
            width: 100%;
            height: 250px;
        }
        footer{
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }
        .l-footer{
            text-align: center;
            margin-top: 140px;
            font-size: 13px;
            border-top: 1px solid black;
        }
        .footer-desc{
            margin-top: 24px;
        }
        .hero-btns {
            display: flex;
        }
          </style>
          <style>${leafletCSS}</style>
        </head>

      
        <!-- nav -->
        <nav class="navbar">
          <div class="brand-title"><a href="/Core/index.html">Parkie</a></div>
          <a href="#" class="toggle-button" title="Toggle Button">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </a>
          <div class="navbar-links">
            <ul>
              <li>
                <a href="#">How it works?</a>
              </li>
              <li><a href="#">Lend space</a></li>
              <li><a href="#">Business solution</a></li>
              <li><a href="#">Company</a></li>
              <li><a href="#">Help</a></li>
              <li>
                <a id="login-button" class="login-button" href="#">
                  Login
                  <span class="dropdown-icon"></span>
                  <div class="dropdown-content">
                    <iframe
                      class="login-iframe"
                      src="routes/CustDev/Login/login.html"
                      frameborder="0"
                    ></iframe>
                  </div>
                </a>
              </li>
      
              <li>
                <a href="routes/CustDev/Register/Register.html"
                  ><b class="reg-btn"
                    >Sign Up
                    <!-- <span class="material-symbols-outlined"> arrow_right_alt </span> -->
                  </b></a
                >
              </li>
            </ul>
          </div>
        </nav>

        <!-- body -->
        <body>
          
        <div class="main-body">
          <div id="map" style="height: 800px; width: 90%;"></div>
        </div>

        <button onclick="window.location.href = '/booking.html'">Book Now</button>
          
        <!-- Js for map library leaflets functionality -->
        <script>${leafletJS}</script>
        <script>
          
          // set view
          var map = L.map('map').setView([${markers[0].lat}, ${markers[0].long}], 16);
          
          console.log("lat:" + ${markers[0].lat})
          console.log("long:" + ${markers[0].long})

          // map layer using openstreet map
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
          }).addTo(map);
          
          // map icon
          const myIcon = L.icon({
            iconUrl: 'https://i.ibb.co/09HNBnz/my-icon.png"',
            iconSize: [30, 45],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            // shadowUrl: 'my-icon-shadow.png',
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          });

          // array of markers
          const markers = ${JSON.stringify(markers)};
          
          console.log(markers)

          // loop through the markers array and add each marker to the map
          markers.forEach(marker => {
            L.marker([marker.lat, marker.long], {icon: myIcon}).addTo(map);
          });

        </script>
        </body>

        <!-- footer -->
        <section class="footer">
          <div class="foot-box">
            <footer>
              <div class="brand-title"><a href="Index.html">Parkie</a></div>
              <div class="navbar-links">
                <ul>
                  <li><a href="#">Find Parking Spots?</a></li>
                  <li><a href="#">Lend Space</a></li>
                  <li><a href="#">Company</a></li>
                  <li><a href="#">Help</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
            </footer>
      
            <div class="l-footer">
              <p class="footer-desc">
                Parkie is the trading name of Parkie Parking Limited Registered in
                England, Gateway house Leicester
              </p>
            </div>
          </div>
        </section>
      </html>
    `;
    res.send(html);
  });
  
  app.get('/booking.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'booking.html'));
  });

  
  // Start server
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
  }

  startServer().catch(err => {
    console.error(err);
  });


// import express from 'express';
// import { MongoClient } from 'mongodb';
// import { readFile } from 'fs/promises';

// const app = express();
// const port = 3000;
// const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

// async function startServer() {
//   const client = await MongoClient.connect(uri, { useNewUrlParser: true });
//   const markersCollection = client.db("Parking").collection("marker");
//   console.log("Connected to MongoDB Atlas");

//   const markers = await markersCollection.find().toArray();

//   const leafletJS = await readFile('./node_modules/leaflet/dist/leaflet.js', 'utf-8');
//   const leafletCSS = await readFile('./node_modules/leaflet/dist/leaflet.css', 'utf-8');

//   app.get('/', (req, res) => {
//     let html = `
//       <html>
//         <head>
//           <title>Leaflet Map</title>
//           <style>${leafletCSS}</style>
//         </head>
//         <body>
//           <div id="map" style="height: 800px;"></div>
//           <script>${leafletJS}</script>
//           <script>
            
//             // set view
//             var map = L.map('map').setView([${markers[0].lat}, ${markers[0].long}], 5);
            
//             // map layer using openstreet map
//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//               attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//               maxZoom: 18,
//             }).addTo(map);
            
//             // map icon
//             const myIcon = L.icon({
//               iconUrl: 'https://i.postimg.cc/KYpKkSRd/my-icon.png',
//               iconSize: [38, 95],
//               iconAnchor: [22, 94],
//               popupAnchor: [-3, -76],
//               // shadowUrl: 'my-icon-shadow.png',
//               shadowSize: [68, 95],
//               shadowAnchor: [22, 94]
//             });
          
//             // adding all markers to the map
//             ${markers.map(marker => `
//               L.marker([${marker.lat}, ${marker.long}], {icon: myIcon}).addTo(map);
//             `).join('')}

//           </script>
//         </body>
//       </html>
//     `;
//     res.send(html);
//   });

//   // Start server
//   app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// }

// startServer().catch(err => {
//   console.error(err);
// });


// import express from 'express';
// import { MongoClient } from 'mongodb';
// import { readFile } from 'fs/promises';

// const app = express();
// const port = 3000;
// const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

// async function startServer() {
//   const client = await MongoClient.connect(uri, { useNewUrlParser: true });
//   const markersCollection = client.db("Parking").collection("marker");
//   console.log("Connected to MongoDB Atlas");

//   const markers = await markersCollection.find().toArray();

//   const leafletJS = await readFile('./node_modules/leaflet/dist/leaflet.js', 'utf-8');
//   const leafletCSS = await readFile('./node_modules/leaflet/dist/leaflet.css', 'utf-8');

//   app.get('/', (req, res) => {
//     let html = `
//       <html>
//         <head>
//           <title>Leaflet Map</title>
//           <style>${leafletCSS}</style>
//         </head>
//         <body>
//           <div id="map" style="height: 800px;"></div>
//           <script>${leafletJS}</script>
//           <script>
            
//             // set view
//             var map = L.map('map').setView([${markers[0].lat}, ${markers[0].long}], 5);
            
            
//             for(let i = 0; i < ${markers.length}; i++){
//               console.log("lat:" + ${markers[i].lat})
//               console.log("long:" + ${markers[i].long})
//             }

//             console.log("lat:" + ${markers[0].lat})
//             console.log("long:" + ${markers[0].long})

        

//             // map layer using openstreet map
//             L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//               attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//               maxZoom: 18,
//             }).addTo(map);
            
//             // map icon
//             const myIcon = L.icon({
//               iconUrl: 'https://as1.ftcdn.net/v2/jpg/02/34/95/68/1000_F_234956832_ylt2S9Z4nUlAMmY29coV9YUTyiqfsbCg.jpg',
//               iconSize: [38, 95],
//               iconAnchor: [22, 94],
//               popupAnchor: [-3, -76],
//               // shadowUrl: 'my-icon-shadow.png',
//               shadowSize: [68, 95],
//               shadowAnchor: [22, 94]
//           });
          
//           //adding all to icon 
//           ${markers.map(marker => `
//               L.marker([${marker.lat}, ${marker.long}], {icon: myIcon}).addTo(map);
//             `).join('')}

//           </script>
//         </body>
//       </html>
//     `;
//     res.send(html);
//   });

//   // Start server
//   app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// }

// startServer().catch(err => {
//   console.error(err);
// });






// import express from 'express';
// import { MongoClient } from 'mongodb';

// const app = express();
// const port = 3000;
// const uri = "mongodb+srv://No3Mc:DJ2vCcF7llVDO2Ly@cluster0.cxtyi36.mongodb.net/Parking?retryWrites=true&w=majority";

// async function startServer() {
//   const client = await MongoClient.connect(uri, { useNewUrlParser: true });
//   const markersCollection = client.db("Parking").collection("marker");
//   console.log("Connected to MongoDB Atlas");

//   const markers = await markersCollection.find().toArray();

//   for(let i = 0; i < markers.length; i++){
//     console.log(markers[i].lat);
//     console.log(markers[i].long);
//   }

//   // Start server
//   app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
//   });
// }

// startServer().catch(err => {
//   console.error(err);
// });