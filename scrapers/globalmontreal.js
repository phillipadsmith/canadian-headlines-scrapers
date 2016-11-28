var osmosis = require('osmosis');

var site    = 'Global Montreal';
var baseUrl = 'http://globalnews.ca';

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://globalnews.ca/montreal/')
    .find("section.top-stories h3 a, section.top-stories h4 a")
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[property="og:description"]@content',
        "story_byline"      :  '.story-author',
        "story_source"      :  '.story-via',
        "story_byline_url"  :  '.story-author a@href',
        "story_date"        :  '.meta-bar-date',
        "category"          : 'meta[itemprop="articleSection"]@content'
    })
    .data(function(article) {
        // Massage data
        // 
        // Global
        article.site = site;

        // Global Montreal
        // - Clean up the byline and source
        var re = /By\W+(\w+)\s(\w+)/g;
        var byline = article.story_byline.replace(re, '$1 $2');
        byline = byline + ', ' + article.story_source;
        article.story_byline = byline;
        delete article.story_source;

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
