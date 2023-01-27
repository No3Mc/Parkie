// var button = document.getElementById("my-button");


document.getElementById("open-bot-button").addEventListener("click", function(event) {
  event.preventDefault(); // prevent the link from redirecting
  var botUrl = this.getAttribute("href");
  var iframe = document.createElement('iframe');
  iframe.src = botUrl;
  iframe.height = "500";
  iframe.width = "400";
  document.body.appendChild(iframe);
});



var text = document.getElementById("my-text");
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'InstrumentationKey=8ccc058b-922e-4572-820b-494ec0563876;IngestionEndpoint=https://uksouth-1.in.applicationinsights.azure.com/;LiveEndpoint=https://uksouth.livediagnostics.monitor.azure.com/'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
const appInsights = require("applicationinsights");
appInsights
  .setup("InstrumentationKey=8ccc058b-922e-4572-820b-494ec0563876;IngestionEndpoint=https://uksouth-1.in.applicationinsights.azure.com/;LiveEndpoint=https://uksouth.livediagnostics.monitor.azure.com/")
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
  .start()

// button.addEventListener("click", function() {
//   text.innerHTML = "Multani Sohan Halwa";
// });

