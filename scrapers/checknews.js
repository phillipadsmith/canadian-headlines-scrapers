var osmosis = require('osmosis');

var site    = 'CHEK Victoria';
var baseUrl = 'http://www.cheknews.ca/';

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://www.cheknews.ca/')
    .find('.news-list article .news-summary h3 a')
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[property="og:description"]@content',
        'story_byline': '.author a',
        'story_byline_url' : '.author a@href',
        "story_date"        :  '.updated',
        "category"          : 'meta[property="article:section"]@content'
    })
    .data(function(article) {
        // Massage data
        article.site = site;

        // CHECK Victoria
        // - Get rid of news broadcasts
        if ( article.story_byline !== 'mastercontrol' ) {
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
