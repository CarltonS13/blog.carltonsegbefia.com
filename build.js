var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var handlebars = require('handlebars');
var readingTime = require('metalsmith-reading-time');
var collections = require('metalsmith-collections');
var discoverPartials = require('metalsmith-discover-partials');
var permalinks = require('metalsmith-permalinks');

// metalsmith-pagination
// metalsmith-collections
// metalsmith-tags
// metalsmith-feed
// metalsmith-mapsite
// metalsmith-permalinks

handlebars.registerHelper('moment', require('helper-moment'));

metalsmith(__dirname, )
.clean(true)
  .metadata({
    site: {
      name: 'unamed-blog',
      description: "A blog to explore what's in his head"
    }
  })
  .source('./src')
  .destination('./public')
  .ignore(['*/src', 'src'])
  .use(markdown({
    pedantic: false,
    gfm: true,
    tables: true,
    breaks: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    xhtml: false
  }))
  .use(permalinks({
    relative: false,
    pattern: ':title',
  }))
  .use(readingTime({
    // options here
  }))
  .use(collections({
    articles: {
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(discoverPartials({
    directory: './layouts/partials',
    pattern: /\.html$/
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './layouts',
    pattern: ["*/*/*html", "*/*html", "*html", "**/*.html"],
    default: 'article.hbs',
  }))
  .build(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('unamed-blog built!');
    }
  });
