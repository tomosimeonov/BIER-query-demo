KadOHui = (typeof KadOHui !== 'undefined') ? KadOHui : {};

var emiterBuilder = require('events');

KadOHui.Control = function(node) {
	this.node = node;
	this.control = $("#control");

	this.clearLogBtn = $("#clear_btn").button();
	this.putBtn = $("#put_btn").button();
	this.sqlCode = $("#sql_code");
	this.result = $("#result");
	
	this.queryInSystem = $("#query_table");
	
	this.query = new BIERQuery.QueryLayerBuilder.QueryLayer(BIERstorage);

	this.initExecutor();
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
			var table = "<table class=\"table table-condensed\">";
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

		var prepareData = function(query, data) {
			var html = [ '<tr class="active">', '<td class="span4">', query, '</td>', '<td class="span10">', data,
					'</td>', '</tr>' ].join('\n');
			return $(html);
		}
		
		var newQueryInSystem = function(queryId){
			var html = ['<tr class="danger">', '<td class="span4">', queryId, '</td>', '<td class="span8" id="'+ queryId + '-value">', 'Executing',
						'</td>', '</tr>' ].join('\n');
			
			return $(html);
		};
		
		var queryEnd = function(queryId) {
			var value = $("#" + queryId + "-value");
			value.replaceWith(['<td class="span8">','Finished','</td>'].join('\n'));			
		};

		var that = this;

		var onExecute = function() {
			var today = new Date().getTime();
			var emiter = new emiterBuilder.EventEmitter();

			that.putBtn.unbind('click', onExecute).button('toggle');
			var sql = that.sqlCode.val();

			emiter.on("EXECUTING", function(id) {
				today = trimQueryId(id);
				that.queryInSystem.append(newQueryInSystem(today));
			});

			emiter.on("DATA", function(data) {
				// TODO Make it work for data
				that.result.append(prepareData("Query " + today + " response:", prepare(data)));
			});

			emiter.on("FINISHED", function() {
				queryEnd(today);
			});

			emiter.on("ERROR", function(err) {
				that.result.append(prepareData("Query " + today + " response:", err));
			});

			emiter.on("SUCCESS",function(success) {
				that.result.append(prepareData("Query " + today + " response:", success));
			});
			
			that.query.executeSQL(sql, emiter);
			that.putBtn.click(onExecute).button('toggle');
		};
		this.putBtn.click(onExecute);
		return this;
	}
};