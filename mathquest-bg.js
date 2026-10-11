/*
 * MathQuest – Animated Background (halaman Login/Daftar)
 * Cara pakai: tambahkan sebelum </body>
 *   <script src="mathquest-bg.js" defer></script>
 * Tidak butuh gambar apa pun, jadi tidak ada yang "kepotong" di HP maupun laptop.
 */
(function () {
  'use strict';
  if (window.MathQuestBg) return;

  var CSS = `
  .mq-bg{
    position:fixed; inset:0; z-index:-1; overflow:hidden; pointer-events:none;
    height:100vh; height:100dvh;
    background:linear-gradient(180deg,#6fc3ff 0%,#a6defc 45%,#d8f3ff 75%,#e9fbe9 100%);
    background-size:100% 140%;
    animation:mq-sky 18s ease-in-out infinite alternate;
  }
  @keyframes mq-sky{ from{background-position:0 0} to{background-position:0 100%} }

  /* kertas grafik tipis ala buku matematika */
  .mq-grid{
    position:absolute; inset:-60px; opacity:.22;
    background-image:
      linear-gradient(rgba(255,255,255,.9) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,.9) 1px,transparent 1px);
    background-size:clamp(36px,6vmin,64px) clamp(36px,6vmin,64px);
    animation:mq-grid 40s linear infinite;
  }
  @keyframes mq-grid{ to{ transform:translate(clamp(36px,6vmin,64px),clamp(36px,6vmin,64px)); } }

  /* matahari */
  .mq-sun{
    position:absolute; top:6vh; right:8vw;
    width:clamp(90px,20vmin,220px); aspect-ratio:1; border-radius:50%;
    background:radial-gradient(circle,#fff6b8 0%,#ffe066 45%,rgba(255,224,102,0) 72%);
    animation:mq-pulse 6s ease-in-out infinite;
  }
  @keyframes mq-pulse{ 0%,100%{transform:scale(1);opacity:.95} 50%{transform:scale(1.15);opacity:1} }

  /* awan */
  .mq-cloud{
    position:absolute; left:0; width:clamp(90px,16vw,210px); height:clamp(28px,5vw,64px);
    background:#fff; border-radius:999px; opacity:.92;
    animation:mq-drift linear infinite;
  }
  .mq-cloud::before,.mq-cloud::after{ content:""; position:absolute; background:#fff; border-radius:50%; }
  .mq-cloud::before{ width:48%; height:150%; left:14%; bottom:30%; }
  .mq-cloud::after{ width:38%; height:120%; right:12%; bottom:35%; }
  @keyframes mq-drift{ from{transform:translateX(-30vw)} to{transform:translateX(130vw)} }

  /* simbol matematika melayang */
  .mq-sym{
    position:absolute; bottom:-12vh; left:var(--x);
    font-family:'Baloo 2','Fredoka','Nunito',system-ui,sans-serif; font-weight:800;
    font-size:var(--s); color:var(--c); line-height:1;
    text-shadow:0 4px 0 rgba(0,0,0,.08);
    opacity:0; will-change:transform,opacity;
    animation:mq-rise var(--d) linear infinite; animation-delay:var(--dl);
  }
  @keyframes mq-rise{
    0%  { transform:translate3d(0,0,0) rotate(0deg); opacity:0 }
    10% { opacity:.85 }
    50% { transform:translate3d(var(--dx),-60vh,0) rotate(calc(var(--r)/2)) }
    90% { opacity:.85 }
    100%{ transform:translate3d(calc(var(--dx) * -1),-125vh,0) rotate(var(--r)); opacity:0 }
  }

  /* bukit bergelombang */
  .mq-hill{
    position:absolute; left:0; bottom:0; width:200%; height:clamp(110px,26vh,300px);
    animation:mq-sway linear infinite;
  }
  .mq-hill svg{ display:block; width:100%; height:100%; }
  .mq-hill.back { opacity:.75; animation-duration:70s; height:clamp(140px,32vh,360px); }
  .mq-hill.front{ animation-duration:45s; animation-direction:reverse; }
  @keyframes mq-sway{ to{ transform:translateX(-50%) } }

  /* HP: kurangi elemen supaya tetap rapi & ringan */
  @media (max-width:600px){
    .mq-sym:nth-child(even){ display:none; }
    .mq-sun{ top:4vh; right:-4vw; }
  }
  /* hormati pengaturan "kurangi gerakan" */
  @media (prefers-reduced-motion:reduce){
    .mq-bg,.mq-bg *{ animation:none !important; }
    .mq-sym{ opacity:.6; bottom:auto; top:calc(var(--i) * 6vh + 8vh); }
  }`;

  function wave(base, amp, color1, color2, k) {
    // gelombang periodik sempurna (2 periode) supaya loop mulus tanpa patahan
    var W = 2400, H = 200, pts = [], n = 96;
    for (var i = 0; i <= n; i++) {
      var x = (W / n) * i;
      var y = base + amp * Math.sin((x / (W / 2)) * Math.PI * 2 * k) +
              amp * 0.35 * Math.sin((x / (W / 2)) * Math.PI * 4 * k + 1.3);
      pts.push(x.toFixed(1) + ',' + y.toFixed(1));
    }
    var id = 'g' + Math.random().toString(36).slice(2, 7);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + color1 + '"/><stop offset="1" stop-color="' + color2 + '"/></linearGradient></defs>' +
      '<polygon fill="url(#' + id + ')" points="0,' + H + ' ' + pts.join(' ') + ' ' + W + ',' + H + '"/></svg>';
  }

  function build() {
    var style = document.createElement('style');
    style.id = 'mq-bg-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var bg = document.createElement('div');
    bg.className = 'mq-bg';
    bg.setAttribute('aria-hidden', 'true');

    var html = '<div class="mq-grid"></div><div class="mq-sun"></div>';

    // awan (top, durasi, delay negatif supaya sudah tersebar saat dibuka)
    [[12, 60, -10], [24, 85, -45], [8, 110, -80], [34, 75, -25]].forEach(function (c) {
      html += '<div class="mq-cloud" style="top:' + c[0] + 'vh;animation-duration:' + c[1] + 's;animation-delay:' + c[2] + 's"></div>';
    });

    // simbol matematika
    var syms = ['π', '+', '×', '÷', '√', '=', 'x²', '%', '−', '∞', 'y', 'Σ', '∠', '7'];
    var cols = ['#6c4cf1', '#ffc93c', '#2bb59a', '#ff7a90', '#4d9bff'];
    syms.forEach(function (s, i) {
      var x = ((i * 100) / syms.length + (i % 3) * 2.5 + 2).toFixed(1);
      var size = 'clamp(' + (24 + (i % 4) * 4) + 'px,' + (5 + (i % 4) * 1.3) + 'vmin,' + (56 + (i % 4) * 10) + 'px)';
      var dur = 16 + (i * 7) % 14;
      var dx = ((i % 2 ? 1 : -1) * (2 + (i % 4) * 1.5)).toFixed(1);
      var r = (i % 2 ? 1 : -1) * (120 + i * 20);
      html += '<span class="mq-sym" style="--i:' + i + ';--x:' + x + '%;--s:' + size + ';--c:' + cols[i % cols.length] +
        ';--d:' + dur + 's;--dl:-' + ((i * 5) % dur) + 's;--dx:' + dx + 'vw;--r:' + r + 'deg">' + s + '</span>';
    });

    html += '<div class="mq-hill back">' + wave(95, 22, '#a5e3a0', '#7fd48a', 1) + '</div>';
    html += '<div class="mq-hill front">' + wave(125, 18, '#6fd081', '#3fb764', 1.5) + '</div>';

    bg.innerHTML = html;
    document.body.insertBefore(bg, document.body.firstChild);
    // warna cadangan jika ada elemen lain yang menutupi
    document.body.classList.add('mq-has-bg');
  }

  window.MathQuestBg = {
    show: function () { var e = document.querySelector('.mq-bg'); if (e) e.style.display = ''; },
    hide: function () { var e = document.querySelector('.mq-bg'); if (e) e.style.display = 'none'; }
  };

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
