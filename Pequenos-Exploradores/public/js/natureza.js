document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.natureza-video-card').forEach(function(card) {
    card.addEventListener('click', function() {
      var videoId = card.getAttribute('data-video');
  var iframe = document.createElement('iframe');
  iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
  iframe.title = 'Vídeo Smile and Learn';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('allowfullscreen', '');
  // make iframe fill the thumb area without adding wrapper divs
  iframe.style.position = 'absolute';
  iframe.style.left = '0';
  iframe.style.top = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  // append inside the existing thumb (which is position:relative in CSS)
  var thumb = card.querySelector('.natureza-thumb');
  if (!thumb) return;
  // avoid adding multiple iframes if user clicks again
  if (thumb.querySelector('iframe')) return;
  // ensure thumb is positioned for absolute children
  if (getComputedStyle(thumb).position === 'static') thumb.style.position = 'relative';
  thumb.appendChild(iframe);
    });
  });
});
