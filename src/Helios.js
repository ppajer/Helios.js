(function () {
	"use strict";
	window.Helios                  	= window.Helios                 || {};
	window.Helios.trackers         	= window.Helios.trackers        || [];
	window.Helios.primary          	= window.Helios.primary         || '';
	window.Helios.secondary        	= window.Helios.secondary       || [];
	window.Helios.events           	= window.Helios.events          || [];
	window.Helios.adwordsTracking  	= window.Helios.adwordsTracking || [];
	window.Helios.adwordsOptions   	= window.Helios.adwordsOptions  || {};
	window.Helios.current          	= window.Helios.current         || "A";
	window.Helios.bounceTimeout		= window.Helios.bounceTimeout	|| false;
	window.Helios.pauseFlag        	= false;

	//Setup
	window.Helios.init = function (config) {

		if (!window.jQuery) {
			throw new Error('Helios requires jQuery. Please include the jQuery library before calling Helios.init()!');
		}

		var primary          	= config.primary,
			secondary        	= config.secondary,
			events           	= config.events,
			adwordsOptions   	= config.adwordsOptions,
			adwordsTracking  	= config.adwordsTracking,
            youtubeTracking  	= config.youtubeTracking || false,
			bounceTimeout		= config.bounceTimeout || false;
		
		this.primary 			= primary;
		this.secondary 			= ((typeof secondary !== 'object') 			|| (!secondary.length)) 			? undefined : secondary;
		this.events 			= ((typeof events !== 'object') 			|| (!events.length))				? undefined : events;
		this.adwordsTracking 	= ((typeof adwordsTracking !== 'object') 	|| (adwordsTracking == undefined)) 	? undefined : adwordsTracking;
		this.adwordsOptions 	= ((typeof adwordsOptions !== 'object') 	|| (adwordsOptions == undefined)) 	? undefined : adwordsOptions;

		this.injectAnalytics();
		this.createTrackers();
		this.sendPageview();
		
		if (adwordsTracking) {
            this.injectAdwords();
        }
		if (youtubeTracking) {
            this.injectYoutube();
        }
				
		if (this.events !== undefined) {
			this.trackEvents();
		}
		
		if ((this.adwordsOptions !== undefined) && (this.adwordsTracking !== undefined)) {
			this.trackAdwords();
		}
		
		if (bounceTimeout) {
			this.setBounceTimeout(bounceTimeout);
		}	
	}

	window.Helios.createTrackers = function() {
		
		ga('create', this.primary, 'auto');
		if (this.secondary !== undefined) {
			for (var i = this.secondary.length - 1; i >= 0; i--) {
				var trackerName = window.Helios.nameTracker(),
					tracker 	= this.secondary[i];
				ga('create', tracker, {'name' : trackerName});
				this.trackers.push(trackerName);
			};
		};
		
	};

	window.Helios.trackEvents = function() {

			for (var i = window.Helios.events.length - 1; i >= 0; i--) {
				var current	 	= window.Helios.events[i],
					selector 	= current.selector,
					category 	= current.category,
					action 		= current.action,
					label 		= current.label || '',
					value 		= current.value || 0;

					console.log('Event tracking for '+selector+' active with category '+category);

				jQuery(selector).click(function() {
					console.log('Event submitted for '+selector);
					window.Helios.sendEvent(category, action, label, value);
				});
			};
		};


	window.Helios.trackAdwords = function() {
		
		for (var i = window.Helios.adwordsTracking.length - 1; i >= 0; i--) {
			jQuery(window.Helios.adwordsTracking[i]).click(function() {
				console.log('Adwords conversion tracked!');
				window.Helios.goog_report_conversion();
			});
		};
	};

	//API
	window.Helios.sendPageview = function() {
		ga('send', 'pageview');
		for (var i = this.trackers.length - 1; i >= 0; i--) {
			ga(this.trackers[i]+'.send', 'pageview');
			console.log(this.trackers[i]+'.send'+' = '+this.secondary[i]);
		};
	}


	window.Helios.sendEvent =  function(category, action, label, value) {
		ga('send', 'event', category, action, label, value);
		
		for (var i = this.trackers.length - 1; i >= 0; i--) {
			
			ga(this.trackers[i]+'.send', 'event', category, action, label, value);
			console.log(this.trackers[i]+'.send'+' = '+this.secondary[i]);
		};
	};
	
	window.Helios.setBounceTimeout = function(timeout) {
		var timeout = timeout || windows.Helios.bounceTimeout;	
		setTimeout(this.unbounceVisitor.bind(this), timeout);
	}
	
	window.Helios.unbounceVisitor = function() {
		this.sendEvent('Visit', 'Profitable visit', 'Non-bounce visit', 0);
	}

	//Utility
	window.Helios.nameTracker = function() {
		var charCode = this.current.charCodeAt(),
			nextCode = charCode + 1,
			nextChar = ((nextCode >= 65) && (nextCode <= 90)) ? String.fromCharCode(nextCode) : "A";
		this.current = nextChar;

		return this.current;
	};

	window.Helios.injectAnalytics = function() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	};

	window.Helios.injectAdwords = function() {
		var script 		= document.createElement('script'),
			insertion	= document.getElementsByTagName('script')[0];
		script.async 	= 1;
		script.src 		= '//www.googleadservices.com/pagead/conversion_async.js';
		insertion.parentNode.insertBefore(script, insertion);
	}

	window.Helios.goog_report_conversion = function(url) {
	    window.Helios.goog_snippet_vars();
	    window.google_conversion_format = "3";
	    var opt = new Object();
	    opt.onload_callback = function() {
	    
	    if (typeof(url) != 'undefined') {
	      window.location = url;
	    }
	  }
	  var conv_handler = window['google_trackConversion'];
	  
	  if (typeof(conv_handler) == 'function') {
	    conv_handler(opt);
	  }
	};

	window.Helios.injectYoutube = function() {
		var tag = document.createElement('script');
        tag.src = "http://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	};

	window.Helios.onPlayerStateChange = function(event) {
		handlers = this.youtubeTracking;

		 // track when user clicks to Play
        if (event.data == YT.PlayerState.PLAYING) {
           this.sendEvent(handlers.play.category, handlers.play.action, handlers.play.label, handlers.play.value);
           pauseFlag = true;
        }
        // track when user clicks to Pause
        if (event.data == YT.PlayerState.PAUSED && pauseFlag) {
           	this.sendEvent(handlers.pause.category, handlers.pause.action, handlers.pause.label, handlers.pause.value);
            pauseFlag = false;
        }
        // track when video ends
        if (event.data == YT.PlayerState.ENDED) {
            this.sendEvent(handlers.end.category, handlers.end.action, handlers.end.label, handlers.end.value);
        }
	}

	window.Helios.goog_snippet_vars = function() {
		var w = window;    
		w.google_conversion_id 			= w.google_conversion_id 		|| w.Helios.adwordsOptions.google_conversion_id;    
		w.google_conversion_label 		= w.google_conversion_label 	|| w.Helios.adwordsOptions.google_conversion_label;     
		w.google_conversion_value 		= w.google_conversion_value 	|| w.Helios.adwordsOptions.google_conversion_value;     
		w.google_conversion_currency 	= w.google_conversion_currency 	|| w.Helios.adwordsOptions.google_conversion_currency;     
		w.google_remarketing_only 		= w.google_remarketing_only 	|| w.Helios.adwordsOptions.google_remarketing_only;
	}

	//CUSTOM ID!
	function onYouTubeIframeAPIReady(event) {

		for (var i = window.Helios.youtubeTracking.length - 1; i >= 0; i--) {
			new YT.Player(window.Helios.youtubeTracking[i].selector, {
				events: {
					'onStateChange': window.Helios.onPlayerStateChange
				}
			});
		}
    }
})();
