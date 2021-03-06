KadOHui = (typeof KadOHui !== 'undefined') ? KadOHui : {};

KadOHui.Demo = function(bierQuery) {

	this.bierQuery = bierQuery;

	this.namespace = $("#demo_namespace");
	this.primaryId = $("#demo_id");
	this.startKey = $("#demo_start_index");
	this.size = $("#demo_size");
	this.name = $("#name");
	this.surname = $("#surname");
	this.age = $("#age");
	this.country = $("#country");
	this.date = $("#date");
	this.address = $("#address");

	this.submit = $("#submit_populate");

	this.initExecutor();
};

KadOHui.Demo.prototype = {
	initExecutor : function() {
		var that = this;
		var randomNumberUpToFive = function() {
			return Math.floor((Math.random() * 4) + 1);
		};

		var add = function(nameArray, name, value) {
			nameArray[name] = value;
		};

		var checkData = function() {
			var answer = true;
			if (that.namespace.val() === "" || that.primaryId.val() === "" || that.startKey.val() === ""
					|| that.size.val() === "") {
				answer = false;
			}
			return answer;
		};

		var buildInsertSQL = function(namespace, columns, values) {
			return [ 'INSERT INTO', namespace, '(', columns, ', KEEP_ALIVE ) VALUES (', values, ', 2);' ].join(' ');
		};

		var preparaValues = function(primaryValue, array) {
			var answer = [];
			answer[0] = primaryValue;
			var i = 1;
			Object.keys(array).forEach(function(elem) {
				answer[i] = array[elem];
				i++;
			});
			return answer.join(', ');
		};

		var prepareColumns = function(primaryKey, arrayKeys) {
			return primaryKey + ", " + arrayKeys.join(',');
		};

		var createSql = function(namespace, primaryKey, primaryKeyValue) {
			var array = {};
			if (that.name.hasClass('active')) {
				add(array, 'Name', that.names[randomNumberUpToFive()]);
			}

			if (that.surname.hasClass('active')) {
				add(array, 'Surname', that.surnames[randomNumberUpToFive()]);
			}

			if (that.age.hasClass('active')) {
				add(array, 'Age', that.ages[randomNumberUpToFive()]);
			}

			if (that.country.hasClass('active')) {
				add(array, 'Country', that.countries[randomNumberUpToFive()]);
			}

			if (that.date.hasClass('active')) {
				add(array, 'Date', that.date[randomNumberUpToFive()]);
			}

			if (that.address.hasClass('active')) {
				add(array, 'Address', that.addresses[randomNumberUpToFive()]);
			}

			return buildInsertSQL(namespace, prepareColumns(primaryKey, Object.keys(array)), preparaValues(
					primaryKeyValue, array));
		};

		var insertInDatabase = function(namespace, key, data) {
			BIERstorage.Node.put(namespace, key, data, 2, function(data) {
			});

		};

		var createObject = function(primaryId, value) {
			var result = {};
			result[primaryId] = value;

			if (that.name.hasClass('active')) {
				result['Name'] = that.names[randomNumberUpToFive()];
			}

			if (that.surname.hasClass('active')) {
				result['Surname'] = that.surnames[randomNumberUpToFive()];
			}

			if (that.age.hasClass('active')) {
				result['Age'] = that.ages[randomNumberUpToFive()];
			}

			if (that.country.hasClass('active')) {
				result['Country'] = that.countries[randomNumberUpToFive()];
			}

			if (that.date.hasClass('active')) {
				result['Date'] = that.date[randomNumberUpToFive()];
			}

			if (that.address.hasClass('active')) {
				result['Address'] = that.addresses[randomNumberUpToFive()];
			}

			return result;
		};

		var spawn = function(start, end) {
			for (var i = start; i < end; i++) {
				var data = createObject(that.primaryId.val(), i);
				insertInDatabase(that.namespace.val(), i, data);
			}
			

		};

		var onExecute = function() {
			if (!checkData() || parseInt(that.size.val()) > 101) {
				alert("All fields should be setted and size no more than 100.");
			} else {

				var currentId = parseInt(that.startKey.val());
				var size = currentId + parseInt(that.size.val());
				var processed = currentId;
				console.log(size + " " + currentId);
				var emiter = new emiterBuilder.EventEmitter();

				emiter.on("DATA", function(data) {

					console.log(data)

				})
				emiter.on("FINISHED", function() {
					processed++;
					if (processed == size)
						alert("Finished")
				});

				emiter.on("ERROR", function(err) {
					processed++;
					if (processed == size)
						alert("Finished")
				});
				var allR = Math.round(size / 100);
				var currentSize = currentId + size;
				spawn(currentId,size);
				
			}
		};
		this.submit.click(onExecute);
	},

	names : [ "Tom", "Alex", "Kate", "John", "Joan" ],
	addresses : [ "Street 1", "Street 2", "Street 3", "Street 4", "Street 5" ],
	surnames : [ "Simeon", "Down", "Burns", "Tester", "Surname" ],
	dates : [ new Date() + 100, new Date() + 500000, new Date() + 323525, new Date() + 1, new Date() + 10000 ],
	countries : [ "BG", "GB", "US", "RU", "CA" ],
	ages : [ 18, 41, 19, 23, 22 ]

};