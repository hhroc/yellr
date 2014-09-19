<%inherit file="base.mak"/>

<div class="wrapper">
  <h2 class="t3">Latest Stories</h2>
  <ul id="stories-list" class="list-style-none">
  % if latest_stories:
    % for story in latest_stories:
    <li>
      <h3 class="t1"><a href="article.html">${story['title']}</a></h3>
      <p><i>${story['top_text']}</i></p>
      % if banner_media_file_name:
      <figure>
        <img src="/media/${story['banner_media_file_name']}">
      </figure>
      % endif
      <p>${story['contents']}</p>
    </li>
    % endfor
   % else:
       <li class="faded">No stories yet!</li>
   % endif
  </ul>
</div>
