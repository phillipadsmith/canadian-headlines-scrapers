var osmosis = require('osmosis');

var site    = 'The Hamilton Spectator';
var baseUrl = 'http://www.thespec.com';

// TODO 
// - [ ] Capture odd attribution for Associated Press, after the article in a p tag

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://www.thespec.com/hamilton')
    .find("//h3/a[contains(@href, 'news') or contains(@href, 'local')]")
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[property="og:description"]@content',
        "story_byline"      :  'a.printable-author',
        "story_byline_url"  :  'a.printable-author@href',
        "story_date"        :  '.printable-date',
        "category"          : 'meta[itemprop="articleSection"]@content'
    })
    .data(function(article) {
        // Massage data
        article.site = site;

        var relativeURL = article.story_url;
        article.story_url = baseUrl + relativeURL;
       
        // Hamilton Spectator specific
        // - Handle oddness in bylines
        var relativeBylineUrl = article.story_byline_url;
        if ( relativeBylineUrl != '#' && relativeBylineUrl !== undefined )  {
            article.story_byline_url = baseUrl + relativeBylineUrl;
        }

        articles.push(article);
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

