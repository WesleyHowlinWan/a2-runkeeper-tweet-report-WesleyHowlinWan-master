class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        
        if(this.text.startsWith("Just"))
        {
            //Completed Event
            return "completed_event";
        }
        else if(this.text.includes(" now"))
        {
            //Live event
            return "live_event";
        }
        else if(this.text.includes("Achieved"))
        {
            return "achievement";
        }
        else
        {
            return "miscellaneous";
        }
        
       return "unknown";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if(this.source == "completed_event")
        {
            if((!this.text.includes("-")))
            {
                return false;
            }
            return true;
        }
        else
        {
            
            if((!this.text.includes("-")))
            {
                return false;
            }
            return true;
            
           return false;
        }
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        if(this.source == "completed_event")
        {
            if(this.written)
            {
                let split_text:string[] = this.text.split(" ");
                let index = split_text.indexOf("-") + 1;
                split_text = split_text.slice(index,-2)
                let string_text:string = split_text.join(" ");
                return string_text;
            }
        }
        return "";
    }

    get activityType():string {
        //TODO: parse the activity type from the text of the tweet
        if (this.source == "completed_event") {
            
            let split_text:string[] = this.text.split(" ");
            split_text = split_text.slice(0, -2);
            if(split_text.indexOf("mi") != -1)
            {

                var start_index = split_text.indexOf("mi") + 1;
                var end_index;
                if(!this.written)
                {
                    end_index = split_text.indexOf("with");

                }
                else
                {
                    end_index = split_text.indexOf("-")
                }
                //console.log(this.text + "start index" + start_index + "end index " + end_index);
                if(start_index != end_index)
                {
                    split_text = split_text.slice(start_index,end_index);
                    var string_text = split_text.join(" ");
                    return string_text;
                }
                else
                {
                    return split_text[split_text.indexOf("mi") + 1];
                }

            }
            else if(split_text.indexOf("km") != -1)
            {                
                var start_index = split_text.indexOf("km") + 1;
                var end_index;
                if(!this.written)
                {
                    end_index = split_text.indexOf("with");
                }
                else
                {
                    end_index = split_text.indexOf("-");
                }                
                //console.log(this.text + "start index" + start_index + "end index " + end_index);
                if(start_index != end_index)
                {
                    split_text = split_text.slice(start_index,end_index);
                    var string_text = split_text.join(" ");
                    //console.log(string_text);
                    return string_text;
                }
                else
                {
                    return split_text[split_text.indexOf("km") + 1];
                }
            }
            return "";
            
        }
        return "";
    }
    get distance():number {
        if (this.source == "completed_event") {
            
            let split_text:string[] = this.text.split(" ");
            split_text = split_text.slice(0, -2);


            if(split_text.indexOf("km") != -1)
            {

                return (parseFloat(split_text[split_text.indexOf("km") - 1]) / 1.609);
            }
            else if(split_text.indexOf("mi") != -1)
            {
                return parseFloat(split_text[split_text.indexOf("mi") - 1 ]);
            }
            //let string_text = split_text.join(" ");
            return 0;
            
        }
        return 0;
    }
    get text_of_tweet():string
    {
        return this.text;
    }

    
    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        if(this.activityType != "")
        {

             var string = this.text;
             var array = string.split(" ");
             for(var i = 0;i < array.length; i++)
             {
                 if(array[i].includes("https"))
                 {
                     array[i] = "<a href = " +array[i] +">" +array[i] + "</a>";
                 }
             }
             string = array.join(" ");
             return "<tr><td>" + rowNumber +"</td><td>"+this.activityType +"</td><td>" + string + "</td></tr>";

        }
        else
        {
            return "";
        }
    }
}