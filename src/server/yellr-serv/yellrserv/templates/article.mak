<%inherit file="base.html"/>

<div class="wrapper">
  <article class="article">
    <header class="article-header">
      <h2 class="t1">${title}</h2>
      <p class="by-line">${author}</p>
      <p class="published-datetime">${published_datetime}</p>
    </header>
    <div class="content">
      ${content}
    </div>
    <footer class="article-footer">
      <ul class="article-tags-list inline">
        % for a in ("one", "two", "three"):
        <li>${a}</li>
        % endfor
      </ul>
      <div class="share">
        <p>Share</p>
      </div>
      <div class="next-article">
        <p><a href="#">Next article title text</a></p>
      </div>
    </footer>
  </article>
</div>
