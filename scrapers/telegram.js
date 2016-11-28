var osmosis = require('osmosis');

var site    = 'The Telegram';
var baseUrl = 'http://www.thetelegram.com';

// TODO 
// - [ ] Capture odd attribution for Associated Press, after the article in a p tag

var getArticles = function(callback) {
    var articles = [];
    osmosis.get('http://www.thetelegram.com/')
    .find('.primary-content article a, .secondary-content article a')
    .set({ 'story_url' : '@href' })
    .follow('@href')
    .set({
        "story_title" :  'title',
        "story_description" :  'meta[name="description"]@content',
        "story_byline"      :  'dt.author a',
        "story_byline_url"  :  'dt.author a@href',
        "story_date"        :  'div.author > dl > dd',
        "category"          : '.breadcrum .last-child a'
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

        // Telegram
        // - Skip Living, Letter to the editor, Columnists, Business
        // - Or, only take News, Local, Regional
        if ( article.category.match(/News|Local|Regional/) ) { 
            // - Get rid of "Published on "
            var re      = /^Published on (.*$)/;
            var pubDate = article.story_date.replace(re, '$1');
            article.story_date = pubDate;
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

