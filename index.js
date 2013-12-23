var storage = require("bier-storage");

storage.Node.connect(undefined, function() {
  console.log("Connected");
  storage.Node.put("test", "test", 1, null, function() {
    storage.Node.get("test", "test", function(value) {
      console.log(value);
    });
  });
});
console.log("Connecting");
