var metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var layouts = require('metalsmith-layouts');
var handlebars = require('handlebars');
var readingTime = require('metalsmith-reading-time');
var collections = require('metalsmith-collections');
var discoverPartials = require('metalsmith-discover-partials');
var permalinks = require('metalsmith-permalinks');
var excerpts = require('metalsmith-excerpts');
const feed = require('metalsmith-feed');
var sitemap = require('metalsmith-mapsite');

var tags = require('./lib/tags');

// set up a collections page for all articles sorted by date to be used
//  by recent tag in home
// need a handlebar helper to randomly pick an article
// need a handlebar helper to capitalize first letter for tags
// add google analytics
// add disqus
// fix template metas

handlebars.registerHelper('moment', require('helper-moment'));

// takes a dict and iterates though its keys for the handlebar template
// based on https://stackoverflow.com/questions/11924452
handlebars.registerHelper('get_keys', function(dict, block) {
  var accum = '';
  Object.keys(dict).forEach(function(key) {
    if (key != '') {
      accum += block.fn(key);
    }
  });
  return accum;
});

metalsmith(__dirname, )
  .clean(true)
  .metadata({
    site: {
      name: 'unamed-blog',
      description: "A blog to explore what's in his head",
      url: 'https://blog.carltonsegbefia.com',
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
  .use(readingTime({}))
  .use(excerpts())
  .use(collections({
    articles: {
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(tags({
    handle: 'tags',
    path: 'tags/:tag/index.html',
    pathPage: 'tags/:tag/:num/index.html',
    perPage: 25,
    layout: './tag.hbs',
    sortBy: 'date',
    reverse: true
  }))
  // .use(function(files, metalsmith, done) {
  //   tagList = metalsmith.metadata().tags;
  //   console.log(tagList);
  //   done();
  // })
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
  .use(feed({collection: 'articles'}))
  .use(sitemap('https://blog.carltonsegbefia.com'))
  .build(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('unamed-blog built!');
    }
  });
