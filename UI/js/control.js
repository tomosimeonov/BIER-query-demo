KadOHui = (typeof KadOHui !== 'undefined') ? KadOHui : {};

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

	this.initExecutor().initStatisticMonitor();
};

KadOHui.Control.prototype = {
	initExecutor : function() {
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
				table = table + "</tr>";
			});
			table = table + "</table>";

			return table;
		};

		var that = this;
		var tbody = this.putResult.find('tbody');
		var onExecute = function() {
			that.putBtn.unbind('click', onExecute).button('toggle');
			var namespace = that.putNamespace.val();
			var key = that.putKey.val();
			var sql = that.sqlCode.val();
			that.query.executeSQL(sql, function(err, response) {
				var text = "<td><tr> No matching data</tr></td>";
				if (err) {
					text = "Failed due to: " + err;
				} else {
					if (response instanceof Array) {
						if (response.length !== 0) {
							text = prepare(response);
						} else {
							text = "No matching data";
						}
					} else {
						text = "Executed, response: " + response;
					}
				}
				tbody.append("<tr><td>Query response: </td></tr><tr><td>" + text + "</td></tr>");
			});
			that.putBtn.click(onExecute).button('toggle');
		};
		this.putBtn.click(onExecute);
		return this;
	},
	initStatisticMonitor : function() {
		var that = this;
		var statisticHolder = this.query.statisticHolder;
		var statbody = this.statResult.find('statbody');
		var update = function() {
			//statbody.remove(statbody.selector);
			var text = "<p>Running: " + statisticHolder.numberOfQueries + " Avr. Performance: "
					+ statisticHolder.averageRunningTime() + "</p>";
			statbody.append(text);
		};
		statisticHolder.addListener(update);
	}
};