KadOHui = (typeof KadOHui !== 'undefined') ? KadOHui : {};

var emiterBuilder = require('events');

KadOHui.Control = function(node) {
	this.node = node;
	this.control = $("#control");

	this.clearLogBtn = $("#clear_btn").button();
	this.putBtn = $("#put_btn").button();
	this.sqlCode = $("#sql_code");
	this.putResult = $("#put_result");

	this.statResult = $("#stat_result");

	this.query = new BIERQuery.QueryLayerBuilder.QueryLayer(BIERstorage);

	this.initExecutor().initLogMonitor();
};

KadOHui.Control.prototype = {
	initExecutor : function() {
		// Helper method to trip a queryId
		var trimQueryId = function(queryId) {
			var start = 0;
			if (queryId.length > 10) {
				start = queryId.length - 10;
			}
			return queryId.substring(start, queryId.length);
		};
		
		var prepare = function(data) {
			var table = "<table>";
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
				table = table + "</tr></table";
			});
			return table;
		};

		var that = this;
		var tbody = this.putResult.find('tbody');
		var onExecute = function() {
			var today = new Date().getTime();
			var emiter = new emiterBuilder.EventEmitter();

			that.putBtn.unbind('click', onExecute).button('toggle');
			var sql = that.sqlCode.val();

			var success = function(success) {
				// TODO make it work for success
				tbody.append("<tr ><td  class=\"span3\" >Query " + today + " response: </td><td>" + success + "</td></tr>");
			};

			
			emiter.on("EXECUTING", function(id){
				today = trimQueryId(id);
				tbody.append("<tr><td class=\"span3\" colspan = \"2\">Executing Query " + today + "</td></tr>");
			});
			
			emiter.on("DATA", function(data) {
				// TODO Make it work for data
				tbody.append("<tr><td class=\"span3\">Query " + today + " response: </td><td>" + prepare(data) + "</td></tr>");
			});

			emiter.on("FINISHED", function() {
				tbody.append("<tr><td class=\"span3\">Query " + today + " response: </td><td>Finished</td></tr>");
			});

			emiter.on("ERROR", function(err) {
				// TODO make it work for err
				tbody.append("<tr><td class=\"span3\" >Query " + today + " response: </td><td>" + err + "</td></tr>");
			});

			emiter.on("SUCCESS", success);
			that.query.executeSQL(sql, emiter);
			that.putBtn.click(onExecute).button('toggle');
		};
		this.putBtn.click(onExecute);
		return this;
	},
	initLogMonitor : function() {
		var that = this;


		
	}
};