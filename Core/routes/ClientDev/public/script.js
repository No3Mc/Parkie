// document
// .getElementById("booking-form")
// .addEventListener("submit", function (event) {
//   event.preventDefault(); // Prevent the form from submitting normally

//   // Fetch the form data
//   var formData = new FormData(event.target);

//   // Convert the form data into a JSON object
//   var json = {};
//   for (var pair of formData.entries()) {
//     json[pair[0]] = pair[1];
//   }

//   // Send the form data to the server (replace 'http://localhost:3000' with your server URL)
//   fetch("/book", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(json),
//   })
//     .then(function (response) {
//       // Handle the response from the server
//       if (response.ok) {
//         return response.json();
//       } else {
//         throw new Error("Error: " + response.status);
//       }
//     })
//     .then(function (data) {
//       console.log(data);
//       // Process the response data here if needed
//     })
//     .catch(function (error) {
//       // Handle any errors that occur during the request
//       console.error(error);
//     });
// });