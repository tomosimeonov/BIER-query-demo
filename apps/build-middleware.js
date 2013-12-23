var browserify = require('browserify'),
    tagify = require('tagify'),
    url   = require('url');

var storageLib = require('path').resolve(__dirname,'../node_modules/BIER-storage');
var queryLib = require('path').resolve(__dirname,'../node_modules/BIER-query');

module.exports = function(options) {
  options = options || {};
  return function(req, res, next) {
    u = url.parse(req.url, {parseQueryString : true});

    if (u.pathname === (options.mount || '/KadOH.js')) {
      var build, flags = [];

      //debug
      u.query.debug     = (u.query.debug === 'true');
      options.debug     = u.query.debug ||
                          options.debug ||
                          false;
      build = browserify({debug : options.debug});


      //transport
      options.transport = u.query.transport ||
                          options.transport ||
                          'xmpp';
      flags.push(options.transport);

      //storage
      options.storage   = u.query.storage ||
                          options.storage ||
                          'lawnchair';
      flags.push(options.storage);

      build.use(tagify.flags(flags));
      
      //entry
      options.entry      = options.entry || storageLib+'/index-browserify.js';
      options.entry = storageLib+'/index-browserify.js';
      build.addEntry(options.entry);

	//entry
      options.entry      =                      
			   queryLib+'/index-browserify.js';

	build.addEntry(options.entry);
      res.statusCode = 200;
      res.setHeader('content-type', 'text/javascript');
      res.end(build.bundle());
    }
    else next();
  };
};
