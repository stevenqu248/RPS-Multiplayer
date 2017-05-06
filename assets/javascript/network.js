// Initialize Firebase (YOUR OWN APP)
var config = 
{
	apiKey: "AIzaSyAJS4YQWU5DmESeYueG1qH1NGkjv3DncEY",
    authDomain: "hello-kitty-31635.firebaseapp.com",
    databaseURL: "https://hello-kitty-31635.firebaseio.com",
    storageBucket: "hello-kitty-31635.appspot.com"
};

firebase.initializeApp(config);

var database = firebase.database();
var User1;
var User2;
var playerPosition = null;
var slot1Ref, slot2Ref;

// a listener for value changes for the User1 value in the database
database.ref("User1").on("value",function(snapshot)
{
	// check if there is data there
	if(snapshot.val() != null)
	{
		console.log(snapshot.val());
		User1 = snapshot.val();
	}
});

// a listener for value changes for the User2 value in the database
database.ref("User2").on("value",function(snapshot)
{
	// check if there is data there
	if(snapshot.val() != null)
	{
		console.log(snapshot.val());
		User2 = snapshot.val();
	}
});

// a listener for connecting to the game
$(document).on("click", "#connect-btn",function(event)
{
	event.preventDefault();

	// if not already connected
	if(playerPosition == null)
	{
		// if spot 1 is open
		if(User1 == "VACANT")
		{
			// set up a listener for if the user disconnects
			slot1Ref = database.ref("User1");
			slot1Ref.onDisconnect().set("VACANT");

			// then modify server data
			slot1Ref.set("CONNECTED");
			playerPosition = "User1";
			console.log(playerPosition);
		}

		// else if spot 2 is open
		else if(User2 == "VACANT")
		{
			// set up a listener for if the user disconnects
			slot2Ref = database.ref("User2");
			slot2Ref.onDisconnect().set("VACANT");

			// then modify server data
			slot2Ref.set("CONNECTED");
			playerPosition = "User1";
			console.log(playerPosition);
		}

		// let the user know that all available slots are full
		else
		{

		}
	}
});

// a listener for disconnecting from the game
$(document).on("click", "#disconnect-btn", function(event)
{
	event.preventDefault();

	if(playerPosition != null)
	{
		var slotRef = database.ref(playerPosition);
		slotRef.set("VACANT");
	}
});