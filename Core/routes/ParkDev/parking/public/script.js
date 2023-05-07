let markersWithStatus = null;

fetch('/markers')
  .then(response => response.json())
  .then(data => {
    markersWithStatus = data;
    console.log(markersWithStatus);
    // call any functions that need the markersWithStatus data here
  })
  .catch(error => console.error(error));

// wait for the fetch to complete before accessing markersWithStatus
setTimeout(() => {
  if (markersWithStatus) {
    const map = L.map('map').setView([markersWithStatus[0].lat, markersWithStatus[0].long], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18
    }).addTo(map);

    const myIcon = L.icon({
      iconUrl: 'https://i.ibb.co/09HNBnz/my-icon.png',
      iconSize: [30, 45],
      iconAnchor: [22, 94],
      popupAnchor: [-3, -76],
      shadowSize: [68, 95],
      shadowAnchor: [22, 94]
    });

// create a new layer group for the markers
const markerLayer = L.layerGroup();


markersWithStatus.forEach(marker => {
  const markerPopup = L.popup();
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
                     throw new Error("⚠️Marker is already booked!!");
                 } else {
                     throw new Error(response.statusText);
                 }
             })  
             .then(data => {
                 alert(data.message);
                 // updateMarkerStatus(marker._id, 'booked');
                 map.closePopup(bookingFormPopup);
                 markerPopup.setContent(popupContent);
                 markerPopup.openOn(map);
                 map.closePopup(markerPopup);

             })
             .catch(error => {   
                 map.closePopup(bookingFormPopup);
                 map.closePopup(markerPopup);
                 console.error(error);
                 alert(error.message);
             });
             
     });
   });

   popupContent.appendChild(status);
   popupContent.appendChild(bookButton);
   markerPopup.setContent(popupContent);
   
   // add the marker to the layer group
   const markerObj = L.marker([marker.lat, marker.long], {icon: myIcon})
     .bindPopup(markerPopup);  
   markerLayer.addLayer(markerObj);
 });

 // add the layer group to the map
 markerLayer.addTo(map);
   
    // geolocation
    document.getElementById('locateME').addEventListener('click', () => {
      if ('geolocation' in navigator) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition((position) => {
          const lon = position.coords.longitude;
          const lat = position.coords.latitude;

          const cIcon = L.icon({
            iconUrl: 'https://i.postimg.cc/JzfHvYnJ/pin.png',
            iconSize: [40, 40],
            iconAnchor: [22, 94],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94]
          });

          const myMarker = L.marker([lat, lon], {icon: cIcon}).addTo(map);

          let firstTime = true;

          if (firstTime) {
            map.setView([lat, lon], 15);
            firstTime = false;
          }

          document.getElementById('locateME').addEventListener('dblclick', () => {
            map.setView([lat, lon], 25);
          });
        });
      } else {
        /* geolocation IS NOT available */
        alert('Geolocation function is not available!');
      }
    });
  }
}, 1000); // wait for 1 second before executing the code after the fetch call