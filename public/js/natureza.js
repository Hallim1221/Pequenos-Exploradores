document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.natureza-video-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var videoId = card.getAttribute('data-video');
      var iframe = document.createElement('iframe');
      iframe.width = 320;
      iframe.height = 180;
      iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
      iframe.title = 'Vídeo Smile and Learn';
      iframe.frameBorder = 0;
      iframe.allowFullscreen = true;
      card.querySelector('.natureza-thumb').replaceWith(iframe);
    });
  });
});
