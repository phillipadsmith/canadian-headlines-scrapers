var osmosis = require('osmosis');

var site    = 'CBC News NS';
var baseUrl = 'http://cbc.ca';

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://www.cbc.ca/news/canada/nova-scotia/headlines')
    .find('.topstories a')
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[name="description"]@content',
        'story_byline': '.spaced',
        'story_byline_url' : '.spaced a@href',
        "story_date"        :  'meta[name="date"]@content',
        "category"          : 'meta[property="article:section"]@content'
    })
    .data(function(article) {
        // Massage data
        var relativeURL = article.story_url;
        article.story_url = baseUrl + relativeURL;
        
        var relativeBylineUrl = article.story_byline_url;
        if ( relativeBylineUrl ) {
            article.story_byline_url = baseUrl + relativeBylineUrl;
        }

        article.site = site;
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
