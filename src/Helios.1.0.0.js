/***********************************************************************

	Initializer
	
***********************************************************************/

function Helios(config) {
	
	// Config vars
	this.properties = config.properties;
	this.events 	= !!config.events 		? config.events 	|| false;
	this.bounceTime = !!config.bounceTime 	? config.bounceTime || false;
	
	// Internals
	this.trackers 	= [];
	this.nextName 	= "A";
	
	// Initialization
	this.injectAnalytics();
	this.createTrackers();
	this.sendPageView();
	
	if (this.events) {
		this.trackEvents();
	};
	
	if (this.bounceTime) {
		this.setBounceTimeout();
	};
};
	
/***********************************************************************

	Main methods
	
	1) Send page view
	2) Send event
	3) Setup event tracking
	4) Track single event
	5) Setup bounce timeout
	6) Setup trackers
	
***********************************************************************/

Helios.prototype.sendPageView = function() {
	
	this.trackers.map(this.gaPageView);
};

Helios.prototype.sendEvent = function(eventObj) {
	
	this.trackers.map(function(tracker) {
		this.gaEvent(tracker, eventObj);
	});	
};
	
Helios.prototype.trackEvents = function() {
	
	this.events.map(this.trackEvent.bind(this));
};
	
Helios.prototype.trackEvent = function(eventObj) {
	
	var selector 	= eventObj.selector,
		eventType 	= !!eventObj.type ? eventObj.type : 'click';
	
	this.bindEvent(selector, eventType, function() {
		this.sendEvent(eventObj);
	});
};
	
Helios.prototype.setBounceTimeout = function() {
	
	setTimeout(this.unbounceVisit.bind(this), this.bounceTime);
};
	
Helios.prototype.createTrackers = function() {
	
	this.properties.map(this.createTracker.bind(this));
};

/***********************************************************************

	Utility 
	
	1) Inject GA tracking code
	2) Create new tracker
	3) Increment tracker name
	4) Send single pageview
	5) Send single event
	6) Unbounce visitor
	7) Attach DOM event listener
	8) Crossbrowser event
	
***********************************************************************/
	
Helios.prototype.injectAnalytics = function() {
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
};

Helios.prototype.createTracker = function(UA) {
	var trackerName = this.nameTracker();
	ga('create', UA, {name: trackerName});

	return trackerName;
};
	
Helios.prototype.nameTracker = function() {
	
	var charCode = this.tracker.charCodeAt(),
		nextCode = charCode + 1,
		nextChar;
	
	if ((nextCode >= 65) && (nextCode <= 90)) {
		
		nextChar = String.fromCharCode(nextCode);
		this.nextName = nextChar;
		
		return nextChar;
	
	} else {
		
		return false;
	}
};

Helios.prototype.gaPageView = function(tracker) {
	ga(tracker+'.send', 'pageview');
};

Helios.prototype.gaEvent = function(tracker, eventObj) {
	
	var category 	= !!eventObj.category 	? eventObj.category : 'Helios_default_event',
		action		= !!eventObj.action 	? eventObj.action 	: 'Helios_default_action',
		label 		= !!eventObj.label 		? eventObj.label 	: 'Helios_default_label',
		value 		= !!eventObj.value 		? eventObj.value 	: 0;
	
	ga(tracker+'.send', 'event', category, action, label, value);
};

Helios.prototype.unbounceVisit = function() {
	
	var secsOnPage = this.bounceTime / 1000;
	this.sendEvent('Visit', 'Non-bounce visit', 'Time spent on page: '+secsOnPage+'s', 0);
};

Helios.prototype.bindEvent = function(selector, type, event) {
	
	var elements = document.querySelectorAll(selector);
	
	for (var i = 0; i < elements.length; i++) {
		
		this.standardEvent(elements[i], type, event);
	}
};

Helios.prototype.standardEvent = function(element, type, event) {
	
	if (element.addEventListener) {
		
		element.addEventListener(type, function() {
			this.sendEvent(event);
		});
		
	} else if (element.attachEvent) {
		
		element.attachEvent('on'+type, function() {
			this.sendEvent(event);
		});
	}
};
