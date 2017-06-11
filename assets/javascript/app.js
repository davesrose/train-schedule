 $(document).ready(function() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyAFd7jImbKYCJhIpQtIKJfLaesGDLouvaQ",
      authDomain: "trainschedule-9d457.firebaseapp.com",
      databaseURL: "https://trainschedule-9d457.firebaseio.com",
      projectId: "trainschedule-9d457",
      storageBucket: "trainschedule-9d457.appspot.com",
      messagingSenderId: "300754680352"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

  $("#submit").on("click", function(e){
      e.preventDefault();

      var name = $("#train-name").val().trim();
      var destination = $("#destination").val().trim();
      var firstTime = $("#first-time").val().trim();
      var frequency = $("#frequency").val().trim();
      var minsAway;
      var nextArrival;


      database.ref().push({
          name: name,
          destination: destination,
          firstTime: firstTime,
          frequency: frequency,
          nextArrival: nextArrival,
          minsAway: minsAway
      });

      $("#train-name").val("");
      $("#destination").val("");
      $("#first-time").val("");
      $("#frequency").val("");     

  });

database.ref().on("child_added", function(snapshot){
    var snap = snapshot.val();

    console.log(snapshot.key);

    console.log(`
    name: ${snap.name}
    destination: ${snap.destination}
    firstTime: ${snap.firstTime}
    frequency: ${snap.frequency}
    `);

    var months = snap.date;
    moment(months);
    moment(months).toNow();
    var monthsWorked = moment(months).diff(moment(), "months");
 
    var trainLine = $("<div>");
    $(trainLine).addClass("row schedule-line");

    var name = $("<div>");
    $(name).addClass("col-sm-3 trainName textEntry");
    $(name).text(snap.name);
    
    var destination = $("<div>");
    $(destination).addClass("col-sm-3 trainDest textEntry");
    $(destination).text(snap.destination);
    
    var frequency = $("<div>");
    $(frequency).addClass("col-sm-2 freq textEntry");
    $(frequency).text(snap.frequency);

    var tFrequency = snap.frequency;
    var firstTime = snap.firstTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format('h:mm a');
    
    snap.nextArrival = nextTrain;

    snap.minsAway = tMinutesTillTrain;

    var nextArrival = $("<div>");
    $(nextArrival).addClass("col-sm-2 nextArrival textEntry");
    $(nextArrival).text(snap.nextArrival);    

    var minsAway = $("<div>");
    $(minsAway).addClass("col-sm-2 minsAway textEntry");
    $(minsAway).text(snap.minsAway);

    $(trainLine).append([name, destination, frequency, nextArrival, minsAway]);
    $(".schedule").append(trainLine);
});

// $(".btn").on("click", function(){
//     $("#add-employee").modal("toggle");
// });

// $(document).on("click", ".delete", function(){
//     console.log($(this).attr("key"));
//     database.ref("/"+$(this).attr("key")+"/").remove();
// });


  });