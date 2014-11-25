<%inherit file="base.mak"/>

<div class="index-wrapper">
  <div class="latest-stories-wrapper">
    <h2 class="t3">Latest Stories</h2>
    <ul id="stories-list" class="list-style-none">
    % if latest_stories:
      % for story in latest_stories:
      <li>
        <h3 class="t1"><a href="/story?id=${story['story_unique_id']}">${story['title']}</a></h3>
        % if banner_media_file_name:
        <figure>
          <img src="/media/${story['banner_media_file_name']}">
        </figure>
        % endif
        <p class="preview-text">${story['preview_text']}</p>
        <a href="/story?id=${story['story_unique_id']}">Read story &gt;</a>
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
      <a href="/static/Yellr-debug.apk" class="download-btn">Download Yellr</a>
    </div>
  </div>

</div>
