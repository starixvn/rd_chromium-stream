var video = document.getElementById("video");
var videoSource = "live.m3u8";

function playVideo() {
  video.muted = true;
  video.play();
}

if (Hls.isSupported()) {
  var hls = new Hls();

  hls.loadSource(videoSource);
  hls.attachMedia(video);

  hls.on(Hls.Events.MEDIA_ATTACHED, playVideo);
}
