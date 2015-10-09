#Helios.js - v0.2
---
Google Analytics rollup reporting made easy. 
##Simple Google Analytics tracking for any website

Helios.js enables you to implement [rollup analytics reporting](http://www.optimizesmart.com/implementing-rollup-reporting-google-universal-analytics/) on your websites to create meaningful statistics for your brand, company, or every-other-weekend hobby project on a new level.
##Track all your properties at once

Helios.js allows you to track visitors on multiple websites in a single Analytics property as well as their respective properties, including pageviews, events and conversions. Helios.js supports an unlimited amount of Universal Analytics properties for sending visitor data to out of the box, without unnecessary configuration.
##Send events to multiple properties
---
####Setup
To start tracking your visitors with Helios, all you need is a JSON manifest of the Google Analytics properties you want to send data to. Simply call `Helios.init()` passing your configuration object as parameter. A basic configuration object looks like this:
```javascript
{
    "primary"   : "UA-XXXXX-XX",    //A UA code string
    "secondary" : [                 //An array containing any amount of valid UA code strings
        "UA-YYYYY-YY",
        "UA-ZZZZZ-ZZ"
    ],
    "events"    : []                //An array of event objects. Refer to the Custom events section.
}
```
Here, Helios will send your data to the properties marked by all UA codes listed above.
####Custom events
Setting up events to track is simple with Helios's  JSON interface for creating event trackers. An event tracker object is defined using the following basic markup:
```javascript
{
    "selector"  : "#example-id",    //A CSS selector to be used as the event's trigger (string)
    "category"  : "example_cat",    //A category name under which the event will appear in GA (string)
    "action"    : "example_action", //An action name under which the event will appear in GA (string)
    "label"     : "example_label",  //A label under which the event will appear in GA (string)
    "value"     : 0                 //The value associated with the event in GA (int)
}
```
To make changes to the events tracked by Helios on the fly, you can create any number of arbitrary event objects and simply push these values to the `Helios.events` array and call `Helios.trackEvents()` .
####Complete example
Putting it all together, here is a sample snippet that initializes Helios with multiple UA properties and some custom events:
```javascript
var config = {
    "primary"   : "UA-XXXXX-XX",
    "secondary" : [
        "UA-YYYYY-YY",
        "UA-ZZZZZ-ZZ"
    ],
    "events"    : [
        {
            "selector"  : "#example-id",
            "category"  : "example_cat",
            "action"    : "example_action",
            "label"     : "example_label",
            "value"     : 0   
        },
        {
            "selector"  : "#another-id",
            "category"  : "another_cat",
            "action"    : "another_action",
            "label"     : "another_label",
            "value"     : 10   
        }
    ]
};

Helios.init(config);
```
From here, Helios will take care of injecting all the necessary APIs into the page, creating the trackers for all UA properties listed and listen to clicks on the specified selectors, sending the event data specified in the event objects to all linked properties. Forget about tracking code scattered all over the page and inside event handlers, just specify your tracking needs and Helios will gather all the necessary data for you.
##Track your AdWords conversions
---
*Coming soon...*
##Track your YouTube videos
*Coming soon...*
### API
Helios provides wrappers for the Universal Analytics API as well as methods of controlling the way events are sent to your different properties on the fly. There is no unnecessarily complicated API to learn here, just the same old methods you are used to when working with Analytics events with some added sugar.
```javascript
Helios.sendEvent(category, action, label, value)
```
The `sendEvent()` method is a wrapper for `ga('send', 'event', ...)` and takes the same order of parameters. It sends the same event data to all linked properties in real time.
```javascript
Helios.sendPageview()
```
The `sendPageview()` method is a wrapper for `ga('send', 'pageview')` and takes no additional parameters.