function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	

	var first_date = tweet_array[0].time;
	var last_date = tweet_array[0].time;
	var completed = 0;
	var live = 0;
	var achievements = 0;
	var misc = 0;

	var completed_and_written = 0;
	
	for(var i = 0;i < tweet_array.length;i++)
	{

		if(tweet_array[i].time < first_date)
		{
			first_date = tweet_array[i].time;
		}
		if(tweet_array[i].time > last_date)
		{
			last_date = tweet_array[i].time;
		}
		
		if(tweet_array[i].source == "completed_event")
		{
			completed += 1;
			if(tweet_array[i].written == true)
			{
				completed_and_written++;
			}
			//console.log(tweet_array[i].distance);
		}
		else if(tweet_array[i].source == "live_event")
		{
			live += 1;
		}
		else if(tweet_array[i].source == "achievement")
		{
			achievements += 1;
		}
		else if(tweet_array[i].source == "miscellaneous")
		{
			misc += 1;
		}

		
	}
	
	var options = {weekday:'long', year:'numeric',month:'long',day:'numeric',timeZone:'UTC'};
	document.getElementById("firstDate").innerText = first_date.toLocaleDateString('en-US',options);
	document.getElementById("lastDate").innerText = last_date.toLocaleDateString('en-US',options);

	document.getElementsByClassName("completedEvents")[0].innerText = completed;
	document.getElementsByClassName("completedEventsPct")[0].innerText = ((completed/tweet_array.length) * 100).toFixed(2) + "%";	
	
	document.getElementsByClassName("liveEvents")[0].innerText = live;
	document.getElementsByClassName("liveEventsPct")[0].innerText = ((live/tweet_array.length) * 100).toFixed(2) + "%";	

	document.getElementsByClassName("achievements")[0].innerText = achievements;
	document.getElementsByClassName("achievementsPct")[0].innerText = ((achievements/tweet_array.length) * 100).toFixed(2) + "%";	

	document.getElementsByClassName("miscellaneous")[0].innerText = misc;
	document.getElementsByClassName("miscellaneousPct")[0].innerText = ((misc/tweet_array.length) * 100).toFixed(2) + "%";	

	document.getElementsByClassName("completedEvents")[1].innerText = completed;
	document.getElementsByClassName("written")[0].innerText = completed_and_written;

	document.getElementsByClassName("writtenPct")[0].innerText = ((completed_and_written/completed) * 100).toFixed(2) + "%";	

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});