(function () {
  "use strict";
  var canvas = document.getElementById("circuit-field");
  if (!canvas || !canvas.getContext) return;
  var ctx;
  try { ctx = canvas.getContext("2d"); } catch (error) { return; }
  if (!ctx) return;

  var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reducedMotion = !!(motionQuery && motionQuery.matches);
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var nodes = [];
  var width = 1, height = 1, running = false, frame = 0, last = 0;
  var fpsInterval = 1000 / 20;
  var raf = window.requestAnimationFrame ? function(cb) { return window.requestAnimationFrame(cb); } : null;
  var cancel = window.cancelAnimationFrame ? function(id) { window.cancelAnimationFrame(id); } : null;
  var lastSize = "";

  function random(min, max) { return min + Math.random() * (max - min); }
  function resize() {
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(Math.min(rect.width, 1150)));
    var h = Math.max(1, Math.round(Math.min(rect.height, 650)));
    var size = w + "x" + h;
    if (size === lastSize) return;
    lastSize = size; width = w; height = h;
    canvas.width = width; canvas.height = height; // cap backing pixels for TV browsers
    var count = Math.min(30, Math.max(14, Math.round(width * height / 22000)));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({x:random(7,width-7), y:random(7,height-7),
        vx:random(-0.12,0.12), vy:random(-0.12,0.12), r:random(1.2,2.2)});
    }
    paint(0, false);
  }
  function paint(now, move) {
    ctx.clearRect(0, 0, width, height);
    var i, j, a, b, dx, dy, dist2, radius = width < 500 ? 135 : 170;
    var maxDist2 = radius * radius, opacity;
    if (move) {
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 5 || a.x > width - 5) a.vx *= -1;
        if (a.y < 5 || a.y > height - 5) a.vy *= -1;
      }
    }
    ctx.lineWidth = 0.85;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y;
        dist2 = dx * dx + dy * dy;
        if (dist2 >= maxDist2) continue;
        opacity = (1 - dist2 / maxDist2) * 0.19;
        ctx.strokeStyle = "rgba(121,179,255," + opacity.toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(a.x,a.y);
        if ((i + j) % 5 === 0) {
          var mid = (a.x + b.x) / 2;
          ctx.lineTo(mid,a.y); ctx.lineTo(mid,b.y);
        }
        ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.beginPath(); ctx.arc(a.x,a.y,a.r,0,Math.PI*2);
      ctx.fillStyle = i === 0 ? "rgba(228,91,114,0.6)" : "rgba(140,192,255,0.45)";
      ctx.fill();
    }
  }
  function tick(now) {
    if (!running) return;
    if (now - last >= fpsInterval) { last = now; paint(now,true); }
    frame = raf(tick);
  }
  function checkVisibility() {
    var rect = canvas.getBoundingClientRect();
    var inView = rect.bottom > 0 && rect.top < (window.innerHeight || 900);
    var active = inView && !document.hidden && !reducedMotion && !saveData && !!raf;
    if (active && !running) { running = true; last = 0; frame = raf(tick); }
    else if (!active && running) {
      running = false;
      if (cancel) cancel(frame);
    }
  }
  function onResize() { resize(); checkVisibility(); }
  resize();
  if (!raf || reducedMotion || saveData) return; // static connected nodes instead
  window.addEventListener("scroll", checkVisibility, false);
  window.addEventListener("resize", onResize, false);
  document.addEventListener("visibilitychange", checkVisibility, false);
  if (motionQuery) {
    var changed = function(event) { reducedMotion = event.matches; checkVisibility(); };
    if (motionQuery.addEventListener) motionQuery.addEventListener("change", changed);
    else if (motionQuery.addListener) motionQuery.addListener(changed);
  }
  checkVisibility();
}());
