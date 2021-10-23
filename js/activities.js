function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	tweet_array_json = [];

	activity_count_obj = {};
	total_mi_per_activity_obj = {};
	averages_per_activity_obj = {};
	for(var i = 0;i < tweet_array.length;i++)
	{

		if(tweet_array[i].activityType != "" && tweet_array[i].distance != 0 && (Object.keys(activity_count_obj)).indexOf(tweet_array[i].activityType) == -1)
		{
			activity_count_obj[tweet_array[i].activityType] = 1;
			total_mi_per_activity_obj[tweet_array[i].activityType] = tweet_array[i].distance;
			tweet_array_json.push({"activity":tweet_array[i].activityType, "distance":tweet_array[i].distance,"day":tweet_array[i].time.getDay()})
		}
		else if(tweet_array[i].activityType != "" && tweet_array[i].distance != 0)
		{
			activity_count_obj[tweet_array[i].activityType] += 1;
			total_mi_per_activity_obj[tweet_array[i].activityType] += tweet_array[i].distance;
			tweet_array_json.push({"activity":tweet_array[i].activityType, "distance":tweet_array[i].distance,"day":tweet_array[i].time.getDay()})
		}
	}
	var array_of_activities = Object.keys(activity_count_obj);
	var array_of_items = [];
	for(var i = 0; i< array_of_activities.length; i++)
	{
		averages_per_activity_obj[array_of_activities[i]] = total_mi_per_activity_obj[array_of_activities[i]]/activity_count_obj[array_of_activities[i]];
		array_of_items.push([array_of_activities[i],activity_count_obj[array_of_activities[i]]]);
	}

	document.getElementById("numberActivities").innerText = Object.keys(activity_count_obj).length;

	array_of_items.sort(function(a,b){ return (b[1]-a[1])});
	document.getElementById("firstMost").innerText = array_of_items[0][0];
	document.getElementById("secondMost").innerText = array_of_items[1][0];
	document.getElementById("thirdMost").innerText = array_of_items[2][0];
	var averages = [];
	for(var i = 0;i< 3; i++)
	{
		averages.push([array_of_items[i][0], averages_per_activity_obj[array_of_items[i][0]]]);
	}
	averages.sort(function(a,b){return (b[1]-a[1])})
	document.getElementById("longestActivityType").innerText = averages[0][0];
	document.getElementById("shortestActivityType").innerText = averages[2][0];

	var days_of_week = {0:"Sunday", 1:"Monday",2:"Tuesday",3:"Wednesday",4:"Thursday",5:"Friday",6:"Saturday"};

	var longest_activity = averages[0][0];
	var longest_activity_distance = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0};
	var longest_activity_counter = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0};

	var second_longest_activity = averages[1][0];
	var second_longest_activity_distance = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0};
	var second_longest_activity_counter = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0};

	var third_longest_activity = averages[2][0];
	var third_longest_activity_distance = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0};
	var third_longest_activity_counter = {0:0, 1:0,2:0,3:0,4:0,5:0,6:0};

	graph_2_json = [];

	for(var i = 0; i< tweet_array.length;i++)
	{
		if(tweet_array[i].activityType == longest_activity)
		{

			longest_activity_distance[tweet_array[i].time.getDay()] += tweet_array[i].distance;
			longest_activity_counter[tweet_array[i].time.getDay()] += 1;
			graph_2_json.push({"activity":tweet_array[i].activityType,"day":days_of_week[tweet_array[i].time.getDay()],"distance":tweet_array[i].distance})

		}
		else if(tweet_array[i].activityType == second_longest_activity)
		{


			second_longest_activity_distance[tweet_array[i].time.getDay()] += tweet_array[i].distance;
			second_longest_activity_counter[tweet_array[i].time.getDay()] += 1;
			graph_2_json.push({"activity":tweet_array[i].activityType,"day":days_of_week[tweet_array[i].time.getDay()],"distance":tweet_array[i].distance})

			
		}
		else if(tweet_array[i].activityType == third_longest_activity)
		{

			third_longest_activity_distance[tweet_array[i].time.getDay()] += tweet_array[i].distance;
			third_longest_activity_counter[tweet_array[i].time.getDay()] += 1;
			graph_2_json.push({"activity":tweet_array[i].activityType,"day":days_of_week[tweet_array[i].time.getDay()],"distance":tweet_array[i].distance})

			
		}
	}
	var average_weekend = (longest_activity_distance[6] + longest_activity_distance[0])/(longest_activity_counter[6] + longest_activity_counter[0]);
	var average_weekday = (longest_activity_distance[1] + longest_activity_distance[2]+ longest_activity_distance[3]+ longest_activity_distance[4]+ longest_activity_distance[5])/(longest_activity_counter[1] + longest_activity_counter[2]+ longest_activity_counter[3]+ longest_activity_counter[4]+ longest_activity_counter[5]);
	if(average_weekend > average_weekday)
	{
		document.getElementById("weekdayOrWeekendLonger").innerText = "weekends";
	}
	else
	{
		document.getElementById("weekdayOrWeekendLonger").innerText = "weekdays";
	}
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": tweet_array_json
	  },
	  //TODO: Add mark and encoding
	  "mark":"bar",
	  "encoding":
	  {
		  "y":
		  {
			  "field": "activity",
			  "type":"ordinal"
		  },
		  "x":
		  {
			  "aggregate":"count",
			  "field":"activity",
			  "type":"quantitative",
			  "axis":
			  {
				  "title":"number of activity"
			  }
		  }
	  }
	  
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	
	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v4.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": graph_2_json
		},
		//TODO: Add mark and encoding
		"mark":"point",
		"encoding":
		{
			"color":
			{
				"field": "activity",
				"type":"nominal",

			},
			"y":
			{
				"field": "distance",
				"type":"quantitative"
			},
			"x":
			{
				"field":"day",
				"type":"ordinal",
				"sort":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				"axis":
				{
					"title":"time(day)"
				}
			}
		}
		
	  };
	  vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});


	  distance_vis_aggregate_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v4.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
		  "values": graph_2_json
		},
		//TODO: Add mark and encoding
		"mark":"point",
		"encoding":
		{
			"color":
			{
				"field": "activity",
				"type":"nominal",

			},
			"y":
			{
				"aggregate":"mean",
				"field": "distance",
				"type":"quantitative"
			},
			"x":
			{
				"field":"day",
				"type":"ordinal",
				"sort":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
				"axis":
				{
					"title":"time(day)"
				}
			}
		}
		
	  };
	  vegaEmbed('#distanceVisAggregated', distance_vis_aggregate_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	document.getElementById("aggregate").innerText = "Show means";
	//console.log(document.getElementById("aggregate").innerText == "Show means");
	document.getElementById("distanceVis").hidden = false;
	document.getElementById("distanceVisAggregated").hidden = true;

	document.getElementById("aggregate").addEventListener("click",function()
	{
		if(document.getElementById("aggregate").innerText == "Show means")
		{
			document.getElementById("aggregate").innerText = "Show all activities";
			document.getElementById("distanceVis").hidden = true;
			document.getElementById("distanceVisAggregated").hidden = false;

		}
		else if(document.getElementById("aggregate").innerText == "Show all activities")
		{
			document.getElementById("aggregate").innerText = "Show means";
			document.getElementById("distanceVis").hidden = false;
			document.getElementById("distanceVisAggregated").hidden = true;
		}
	});




}
//document.getElementById("aggregate").toggle("distance_vis_aggregate_spec");
//Wait for the DOM to load



document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});