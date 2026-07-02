/* =====================================================================
   Srinivas Lab — interactions
   - hexagonal corneal-endothelial mosaic (hero visual)
   - mobile nav, active-section highlighting, scroll reveals
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- current year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = navList.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navList.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        navList.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- active section in nav ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("active", a.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revObserver.observe(el); });
  }

  /* ---------- hero: hexagonal endothelial mosaic ---------- */
  var mosaic = document.getElementById("heroMosaic");
  if (mosaic) buildMosaic(mosaic);

  function buildMosaic(container) {
    var svgNS = "http://www.w3.org/2000/svg";
    var W = 640, H = 660;
    var R = 46;                       // hex radius (center to vertex), flat-top
    var hStep = R * 1.5;              // horizontal distance between columns
    var vStep = R * Math.sqrt(3);     // vertical distance between rows

    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.setAttribute("role", "presentation");

    var cols = Math.ceil(W / hStep) + 2;
    var rows = Math.ceil(H / vStep) + 2;
    var cells = [];

    for (var c = -1; c < cols; c++) {
      for (var r = -1; r < rows; r++) {
        var cx = c * hStep;
        var cy = r * vStep + (c % 2 ? vStep / 2 : 0);

        // fade toward the left edge so headline text stays clean
        var edge = Math.min(1, Math.max(0, (cx - 70) / (W - 70)));
        var jitter = 0.82 + 0.3 * pseudo(c * 13.1 + r * 7.7);
        var op = clamp(edge * jitter, 0, 1);
        if (op < 0.05) continue;

        var poly = document.createElementNS(svgNS, "polygon");
        poly.setAttribute("points", hexPoints(cx, cy, R * 0.94));
        poly.setAttribute("fill", "none");
        poly.setAttribute("stroke", "#0e7c84");
        poly.setAttribute("stroke-width", "1.4");
        poly.setAttribute("stroke-opacity", (0.16 * op).toFixed(3));
        svg.appendChild(poly);

        // a scattering of softly-filled "cells"
        var seed = pseudo(c * 3.3 + r * 5.9);
        if (edge > 0.35 && seed > 0.82) {
          var fill = document.createElementNS(svgNS, "polygon");
          fill.setAttribute("points", hexPoints(cx, cy, R * 0.78));
          fill.setAttribute("fill", seed > 0.93 ? "#1fb2bd" : "#0e7c84");
          fill.setAttribute("fill-opacity", (0.05 + 0.07 * op).toFixed(3));
          svg.appendChild(fill);
          cells.push(fill);

          if (!reduceMotion) {
            var anim = document.createElementNS(svgNS, "animate");
            anim.setAttribute("attributeName", "fill-opacity");
            var base = 0.05 + 0.07 * op;
            anim.setAttribute("values",
              base.toFixed(3) + ";" + (base + 0.16).toFixed(3) + ";" + base.toFixed(3));
            anim.setAttribute("dur", (5 + 6 * seed).toFixed(1) + "s");
            anim.setAttribute("begin", (seed * 4).toFixed(1) + "s");
            anim.setAttribute("repeatCount", "indefinite");
            fill.appendChild(anim);
          }
        }
      }
    }
    container.appendChild(svg);
  }

  function hexPoints(cx, cy, R) {
    var pts = [];
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 180 * (60 * i);   // flat-top hexagon
      pts.push((cx + R * Math.cos(a)).toFixed(1) + "," + (cy + R * Math.sin(a)).toFixed(1));
    }
    return pts.join(" ");
  }

  // deterministic pseudo-random in [0,1) — no Math.random, stable across renders
  function pseudo(n) {
    var x = Math.sin(n * 999.13) * 43758.5453;
    return x - Math.floor(x);
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
})();
