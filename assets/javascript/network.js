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
// var messager = firebase.messaging();
var User1, User2, slot1Ref, slot2Ref, User1Choice, User2Choice, choiceRef, playerChat, opponentChat, chatTimer;
var playerPosition = null;
var winCount = 0;
var lossCount = 0;

// a listener for value changes in the database
database.ref().on("value", function(snapshot)
{
	console.log(snapshot.val());
	User1 = snapshot.val().User1;
	User2 = snapshot.val().User2;
	User1Choice = snapshot.val().User1Choice;
	User2Choice = snapshot.val().User2Choice;

	// Get the chat data
	if(playerPosition == "User1")
	{
		playerChat = snapshot.val().User1Chat;
		opponentChat = snapshot.val().User2Chat;
	}

	// Get the chat data
	else if(playerPosition == "User2")
	{
		playerChat = snapshot.val().User2Chat;
		opponentChat = snapshot.val().User1Chat;
	}

	// And put the chat on the screen
	if(playerPosition != null)
	{
		$("#player-chat").text("Player's message: " + ((playerChat != "NONE")? playerChat : ""));
		$("#opponent-chat").text("Opponent's message: " + ((opponentChat != "NONE")? opponentChat : ""));
	}

	// if both User1 and User2 are connected
	if(User1 == "CONNECTED" && User2 == "CONNECTED" && playerPosition != null)
	{
		// and the game isn't created yet
		if(!gameInitialized)
		{
			initializeGame();
			var playerName = $("#name");
			playerName.append((playerPosition == "User1")? "Player 1": "Player 2");

			// clean up the screen
			$("#system-message").empty();
		}
	}

	// otherwise
	else if (User1 == "VACANT" || User2 == "VACANT")
	{
		// if the game is running
		if(gameInitialized)
		{
			$("#name").empty();
			shutdownGame();
			playerPosition = null;
		}
	}

	if(User1Choice != "NONE" && User2Choice != "NONE" && playerPosition != null)
	{
		console.log(User1Choice + " " + User2Choice);
		var winner = checkForWin(User1Choice, User2Choice);
		User1Choice = User2Choice = "NONE";

		// I don't need to do a listener because I'm setting it to something I want even if they disconnect
		choiceRef = database.ref(playerPosition + "Choice");
		choiceRef.set("NONE");
		
		// if the player won
		if(playerPosition == winner)
		{
			winCount++;
		}

		// if the player lost
		else if(playerPosition != winner && winner != "Neither")
		{
			lossCount++;
		}

		// and update the scoreboard
		$("#score").text("Wins: " + winCount + " | Losses: " + lossCount);
	}

});

// a listener for connecting to the game
$(document).on("click", "#connect-btn",function(event)
{
	event.preventDefault();

	// if not already connected
	if(playerPosition == null)
	{
		// clean up any information that may be left over from other things
		var infoDiv = $("#system-message");
		infoDiv.empty();

		// if spot 1 is open
		if(User1 == "VACANT")
		{
			// set up a listener for if the user disconnects
			slot1Ref = database.ref("User1");
			slot1Ref.onDisconnect().set("VACANT");

			// then modify server data
			playerPosition = "User1";
			slot1Ref.set("CONNECTED");
			console.log(playerPosition);

			// inform the player of success
			if(User2 == "VACANT")
				infoDiv.append("Successfully connected to the game. Please wait for another player to join.");
		}

		// else if spot 2 is open
		else if(User2 == "VACANT")
		{
			// set up a listener for if the user disconnects
			slot2Ref = database.ref("User2");
			slot2Ref.onDisconnect().set("VACANT");

			// then modify server data
			playerPosition = "User2";
			slot2Ref.set("CONNECTED");
			console.log(playerPosition);

			// inform the player of success
			if(User1 == "VACANT")
				infoDiv.append("Successfully connected to the game. Please wait for another player to join.");
		}

		// let the user know that all available slots are full
		else
		{
			infoDiv.append("I'm sorry. All available game slots are full. Please try again at a later time.");
		}
	}
});

// a listener for disconnecting from the game
$(document).on("click", "#disconnect-btn", function(event)
{
	event.preventDefault();
	console.log(playerPosition);
	if(playerPosition != null)
	{
		var slotRef = database.ref(playerPosition);
		slotRef.set("VACANT");
		playerPosition = null;
	}
});

$(document).on("click", "#rock", function(event)
{
	event.preventDefault();
	if(playerPosition == null)
		alert("You Shouldn't be here!");
	
	else
	{
		if(playerPosition == "User1" && User1Choice == "NONE" || playerPosition == "User2" && User2Choice == "NONE")
		{
			// set up a listener for if the user disconnects
			choiceRef = database.ref(playerPosition + "Choice");
			choiceRef.onDisconnect().set("NONE");
		
			// then modify server data
			choiceRef.set("ROCK");
		}
	}
});

$(document).on("click", "#paper", function(event)
{
	event.preventDefault();
	if(playerPosition == null)
		alert("You Shouldn't be here!");

	else
	{
		//  if the player is player 1 and they haven't chosen or if the player is player 2 and they haven't chosen
		if(playerPosition == "User1" && User1Choice == "NONE" || playerPosition == "User2" && User2Choice == "NONE")
		{
			// set up a listener for if the user disconnects
			choiceRef = database.ref(playerPosition + "Choice");
			choiceRef.onDisconnect().set("NONE");

			// then modify server data
			choiceRef.set("PAPER");	
		}
	}
});

$(document).on("click", "#scissors", function(event)
{
	event.preventDefault();
	if(playerPosition == null)
		alert("You Shouldn't be here!");

	else
	{
		if(playerPosition == "User1" && User1Choice == "NONE" || playerPosition == "User2" && User2Choice == "NONE")
		{
			// set up a listener for if the user disconnects
			choiceRef = database.ref(playerPosition + "Choice");
			choiceRef.onDisconnect().set("NONE");

			// then modify server data
			choiceRef.set("SCISSORS");	
		}	
	}
});

function clearText()
{
	choiceRef = database.ref(playerPosition + "Chat");
	choiceRef.set("NONE");
}

$(document).on("click", ".chat-btn", function(event)
{
	event.preventDefault();

	console.log(event.target.textContent);
	// stop any other timers from clearing new incoming text too early
	clearTimeout(chatTimer);

	// set up a listener for if the user disconnects
	choiceRef = database.ref(playerPosition + "Chat");
	choiceRef.onDisconnect().set("NONE");

	// then modify server data
	choiceRef.set(event.target.textContent);
	chatTimer = setTimeout(clearText, 5000);
});