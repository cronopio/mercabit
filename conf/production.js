
/**
 * PRODUCTION Environment settings
 */
module.exports = function(app,express) {

  // Database connection
  //app.set('db-uri', 'mongodb://localhost/calipso-prod');
  // Testing in nodejitsu
  app.set('db-uri', 'mongodb://nodejitsu:41059a5c57e2f5b800a4ab9ae36123e5@staff.mongohq.com:10038/nodejitsudb887361138599');

  // Change to suit - this key works for calip.so
  //app.set('google-analytics-key', 'UA-17607570-4');

  // Disqus
  app.set('disqus-shortname', 'calipsojs');

  // App config
  app.set('server-url', 'http://mercabits.nodejitsu.com');

// Language mode
  app.set('language-add', false);

  app.use(express.errorHandler({ dumpExceptions: true, showStack: false }));

}
