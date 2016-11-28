var osmosis = require('osmosis');

var site    = 'Regina Leader Post';
var baseUrl = 'http://leaderpost.com';

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://leaderpost.com')
    .find('#section_1 .entry-title a')
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[name="description"]@content',
        "story_byline"      :  'span.name, span.author',
        "story_byline_url"  :  'div[itemprop="author"] link@href',
        "story_date"        :  'meta[property="article:published_time"]@content, .byline-dates',
        "category"          : 'meta[itemprop="genre"]@content, .breadcrumb-list span'
    })
    .data(function(article) {
        // Massage data
        article.site = site;

        // Leader Post specific
        // - Get rid of "Published on: "
        if ( article.story_date && article.story_date.match(/Last Updated/) ) {
            var re      = /^(\w+) (\d+), (\d+) | .*/;
            var pubDate = article.story_date.replace(re, '$1 $2, $3');
            article.story_date = pubDate;
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
