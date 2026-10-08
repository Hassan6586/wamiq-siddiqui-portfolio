(function () {
  // Status-page style strip: 90 bars, one short dip for the 0.01%.
  var bars = document.querySelector('.bars');
  if (bars) {
    var count = window.matchMedia('(max-width: 480px)').matches ? 45 : 90;
    var dip = Math.round(count * 0.62);
    var html = '';
    for (var i = 0; i < count; i++) {
      html += '<i style="--i:' + i + '"' + (i === dip ? ' class="dip"' : '') + '></i>';
    }
    bars.innerHTML = html;
    requestAnimationFrame(function () { bars.classList.add('go'); });
  }
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
