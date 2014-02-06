KadOHui = (typeof KadOHui !== 'undefined') ? KadOHui : {};

KadOHui.Logger = function(logemitter, console_element, control_element, eventHolder) {
	var that = this;
	this.eventHolder = eventHolder;
	this.console = $(console_element);
	this.control = $(control_element);

	this.MAX = 700;

	// logemitter.onAny(function(level, log) {
	// this.append(log.ns, level, this._unshiftEvent(log.event, log.args));
	// }, this);

	var tconsole = this.console;
	var chLogLevel = function(e) {
		var value = $(e.target).val();
		if (value === "INFO") {
			that.eventHolder.setInfoLogLevel();
		}
		if (value === "FINE") {
			that.eventHolder.setFineLogLevel();
		}
		if (value === "FINER") {
			that.eventHolder.setFinerLogLevel();
		}
	};

	$('#logSelect').change(chLogLevel);

	var emiterBuilder = require('events');
	var emiter = new emiterBuilder.EventEmitter();
	emiter.on("LOG_INFO", function(data) {
		that.append("INFO", "INFO", data);
	});
	emiter.on("LOG_FINE", function(data) {
		that.append("FINE", "FINE", data);
	});
	emiter.on("LOG_FINER", function(data) {
		that.append("FINER", "FINER", data);
	});

	eventHolder.addListener(emiter);
};

KadOHui.Logger.prototype = {

	append : function(ns, level, args) {
		var el = this.template(ns, level, args, new Date());

		if (this.console.children().length > this.MAX) {
			this.console.children().last().remove();
		}
		this.console.prepend(el);
	},

	template : function(ns, level, data, time) {

		var queryId = data[0];
		var message = data[1];

		var human_time = (time.getMonth() + 1) + '/' + time.getDate() + '/' + time.getFullYear() + ' '
				+ time.toLocaleTimeString();

		var html = [
				'<div class="row ' + level + '">',
				'<div class="span1">',
				queryId,
				'</div>',
				'<div class="span1">',
				level,
				'</div>',
				'<div class="span8">',
				message,
				'</div>',
				'<div class="span1">',
				'<time rel="tooltip" datetime="' + time.toISOString() + '" title="' + human_time
						+ '" data-placement="bottom">' + time.toLocaleTimeString() + '</time>', '</div>', '</div>' ]
				.join('\n');
		return $(html);
	}
};