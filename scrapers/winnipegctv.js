var osmosis = require('osmosis');

var site    = 'CTV Winnipeg';
var baseUrl = 'http://winnipeg.ctvnews.ca';

// TODO 
// - [ ] Capture odd attribution for Associated Press, after the article in a p tag

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://winnipeg.ctvnews.ca/')
    .find('.columnsplitter.container.twoColumns.none li a')
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title"       : 'title',
        "story_description" : 'meta[name="description"]@content',
        'story_byline'      : 'meta[name="author"]@content, div.s-data',
        "story_date"        : 'meta[name="dc.date.modified"]@content',
        "category"          : 'span.navlink.active'
    })
    .data(function(article) {
        // Massage data
        article.site = site;

        var relativeURL = article.story_url;
        if ( !(/^http/).test(relativeURL) ) { 
            article.story_url = baseUrl + relativeURL;
        }

        var relativeBylineUrl = article.story_byline_url;
        if ( relativeBylineUrl ) {
            article.story_byline_url = baseUrl + relativeBylineUrl;
        }
        // Winnipeg CTV specific
        // Pull out the actual byline
        if ( /\n+/m.test(article.story_byline) ) {
            var re = /^(\w+)\s(\w+)\s?(\w+)?[^]*/m;
            var byline = article.story_byline.replace(re, '$1 $2 $3');
            article.story_byline = byline;
        }

        // TODO remove this articles from the scape, not here
        if ( article.category === 'Video' ) {
        } else {
            articles.push(article);
        }
    })
    .error(console.log)
    .done(function() { 
        callback(articles);
    });
};

module.exports = {
    getArticles: getArticles,
    printArticles: function() { return 'stub'; },
    getName: function() { return site; },
    getURL: function() { return baseUrl; }
};

