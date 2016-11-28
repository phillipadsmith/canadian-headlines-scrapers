var osmosis = require('osmosis');

var site    = 'Winnipeg Free Press';
var baseUrl = 'http://www.winnipegfreepress.com';

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://www.winnipegfreepress.com')
    .find('#section_1 .entry-title a')
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[name="description"]@content',
        "story_byline"      :  'span.name, span.author',
        "story_byline_url"  :  'div[itemprop="author"] link@href',
        "story_date"        :  'meta[name="PubDate"]@content, .byline-dates',
        "category"          : 'meta[itemprop="genre"]@content, .breadcrumb-list span'
    })
    .data(function(article) {
        // Massage data
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
