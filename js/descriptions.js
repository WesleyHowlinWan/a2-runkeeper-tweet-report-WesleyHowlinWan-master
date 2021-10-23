var tweet_array;
var filtered_tweets;

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});


	filtered_tweets = tweet_array.filter(function(text)
	{
		var string = document.getElementById("searchText").innerText;
		string.toLowerCase();
		return (text.written && text.activityType != "" &&text.source == "completed_event" &&((text.text_of_tweet).toLowerCase()).includes(string));
	});
	//TODO: Filter to just the written tweets

	$("#tweetTable").empty();
	document.getElementById("searchCount").innerText = 0;
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	document.getElementById("searchText").innerText = "";
	document.getElementById("textFilter").addEventListener("keyup",key =>
	{
		document.getElementById("searchText").innerText = key.target.value;

		if(key.target.value == "")
		{
			$("#tweetTable").empty();
			document.getElementById("searchCount").innerText = 0;

		}
		else
		{
			$("#tweetTable").empty();
			document.getElementById("searchCount").innerText = 0;
	
			filtered_tweets = tweet_array.filter(function(text)
			{
				var string = document.getElementById("searchText").innerText;
				return (text.written && text.activityType != "" &&text.source == "completed_event" &&((text.text_of_tweet).toLowerCase()).includes(string.toLowerCase()));
			});
			//TODO: Filter to just the written tweets
		
			document.getElementById("searchCount").innerText = filtered_tweets.length;
			var table = document.getElementById("tweetTable");
			for(var i = 0;i < filtered_tweets.length;i++)
			{
		
				$("#tweetTable").append(filtered_tweets[i].getHTMLTableRow(i + 1));
			
			}
		}

		
	
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});