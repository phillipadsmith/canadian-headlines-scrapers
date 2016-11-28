var _ = require('underscore');
var Sugar = require('sugar-date');

// Configuration
var config = require('config');
var wireServices = config.get('wireServices');


// Load the scrapers via the index.js in /scrapers 
var Scrapers = require('./scrapers/'); 

// Database
var db = require('./models.js');

function fixRelativeUrls (article) {
    // Make relative URLs absolute
    // Handled in each scraper for now, might come back to this
}

function checkByline(article) {
    // Skim byline to look for known wire services
    var re = new RegExp(wireServices.join("|"), 'gi');
    if ( re.test(article.story_byline) ) {
        article.third_party = 'True';
    }
    return article;
}

function guessThirdParty(article) {
    // Set the flag based on some criteria
    var url = article.story_byline_url;
    if ( url && url.match(/http/) ) {
        article.third_party = 'Not likely';
    } else { 
        article.third_party = 'Likely';
    }

    return article;
}

function fixDate(article) {
    // Fix up crazy range of dates that sites use
    var newDate = Sugar.Date.create(article.story_date); 
    article.story_date = Sugar.Date.short(newDate);
    return article;
}

function processArticles(articles) {
    _.each(articles, function(article) {
      console.log('Working on ' + article.story_url );
      // Do some clean up & standardization of the object
      article = fixDate(article);
      article = guessThirdParty(article);
      article = checkByline(article);

      db.Headline.findOrCreate({ where: { story_url: article.story_url }, defaults: article })
      .spread(function(user, created) {
        //console.log(user.get({
          //plain: true
        //}));
        //console.log(created);
        /*
          created: true
        */
      });
    });
}

_.each(Scrapers, function(scraper) {
    console.log('Running ' + scraper.getName() );
    scraper.getArticles(processArticles);
});
