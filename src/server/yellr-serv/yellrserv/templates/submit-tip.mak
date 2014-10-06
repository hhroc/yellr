<%inherit file="base.mak"/>

<div class="wrapper">
  <h2 class="t1">Submit Tip</h2>
  <div class="forms-wrapper">
    <form id="text-form" method="post" accept-charset="utf-8" enctype="multipart/form-data" class="submit-form">
      <input type="hidden" name="media_type" value="text">
      <input type="text" name="media_caption" placeholder="Title (optional)">
      <textarea name="media_text" rows="2" columns="10" placeholder="What's going on?"></textarea>
    </form>
  </div>
  <div id="add-extra-media" class="add-extra-media">
    <p>Add extra media:</p>
    <div class="flex">
      <div class="add-image flex-1"><i class="fa fa-plus"></i><i class="fa fa-camera"></i><span class="block">Add Image</span></div>
      <div class="add-video flex-1"><i class="fa fa-plus"></i><i class="fa fa-video-camera"></i><span class="block">Add Video</span></div>
      <div class="add-audio flex-1"><i class="fa fa-plus"></i><i class="fa fa-microphone"></i><span class="block">Add Audio</span></div>
    </div>
  </div>
  <div class="submit-btn">Submit Content</div>
</div>
