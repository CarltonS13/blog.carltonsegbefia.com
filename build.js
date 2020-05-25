var metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
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
var watch = require('metalsmith-watch');
var serve = require('metalsmith-serve');
var pagination = require('metalsmith-pagination')

var tags = require('./lib/tags');

// add disqus
// find way to upload blog to html
// metalsmith-multi-language

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
  .use(drafts())
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
  .use(tags({
    handle: 'tags',
    path: 'tags/:tag/index.html',
    pathPage: 'tags/:tag/:num/index.html',
    perPage: 25,
    layout: './tag.hbs',
    sortBy: 'date',
    reverse: true
  }))
  .use(collections({
    posts: {
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(pagination({
    'collections.posts': {
      perPage: 25,
      layout: 'posts.hbs',
      first: 'posts.html',
      path: 'posts/:num.html'
    }
  }))
  .use(readingTime({}))
  .use(excerpts())
  .use(permalinks({
    relative: false,
    pattern: ':title'
  }))
  // .use(function(files, metalsmith, done) {
  // tagList = metalsmith.metadata().tags;
  // postList = metalsmith.metadata().posts;
  // console.log(postList[0]);
  // done();
  // })
  .use(discoverPartials({
    directory: './layouts/partials',
    pattern: /\.html$/
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: './layouts',
    pattern: ["*/*/*html", "*/*html", "*html", "**/*.html"],
    default: 'post.hbs',
  }))
  .use(feed({
    collection: 'posts'
  }))
  .use(sitemap('https://blog.carltonsegbefia.com'))
  // .use(serve({
  //   port: 8081,
  //   verbose: true
  // }))
  // .use(watch({
  //   paths: {
  //     "${source}/**/*": true,
  //     "layouts/**/*": "**/*",
  //   }
  // }))
  .build(function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('unamed-blog built!');
    }
  });
