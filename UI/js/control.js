KadOHui = (typeof KadOHui !== 'undefined') ? KadOHui : {};

var emiterBuilder = require('events');

KadOHui.Control = function(node) {
	this.node = node;
	this.control = $("#control");

	this.putBtn = $("#put_btn").button();
	this.putNamespace = $("#put_namespace");
	this.putKey = $("#put_key");
	this.sqlCode = $("#sql_code");
	this.putResult = $("#put_result");

	this.getBtn = $("#get_btn").button();
	this.getKey = $("#get_key");
	this.getNamespace = $("#get_namespace");
	this.getResult = $("#get_result");

	this.messageBtn = $('#message_btn').button();
	this.messageID = $('#message_id');
	this.messageValue = $('#message_value');
	this.messageResult = $('#message_result');

	this.statResult = $("#stat_result");

	this.query = new BIERQuery.QueryLayerBuilder.QueryLayer(BIERstorage);

	this.initExecutor().initLogMonitor();
};

KadOHui.Control.prototype = {
	initExecutor : function() {
		var prepare = function(data) {
			var table = "";
			if (data[0] !== undefined) {
				table = table + "<tr>";
				for ( var key in data[0]) {
					if (data[0].hasOwnProperty(key)) {
						table = table + "<td>" + key + "</td>";
					}
				}
				table = table + "</tr>";
			}
			data.forEach(function(element) {
				table = table + "<tr>";
				for ( var key in element) {
					if (element.hasOwnProperty(key)) {
						table = table + "<td>" + element[key] + "</td>";
					}

				}
				table = table + "</tr>";
			});
			return table;
		};

		var that = this;
		var tbody = this.putResult.find('tbody');
		var onExecute = function() {
			var today = new Date().getTime();
			var emiter = new emiterBuilder.EventEmitter();

			that.putBtn.unbind('click', onExecute).button('toggle');
			var namespace = that.putNamespace.val();
			var key = that.putKey.val();
			var sql = that.sqlCode.val();

			var success = function(success) {
				// TODO make it work for success
				tbody.append("<tr><td>Query " + today + " response: </td><td>" + success + "</td></tr>");
			};

			emiter.on("DATA", function(data) {
				// TODO Make it work for data
				tbody.append("<tr><td>Query " + today + " response: </td></tr>" + prepare(data));
			});

			emiter.on("FINISHED", function() {
				tbody.append("<tr><td>Query " + today + " response: </td><td>Finished</td></tr>");
			});

			emiter.on("ERROR", function(err) {
				// TODO make it work for err
				tbody.append("<tr><td>Query " + today + " response: </td><td>" + err + "</td></tr>");
			});

			emiter.on("SUCCESS", success);

			tbody.append("<tr><td>Executing Query " + today + "</td></tr>");

			that.query.executeSQL(sql, emiter);
			that.putBtn.click(onExecute).button('toggle');
		};
		this.putBtn.click(onExecute);
		return this;
	},
	initLogMonitor : function() {
		var that = this;
		var eventHolder = this.query.eventHolder;
		var statbody = this.statResult.find('statbody');
		var emiter = new emiterBuilder.EventEmitter();
		emiter.on("LOG_INFO", function(data) {
			var text = "<p>[INFO LOG]: " + data + "</p>";
			statbody.append(text);
		});
		emiter.on("LOG_FINE", function(data) {
			var text = "<p>[FINE LOG]: " + data + "</p>";
			statbody.append(text);
		});
		emiter.on("LOG_FINER", function(data) {
			var text = "<p>[FINER LOG]: " + data + "</p>";
			statbody.append(text);
		});

		eventHolder.addListener(emiter);
	}
};