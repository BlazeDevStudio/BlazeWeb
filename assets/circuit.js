/*
 * Global moving-node background. Pure JavaScript; no dependencies.
 * resize(): device density. draw(): connections and cursor response.
 * check(): reduced motion, hidden tabs, and data-saving preferences.
 */

(function () {
  "use strict";
  var canvas = document.getElementById("circuit-field");
  if (!canvas || !canvas.getContext) return;
  var ctx;
  try { ctx = canvas.getContext("2d", { alpha: true }); } catch (err) { return; }
  if (!ctx) return;

  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduced = !!(mq && mq.matches);
  var saveData = !!(navigator.connection && navigator.connection.saveData);
  var raf = window.requestAnimationFrame ? function (fn) { return window.requestAnimationFrame(fn); } : null;
  var caf = window.cancelAnimationFrame ? function (id) { window.cancelAnimationFrame(id); } : null;
  var width = 1, height = 1, scale = 1, nodes = [], running = false, frame = 0, last = 0;
  var mouse = { x: -1000, y: -1000, seen: -99999 };
  var isCoarse = window.matchMedia ? window.matchMedia("(pointer: coarse)").matches : false;
  var fps = isCoarse ? 18 : 24, interval = 1000 / fps;

  function between(a, b) { return a + Math.random() * (b - a); }
  function resize() {
    var w = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    var h = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    if (w === width && h === height && nodes.length) return;
    width = w; height = h;
    var dpr = window.devicePixelRatio || 1;
    scale = Math.max(0.25, Math.min(1.5, dpr, 1280 / w, 720 / h));
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    var count = Math.min(isCoarse ? 34 : 55, Math.max(isCoarse ? 21 : 27,
      Math.round(w * h / (isCoarse ? 17500 : 22000))));
    nodes = [];
    for (var i = 0; i < count; i++) {
      nodes.push({
        bx: between(3, w - 3), by: between(3, h - 3),
        x: 0, y: 0, ox: 0, oy: 0, vx: between(-0.12, 0.12),
        vy: between(-0.12, 0.12), radius: between(1.1, 2.2)
      });
    }
    draw(false, 0);
  }
  function draw(moving, now) {
    ctx.clearRect(0, 0, width, height);
    var active = !isCoarse && now - mouse.seen < 1500;
    var i, j, a, b, dx, dy, d2, dist, targetX, targetY;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i]; targetX = 0; targetY = 0;
      if (moving) {
        a.bx += a.vx; a.by += a.vy;
        if (a.bx < 3 || a.bx > width - 3) a.vx = -a.vx;
        if (a.by < 3 || a.by > height - 3) a.vy = -a.vy;
        a.bx = Math.max(3, Math.min(width - 3, a.bx));
        a.by = Math.max(3, Math.min(height - 3, a.by));
      }
      if (active) {
        dx = a.bx - mouse.x; dy = a.by - mouse.y; d2 = dx * dx + dy * dy;
        if (d2 < 170 * 170 && d2 > 1) {
          dist = Math.sqrt(d2);
          var repel = (1 - dist / 170) * 27;
          targetX = dx / dist * repel; targetY = dy / dist * repel;
        }
      }
      if (moving) {
        a.ox += (targetX - a.ox) * .12;
        a.oy += (targetY - a.oy) * .12;
      }
      a.x = a.bx + a.ox; a.y = a.by + a.oy;
    }
    var reach = width < 600 ? 145 : 175, reach2 = reach * reach;
    ctx.lineWidth = .9;
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        b = nodes[j];
        dx = a.x - b.x; dy = a.y - b.y; d2 = dx * dx + dy * dy;
        if (d2 >= reach2) continue;
        var opacity = (1 - d2 / reach2) * .27;
        if (active) {
          var px = (a.x + b.x) * .5 - mouse.x;
          var py = (a.y + b.y) * .5 - mouse.y;
          if (px * px + py * py < 155 * 155) opacity += .075;
        }
        ctx.strokeStyle = "rgba(121,179,255," + Math.min(.35, opacity).toFixed(3) + ")";
        ctx.beginPath(); ctx.moveTo(a.x, a.y);
        if ((i + j) % 5 === 0) {
          var mid = (a.x + b.x) / 2;
          ctx.lineTo(mid, a.y); ctx.lineTo(mid, b.y);
        }
        ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    for (i = 0; i < nodes.length; i++) {
      a = nodes[i];
      ctx.beginPath(); ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      ctx.fillStyle = i % 17 === 0 ? "rgba(230,75,103,.55)" : "rgba(143,191,255,.52)";
      ctx.fill();
    }
  }
  function tick(now) {
    if (!running) return;
    if (now - last >= interval) { last = now; draw(true, now); }
    frame = raf(tick);
  }
  function check() {
    var canMove = !document.hidden && !reduced && !saveData && !!raf;
    if (canMove && !running) { running = true; last = 0; frame = raf(tick); }
    else if (!canMove && running) {
      running = false;
      if (caf) caf(frame);
      draw(false, 0);
    }
  }
  function point(x, y) {
    mouse.x = x; mouse.y = y;
    mouse.seen = window.performance && window.performance.now ? window.performance.now() : 0;
  }
  resize();
  window.addEventListener("resize", resize, false);
  document.addEventListener("visibilitychange", check, false);
  if (window.PointerEvent) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "mouse" || e.pointerType === "pen") point(e.clientX, e.clientY);
    }, false);
    window.addEventListener("pointerout", function (e) {
      if (!e.relatedTarget) mouse.seen = -99999;
    }, false);
  } else {
    window.addEventListener("mousemove", function (e) { if (!isCoarse) point(e.clientX, e.clientY); }, false);
  }
  if (mq) {
    var changed = function (e) { reduced = e.matches; check(); };
    if (mq.addEventListener) mq.addEventListener("change", changed);
    else if (mq.addListener) mq.addListener(changed);
  }
  if (navigator.connection && navigator.connection.addEventListener) {
    navigator.connection.addEventListener("change", function () {
      saveData = !!navigator.connection.saveData; check();
    });
  }
  check();
}());
