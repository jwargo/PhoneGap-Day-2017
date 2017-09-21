  //Accelerometer content area on the page
  var ac;
  //Define an options object which tells the app to check the
  //accelerometer every half second
  var accelOptions = {
    frequency : 500
  };
  //Cordova Ready variable
  var cvaReady = false;
  //WatchID variable, used when cancelling a watch
  var watchID;
  var tmpStr;
  //Some constants used for alert dialogs
  dlgTitle = 'Accelerometer';
  btnText = 'Continue';

  function onBodyLoad() {
    //Let the user know we've launched
    // alert("onBodyLoad");
    //Set the Cordova deviceready event listener, so we'll know
    //when Cordova is ready
    document.addEventListener("deviceready", onDeviceReady, false);
  }

  function onDeviceReady() {
    console.log("Entering onDeviceReady");
    //Let the user know that the deviceReady event has fired
    // navigator.notification.alert("Cordova is ready", null, "Device Ready", "Continue");
    //Get a handle we'll use to manipulate the accelerometer
    //content on the page
    ac = document.getElementById('accelInfo');
    //Blank out the results area of the page as we have nothing to
    //display there right now.
    ac.innerHTML = '';
    //Set the variable that lets other parts of the program
    //know that Cordova has initialized
    cvaReady = true;
    console.log("Leaving onDeviceReady");
  }

  function startWatch() {
    console.log("Entering startWatch");
    //Is Cordova ready? If not, can't really do anything
    if (cvaReady == true) {
      //Do we already have a watch pending?
      if (!watchID) {
        //No watch pending, so we can set one
        watchID = navigator.accelerometer.watchAcceleration(onAccelSuccess, onAccelFailure, accelOptions);
        //See what the watch ID looks like
        console.log(JSON.Stringify(watchID));
      } else {
        //Watch is already pending, so why is the user
        //tapping the start button again?
        console.log('Watch already enabled, see: ' + watchID);
        navigator.notification.alert("There's already a watch enabled.", null, dlgTitle, btnText);
      }
    } else {
      console.log('Cordova is not ready yet');
      alert("Not yet, Cordova is not ready.");
    }
    console.log("Leaving startWatch");
  }

  function stopWatch() {
    console.log("Entering stopWatch");
    if (watchID) {
      console.log("Canceling the watch");
      //Cancel the watch
      navigator.accelerometer.clearWatch(watchID);
      //Clear our watchID value
      watchID = null;
      //Clear the accelerometer results
      ac.innerHTML = '';
    } else {
      console.log("No watch to cancel");
      navigator.notification.alert("No watch enabled, nothing to stop.", null, dlgTitle, btnText);
    }
    console.log("Leaving stopWatch");
  }

  function makeListItem(textStr) {
    console.log(textStr)
    return '<li class="topcoat-list__item">' + textStr + '</li>';
  }

  function onAccelSuccess(accel) {
    console.log("Entering onAccelSuccess");
    //Write the accel object contents to the console
    //so the developer can see the results
    console.log(accel);
    //We received something from the API, so...
    //first get the timestamp in a date object
    //so we can work with it
    var d = new Date(accel.timestamp);
    //Build the HTML block which will render the Accelerometer
    //readings
    tmpStr = '<ul class="topcoat-list__container"><h3 class="topcoat-list__header">Accelerometer Reading</h3>';
    tmpStr += makeListItem('X: ' + accel.x);
    tmpStr += makeListItem('Y: ' + accel.y);
    tmpStr += makeListItem('Z: ' + accel.z);
    tmpStr += makeListItem('Timestamp: ' + d.toLocaleString());
    //replace the page content with the current accelerometer reading
    ac.innerHTML = tmpStr;
    console.log("Leaving onAccelSuccess");
  }

  function onAccelFailure(errObj) {
    console.log("Entering onAccelFailure");
    console.error(errObj);
    navigator.notification.alert("Accelerometer error: " + JSON.stringify(errObj), null, dlgTitle, btnText);
    console.log("Leaving onAccelFailure");
  }