var gameInitialized = false;
var chatOptions = ["Hello.", "Hi.", "Nice move!", "Thanks.", "Good Game.", "GG.", "Ha! You suck!", "I won!", "Drat, a tie!", "Oh no, I lost!", "I'll get you next time!",
					"You've stumbled right into my trap.", "Are you there?", "Play again?", "Yes.", "No."];

function initializeGame()
{
	// add the score
	if($("#score").is(":empty"))
	{
		$("#score").text("Wins: 0 | Losses: 0");
	}

	// add the game buttons
	var gameArena = $("#game-arena");
	var choiceRow = $("<div>");
	choiceRow.attr("class", "row");
	var rockButton = $("<button>");
	var paperButton = $("<button>");
	var scissorsButton = $("<button>");
	rockButton.attr("id","rock");
	rockButton.attr("type","submit");
	rockButton.attr("class", "col-md-1 col-md-offset-3");
	rockButton.text("Rock");
	paperButton.attr("id","paper");
	paperButton.attr("type","submit");
	paperButton.attr("class", "col-md-1 col-md-offset-1");
	paperButton.text("Paper");
	scissorsButton.attr("id","scissors");
	scissorsButton.attr("type","submit");
	scissorsButton.attr("class", "col-md-1 col-md-offset-1");
	scissorsButton.text("Scissors");
	choiceRow.append(rockButton);
	choiceRow.append(paperButton);
	choiceRow.append(scissorsButton);
	gameArena.append(choiceRow);

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
	$("#system-message").empty();
	$("#canned-options").empty();
	gameInitialized = false;
	console.log("shutdown");
}

function checkForWin(User1Choice, User2Choice, playerPosition)
{
	var textChoice1 = User1Choice;
	var textChoice2 = User2Choice;
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
	infoDiv.text("You chose " + ((playerPosition == "User1")? textChoice1.toLowerCase() : textChoice2.toLowerCase()) + ". ");
	infoDiv.append("Your opponent chose " + ((playerPosition == "User1")? textChoice2.toLowerCase() : textChoice1.toLowerCase()) + ". ");
	
	if ((User2Choice + 1) % 3  == User1Choice)
	{
		// Player 1 wins
		infoDiv.append("Player 1 wins!");
    	return "User1";
	}
	
	else if ((User1Choice + 1) % 3 == User2Choice)
	{
		// Player 2 wins
		infoDiv.append("Player 2 wins!");
    	return "User2"
	}
	
	else
	{
		// it's a draw
		infoDiv.append("It's a draw!");
    	return "Neither"
	}
}