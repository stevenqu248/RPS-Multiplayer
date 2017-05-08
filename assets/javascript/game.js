var gameInitialized = false;
var chatOptions = ["Hello", "Nice move!", "Good Game", "Ha! You suck!", "I won!", "Drat, a tie!", "Oh no, I lost!", "I'll get you next time!",
					"You've stumbled right into my trap."];

function initializeGame()
{
	// add the score
	if($("#score").is(":empty"))
	{
		$("#score").text("Wins: 0 | Losses: 0");
	}

	// add the game buttons
	var gameArena = $("#game-arena");
	var rockButton = $("<button>");
	var paperButton = $("<button>");
	var scissorsButton = $("<button>");
	rockButton.attr("id","rock");
	rockButton.attr("type","submit");
	rockButton.text("Rock");
	paperButton.attr("id","paper");
	paperButton.attr("type","submit");
	paperButton.text("Paper");
	scissorsButton.attr("id","scissors");
	scissorsButton.attr("type","submit");
	scissorsButton.text("Scissors");
	gameArena.append(rockButton);
	gameArena.append(paperButton);
	gameArena.append(scissorsButton);

	// add the chat options
	for(var i = 0; i < chatOptions.length; i++)
	{
		var newButton = $("<button>");
		newButton.attr("class", "chat-btn");
		newButton.text(chatOptions[i]);
		$("#canned-options").append(newButton);
	}


	gameInitialized = true;
	console.log("initialized");
}

function shutdownGame()
{
	// clean up everything
	$("#game-arena").empty();
	$("#name").empty();
	$("#player-chat").empty();
	$("#opponent-chat").empty();
	$("#score").empty();
	$("system-message").empty();
	$("canned-options").empty();
	gameInitialized = false;
	console.log("shutdown");
}

function checkForWin(User1Choice, User2Choice)
{
	// Making the check quicker
	switch(User1Choice)
	{
		case "ROCK":
		{
			User1Choice = 0;
			break;
		}
		case "PAPER":
		{
			User1Choice = 1;
			break;
		}
		case "SCISSORS":
		{
			User1Choice = 2;
			break;
		}
	}

	switch(User2Choice)
	{
		case "ROCK":
		{
			User2Choice = 0;
			break;
		}
		case "PAPER":
		{
			User2Choice = 1;
			break;
		}
		case "SCISSORS":
		{
			User2Choice = 2;
			break;
		}
	}

	var infoDiv = $("#system-message");
	// And now for the actual check
	if ((User2Choice + 1) % 3  == User1Choice)
	{
		// Player 1 wins
		infoDiv.text("Player 1 wins!");
    	return "User1";
	}
	else if ((User1Choice + 1) % 3 == User2Choice)
	{
		// Player 2 wins
		infoDiv.text("Player 2 wins!");
    	return "User2"
	}
	else
	{
		// it's a draw
		infoDiv.text("It's a draw!");
    	return "Neither"
	}
}