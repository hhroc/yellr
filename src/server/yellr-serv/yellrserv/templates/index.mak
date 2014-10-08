<%inherit file="base.mak"/>

<div class="index-wrapper">
  <div class="latest-stories-wrapper">
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
    <div class="load-more-btn">Load more</div>
  </div>

  <div class="contribute-wrapper">
    <div class="contribute-div">
      <h3 class="t4">Contribute to your community</h3>
      <p>This site is powered by Yellr, a platform focused on giving people a voice. You can submit any type of content that you think is important. Pictures, videos audio recordings, or just plain text, anything. </p>
      <p>You can contribute by clicking the "Submit Tip" button above or by downloading the accompanying app!</p>
      <div class="download-btn">Download Yellr</div>
    </div>
  </div>

</div>
