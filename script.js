/* =========================================================================
   BROOKLINE TENNIS ACADEMY — behavior
   Wires config.js booking links to every [data-book] button, plus nav.
   ========================================================================= */
(function () {
  "use strict";
  var cfg = window.SITE_CONFIG || {};
  var booking = cfg.booking || {};
  var contact = cfg.contact || {};

  /* ---- helpers ---- */
  function getPath(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, obj);
  }

  function mailto(to, subject, body) {
    var q = [];
    if (subject) q.push("subject=" + encodeURIComponent(subject));
    if (body) q.push("body=" + encodeURIComponent(body));
    return "mailto:" + to + (q.length ? "?" + q.join("&") : "");
  }

  /* ---- wire every booking button ---- */
  document.querySelectorAll("[data-book]").forEach(function (el) {
    var entry = getPath(booking, el.getAttribute("data-book"));
    if (entry == null) return;

    // Entry can be a plain URL string (e.g. adults.spring) or an object.
    if (typeof entry === "string") {
      el.setAttribute("href", entry);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      return;
    }

    if (entry.type === "email") {
      el.setAttribute("href", mailto(entry.to, entry.subject, entry.body));
      return;
    }

    if (entry.type === "link" && entry.url) {
      el.setAttribute("href", entry.url);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      return;
    }

    if (entry.type === "embed") {
      // No-JS / fallback: the button still opens an email to the office.
      var fb = entry.fallbackEmail;
      if (fb) el.setAttribute("href", mailto(fb.to, fb.subject, fb.body));
      // With JS: intercept and open the in-page scheduler modal instead.
      el.addEventListener("click", function (e) {
        e.preventDefault();
        openBookingModal(entry);
      });
    }
  });

  /* ---- booking modal ---- */
  var modal = document.getElementById("bookModal");
  var modalBody = document.getElementById("bookModalBody");
  var modalTitle = document.getElementById("bookModalTitle");
  var modalSub = document.getElementById("bookModalSub");
  var modalClose = document.getElementById("bookModalClose");
  var lastFocused = null;
  var acuityScriptLoaded = false;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function buildEmbed(entry) {
    var url = entry.embedUrl || "";
    var isPlaceholder = entry.demo === true || !url || url.indexOf("ACUITY_OWNER_ID") !== -1;

    if (!isPlaceholder) {
      // Real Acuity scheduler — embed.js auto-resizes the iframe to fit.
      modalBody.onclick = null;
      modalBody.innerHTML =
        '<iframe title="Booking scheduler" src="' + esc(url) + '" frameborder="0"></iframe>';
      if (!acuityScriptLoaded) {
        var s = document.createElement("script");
        s.src = "https://embed.acuityscheduling.com/js/embed.js";
        s.async = true;
        document.body.appendChild(s);
        acuityScriptLoaded = true;
      }
      return;
    }

    // Demo scheduler (fake booking calendar) until a real Acuity URL is set.
    buildDemoScheduler(entry);
  }

  /* ---- fake booking calendar for the preview ---- */
  function buildDemoScheduler(entry) {
    var fb = entry.fallbackEmail || {};
    var MONTHS = ["January","February","March","April","May","June","July",
                  "August","September","October","November","December"];
    var WEEK = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    var TIMES = ["8:00 AM","9:30 AM","11:00 AM","12:30 PM","2:00 PM","3:30 PM","5:00 PM","6:30 PM"];

    var today = new Date(); today.setHours(0, 0, 0, 0);
    var state = { year: today.getFullYear(), month: today.getMonth(), day: null, time: null, svc: 0 };

    function dayAvailable(y, m, d) {
      var dt = new Date(y, m, d); dt.setHours(0, 0, 0, 0);
      if (dt < today) return false;
      if (dt.getDay() === 0) return false;         // demo: closed Sundays
      return true;
    }
    function slotsFor(d) {
      // deterministic per-day so the preview is stable, not random each render
      return TIMES.map(function (t, i) { return { t: t, open: (d + i) % 4 !== 0 }; });
    }
    function firstAvailable(y, m) {
      var last = new Date(y, m + 1, 0).getDate();
      for (var d = 1; d <= last; d++) if (dayAvailable(y, m, d)) return d;
      return null;
    }

    modalBody.innerHTML =
      '<div class="embed-placeholder demo-scheduler">' +
        '<div class="ds-top">' +
          '<span class="ep-badge">Preview</span>' +
          '<span class="ds-badge-note">Sample layout &mdash; not a live booking</span>' +
        '</div>' +
        '<div class="ds-services" role="group" aria-label="Booking type">' +
          (function(){
            var svcs = entry.services || [
              { name: "Private lesson", meta: "60 min \u00b7 1-on-1" },
              { name: "Semi-private",   meta: "60 min \u00b7 2 players" }
            ];
            return svcs.map(function (s, i) {
              return '<button type="button" class="ds-service' + (i === 0 ? ' is-active' : '') +
                     '" data-svc="' + i + '"><span>' + s.name + '</span><span>' + s.meta + '</span></button>';
            }).join("");
          })() +
        '</div>' +
        '<div class="ds-cal">' +
          '<div class="ds-cal-head">' +
            '<button type="button" class="ds-nav" data-nav="-1" aria-label="Previous month">&lsaquo;</button>' +
            '<span class="ds-month" id="dsMonth"></span>' +
            '<button type="button" class="ds-nav" data-nav="1" aria-label="Next month">&rsaquo;</button>' +
          '</div>' +
          '<div class="ds-weekdays">' + WEEK.map(function (w) { return "<span>" + w + "</span>"; }).join("") + '</div>' +
          '<div class="ds-days" id="dsDays"></div>' +
        '</div>' +
        '<div class="ds-times" id="dsTimes"></div>' +
        '<a class="btn btn-primary ds-confirm is-disabled" id="dsConfirm">Select a time</a>' +
        '<p class="ds-foot-hint">Preview only &mdash; a live version connects straight to your booking system.</p>' +
      "</div>";

    var elDays = modalBody.querySelector("#dsDays");
    var elMonth = modalBody.querySelector("#dsMonth");
    var elTimes = modalBody.querySelector("#dsTimes");
    var elConfirm = modalBody.querySelector("#dsConfirm");

    function renderDays() {
      elMonth.textContent = MONTHS[state.month] + " " + state.year;
      var firstDow = new Date(state.year, state.month, 1).getDay();
      var last = new Date(state.year, state.month + 1, 0).getDate();
      var html = "";
      for (var i = 0; i < firstDow; i++) html += '<span class="ds-day is-empty"></span>';
      for (var d = 1; d <= last; d++) {
        var open = dayAvailable(state.year, state.month, d);
        var cls = "ds-day " + (open ? "is-open" : "is-muted");
        if (open && state.day === d) cls += " is-selected";
        html += '<button type="button" class="' + cls + '"' +
                (open ? ' data-day="' + d + '"' : ' disabled') + '>' + d + "</button>";
      }
      elDays.innerHTML = html;
      // can we page to previous month? (not before the current real month)
      var prev = modalBody.querySelector('[data-nav="-1"]');
      prev.disabled = (state.year === today.getFullYear() && state.month === today.getMonth());
    }

    function renderTimes() {
      if (state.day == null) { elTimes.innerHTML = ""; return; }
      var dt = new Date(state.year, state.month, state.day);
      var label = dt.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      var slots = slotsFor(state.day);
      elTimes.innerHTML =
        '<p class="ds-times-label">Available times for <strong>' + label + "</strong></p>" +
        '<div class="ds-time-grid">' +
          slots.map(function (s, i) {
            var cls = "ds-time " + (s.open ? "is-open" : "is-booked");
            if (s.open && state.time === i) cls += " is-selected";
            return '<button type="button" class="' + cls + '"' +
                   (s.open ? ' data-time="' + i + '"' : " disabled") + ">" + s.t + "</button>";
          }).join("") +
        "</div>";
    }

    function renderConfirm() {
      var ready = state.day != null && state.time != null;
      elConfirm.classList.toggle("is-disabled", !ready);
      if (!ready) { elConfirm.textContent = "Select a time"; elConfirm.removeAttribute("href"); return; }
      var dt = new Date(state.year, state.month, state.day);
      var label = dt.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
      var svc = state.svc === 0 ? "Private lesson" : "Semi-private lesson";
      var time = TIMES[state.time];
      elConfirm.textContent = "Request " + time + " on " + label.split(",")[0];
      if (fb.to) {
        var body = "Hi Brookline Tennis Academy,\n\nI'd like to request a lesson:\n\n" +
                   "- Type: " + svc + "\n- Date: " + label + "\n- Time: " + time +
                   "\n- Name:\n- Level / goals:\n\nThank you!";
        elConfirm.setAttribute("href", mailto(fb.to, "Lesson Request — " + svc, body));
      }
    }

    // one delegated handler for the whole scheduler (assigned, so re-opening
    // the modal replaces it rather than stacking duplicates)
    modalBody.onclick = function (e) {
      var t = e.target.closest("[data-day],[data-time],[data-nav],[data-svc]");
      if (!t || !modalBody.contains(t)) return;

      if (t.hasAttribute("data-svc")) {
        state.svc = +t.getAttribute("data-svc");
        modalBody.querySelectorAll(".ds-service").forEach(function (b) { b.classList.remove("is-active"); });
        t.classList.add("is-active");
        renderConfirm();
      } else if (t.hasAttribute("data-nav")) {
        var delta = +t.getAttribute("data-nav");
        var nm = state.month + delta;
        state.month = (nm + 12) % 12;
        state.year += Math.floor(nm / 12);
        state.day = null; state.time = null;
        renderDays(); renderTimes(); renderConfirm();
      } else if (t.hasAttribute("data-day")) {
        state.day = +t.getAttribute("data-day"); state.time = null;
        renderDays(); renderTimes(); renderConfirm();
      } else if (t.hasAttribute("data-time")) {
        state.time = +t.getAttribute("data-time");
        renderTimes(); renderConfirm();
      }
    };

    // initial state: land on the first bookable day so it looks alive
    state.day = firstAvailable(state.year, state.month);
    renderDays(); renderTimes(); renderConfirm();
  }

  function getFocusable() {
    return modal
      ? modal.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')
      : [];
  }

  function openBookingModal(entry) {
    if (!modal) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = entry.title || "Book a Lesson";
    modalSub.textContent = entry.subtitle || "";
    modalSub.hidden = !entry.subtitle;
    buildEmbed(entry);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeBookingModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    modalBody.onclick = null;
    modalBody.innerHTML = "";
    document.body.style.overflow = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (modal) {
    modalClose.addEventListener("click", closeBookingModal);
    // click on the scrim (outside the dialog) closes
    modal.addEventListener("mousedown", function (e) {
      if (e.target === modal) closeBookingModal();
    });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { closeBookingModal(); return; }
      if (e.key === "Tab") {
        var f = getFocusable();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- contact links ---- */
  var phoneLink = document.querySelector("[data-phone]");
  if (phoneLink && contact.phone) {
    phoneLink.textContent = contact.phone;
    phoneLink.setAttribute("href", contact.phoneHref || "tel:" + contact.phone.replace(/[^0-9+]/g, ""));
  }
  var emailLink = document.querySelector("[data-email]");
  if (emailLink && contact.email) {
    emailLink.textContent = contact.email;
    emailLink.setAttribute("href", "mailto:" + contact.email);
  }
  var mapsLink = document.querySelector("[data-maps]");
  if (mapsLink && contact.mapsUrl) {
    mapsLink.setAttribute("href", contact.mapsUrl);
    mapsLink.setAttribute("target", "_blank");
    mapsLink.setAttribute("rel", "noopener");
  }

  /* ---- sticky header shadow ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.hidden = open;
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });
  }

  /* ---- year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
