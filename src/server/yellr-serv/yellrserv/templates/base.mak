<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <link rel="shortcut icon" href="/static/img/favicon.ico">
  <link rel="apple-touch-icon" href="/static/img/apple-touch-icon-57x57.png">
  <link rel="apple-touch-icon" sizes="72x72" href="/static/img/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="114x114" href="/static/img/apple-touch-icon-114x114.png">
  <script src="/static/js/libs/modernizr.js"></script>
  <link rel="stylesheet" href="/static/style/style.min.css">
</head>
<body id="storefront" data-page="${data_page}">
  <a href="#main" class="assistive-text">Skip to main content</a>
  <div class="container">
    <header id="header">
      <%block name="header">
      <div class="header-wrapper">
        <h1 class="front-page-h1"><a href="/">Yellr Front-page</a></h1>
        <div class="submit-news-tip-wrapper"><a href="submit-tip.html" class="submit-news-tip-btn">Submit Tip</a></div>
      </div>
      </%block>
    </header>

    <div id="main">
      ${self.body()}
    </div>
  </div>

  <div class="templates">
    <script id="story-li-template" type="text/x-handlebars-template">
      {{#if stories}}
        {{#each stories}}
        <li>
          <h3 class="t1"><a href="article.html">{{title}}</a></h3>
          <p>{{top_text}}</p>
          {{#if banner_media_file_name}}
          <figure>
            <img src="/media/{{banner_media_file_name}}">
          </figure>
          {{/if}}
        </li>
        {{/each}}
      {{else}}
        <li class="faded">No stories yet!</li>
      {{/if}}
    </script>
    <script id="text-form-template" type="text/x-handlebars-template">
      <form id="text-form" method="post" accept-charset="utf-8" enctype="multipart/form-data" class="submit-form">
        <input type="hidden" name="media_type" value="text">
        <input type="text" name="media_caption" placeholder="Title (optional)">
        <textarea name="media_text" rows="2" columns="10" placeholder="What's going on?"></textarea>
      </form>
    </script>
    <script id="image-form-template" type="text/x-handlebars-template">
      <form id="image-form" method="post" accept-charset="utf-8" enctype="multipart/form-data" class="submit-form">
        <input type="hidden" name="media_type" value="image">
        <textarea name="media_text" rows="2" columns="10" placeholder="Add description"></textarea>
        <input type="file" name="media_file" multiple>
      </form>
    </script>
    <script id="video-form-template" type="text/x-handlebars-template">
      <form id="video-form" method="post" accept-charset="utf-8" enctype="multipart/form-data" class="submit-form">
        <input type="hidden" name="media_type" value="video">
        <textarea name="media_text" rows="2" columns="10" placeholder="Add description"></textarea>
        <input type="file" name="media_file" multiple>
      </form>
    </script>
    <script id="audio-form-template" type="text/x-handlebars-template">
      <form id="audio-form" method="post" accept-charset="utf-8" enctype="multipart/form-data" class="submit-form">
        <input type="hidden" name="media_type" value="audio">
        <textarea name="media_text" rows="2" columns="10" placeholder="Add description"></textarea>
        <input type="file" name="media_file" multiple>
      </form>
    </script>
  </div>

  <script src="/static/js/libs/jquery.js"></script>
  <script src="/static/js/libs/jquery.form.min.js"></script>
  <script src="/static/js/libs/handlebars.js"></script>
  <script src="/static/js/libs/moment.js"></script>
  <script src="/static/js/libs/markdown.js"></script>
  <script src="/static/js/storefront.min.js"></script>
</body></html>
