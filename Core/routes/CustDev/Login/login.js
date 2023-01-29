
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '875175060267333',
      cookie     : true,
      xfbml      : true,
      version    : 'v8.0'
    });

    FB.AppEvents.logPageView();

    // Check the user's login status
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };

  // Load the Facebook SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Handle the user's login status
  function statusChangeCallback(response) {
    if (response.status === "connected") {
      console.log("User is logged in and has authorized your app.");
    } else {
      console.log("User is not logged in or has not authorized your app.");
    }
  }


