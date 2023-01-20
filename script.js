var button = document.getElementById("my-button");
var text = document.getElementById("my-text");

button.addEventListener("click", function() {
  text.innerHTML = "Multani Sohan Halwa";
});

import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  connectionString: 'InstrumentationKey=8ccc058b-922e-4572-820b-494ec0563876;IngestionEndpoint=https://uksouth-1.in.applicationinsights.azure.com/;LiveEndpoint=https://uksouth.livediagnostics.monitor.azure.com/'
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview