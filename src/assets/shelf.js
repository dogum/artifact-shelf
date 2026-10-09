/* Artifact Shelf ─ progressive enhancement. Every page works without this file. */
(() => {
  'use strict';
  window.__shelf = true;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const mq = (q) => window.matchMedia(q).matches;
  const reduced = mq('(prefers-reduced-motion: reduce)');
  const saveData = navigator.connection && navigator.connection.saveData;
  const canHover = mq('(hover: hover) and (pointer: fine)');
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ── theme ── */
  const toggle = $('[data-theme-toggle]');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = root.dataset.theme === 'auto' ? (mq('(prefers-color-scheme: dark)') ? 'dark' : 'light') : root.dataset.theme;
      const next = current === 'dark' ? 'light' : 'dark';
      const apply = () => { root.dataset.theme = next; store.set('shelf-theme', next); };
      if (document.startViewTransition && !reduced) document.startViewTransition(apply);
      else apply();
    });
  }

  /* ── items settle onto shelves as they scroll into view ── */
  const units = $$('.shelf-unit, .shelf-grid');
  units.forEach((u) => $$('.item', u).forEach((it, k) => it.style.setProperty('--k', Math.min(k, 8))));
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    units.forEach((u) => io.observe(u));
  } else {
    units.forEach((u) => u.classList.add('is-in'));
  }

  /* ── shelf rows: nudge buttons ── */
  $$('.shelf').forEach((shelf) => {
    const row = $('.shelf-row', shelf);
    const btns = $$('[data-nudge]', shelf);
    if (!row || !btns.length) return;
    const update = () => {
      const max = row.scrollWidth - row.clientWidth - 2;
      btns[0].disabled = row.scrollLeft <= 2;
      btns[1].disabled = row.scrollLeft >= max;
      btns.forEach((b) => (b.hidden = max <= 0));
    };
    btns.forEach((b) => b.addEventListener('click', () => {
      row.scrollBy({ left: Number(b.dataset.nudge) * row.clientWidth * 0.8, behavior: reduced ? 'auto' : 'smooth' });
    }));
    row.addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  });

  /* ── hover: wake the item up as a live miniature ── */
  let live = null;
  let wakeTimer = 0;
  const sleep = () => {
    clearTimeout(wakeTimer);
    if (!live) return;
    const box = live;
    live = null;
    box.classList.remove('is-live');
    const f = $('iframe', box);
    if (f) setTimeout(() => f.remove(), 450);
  };
  const wake = (box) => {
    if (live === box) return;
    sleep();
    live = box;
    const f = document.createElement('iframe');
    f.src = box.dataset.play;
    f.title = 'Live preview';
    f.setAttribute('aria-hidden', 'true');
    f.setAttribute('tabindex', '-1');
    f.setAttribute('loading', 'eager');
    f.style.setProperty('--s', box.clientWidth / 1280);
    f.addEventListener('load', () => setTimeout(() => live === box && box.classList.add('is-live'), 350));
    box.appendChild(f);
  };
  if (canHover && !reduced && !saveData) {
    $$('.item-box[data-live="true"]').forEach((box) => {
      const link = box.closest('.item-link');
      link.addEventListener('pointerenter', () => {
        clearTimeout(wakeTimer);
        wakeTimer = setTimeout(() => wake(box), 420);
      });
      link.addEventListener('pointerleave', sleep);
    });
  }

  /* ── home: the display window ── */
  const showcase = $('[data-showcase]');
  if (showcase) {
    const cases = $$('.case', showcase);
    if (cases.length > 1) {
      const day = Math.floor(Date.now() / 864e5);
      const pick = day % cases.length;
      cases.forEach((c, k) => (c.hidden = k !== pick));
      const img = $('img', cases[pick]);
      if (img) img.loading = 'eager';
    }
    const visible = cases.find((c) => !c.hidden);
    const glass = visible && $('.case-glass', visible);
    const run = () => {
      if (!glass || $('iframe', glass)) return;
      const f = document.createElement('iframe');
      f.src = glass.dataset.play;
      f.title = glass.dataset.title + ', running';
      f.allow = 'fullscreen; autoplay; gamepad; geolocation; camera';
      f.addEventListener('load', () => setTimeout(() => glass.classList.add('is-live'), 250));
      glass.prepend(f);
    };
    if (glass) {
      $('.case-run', glass).addEventListener('click', run);
      if (glass.dataset.autorun === 'true' && canHover && !reduced && !saveData && innerWidth > 900) {
        const go = () => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 2500 }) : setTimeout(run, 1200));
        if (document.readyState === 'complete') go(); else addEventListener('load', go);
      }
    }
  }

  /* ── home: the index ── */
  const table = $('.index-table');
  if (table) {
    const q = $('#q');
    const sort = $('#sort');
    const chips = $$('.chip[data-shelf]');
    const rows = $$('tbody tr', table);
    const tbody = $('tbody', table);
    const empty = $('.index-empty');
    let shelf = '';
    const params = new URLSearchParams(location.search);
    if (params.get('q')) q.value = params.get('q');
    if (params.get('shelf')) shelf = params.get('shelf');

    const apply = () => {
      const terms = q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
      let shown = 0;
      for (const r of rows) {
        const ok = (!shelf || r.dataset.shelf === shelf) && terms.every((t) => r.dataset.search.includes(t));
        r.hidden = !ok;
        if (ok) shown++;
      }
      empty.hidden = shown > 0;
      chips.forEach((c) => c.classList.toggle('is-on', c.dataset.shelf === shelf));
      const by = sort.value;
      const key = {
        new: (r) => r.dataset.made,
        no: (r) => -Number(r.dataset.no),
        az: (r) => r.dataset.title,
        size: (r) => Number(r.dataset.size),
      }[by];
      const dir = by === 'az' ? 1 : -1;
      rows.slice().sort((a, b) => (key(a) > key(b) ? dir : key(a) < key(b) ? -dir : 0)).forEach((r) => tbody.appendChild(r));
      const u = new URL(location.href);
      q.value ? u.searchParams.set('q', q.value) : u.searchParams.delete('q');
      shelf ? u.searchParams.set('shelf', shelf) : u.searchParams.delete('shelf');
      history.replaceState(null, '', u);
    };
    q.addEventListener('input', apply);
    sort.addEventListener('change', apply);
    chips.forEach((c) => c.addEventListener('click', () => { shelf = c.dataset.shelf; apply(); }));
    if (q.value || shelf) apply();

    addEventListener('keydown', (e) => {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        e.preventDefault();
        q.focus({ preventScroll: true });
        $('#index').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
      if (e.key === 'Escape' && document.activeElement === q) { q.value = ''; apply(); q.blur(); }
    });

    // Hover a row to peek at the poster.
    const peek = $('.peek');
    if (peek && canHover) {
      let current = null;
      tbody.addEventListener('pointermove', (e) => {
        const r = e.target.closest('tr');
        if (!r) return;
        if (r !== current) {
          current = r;
          peek.src = r.dataset.img;
          peek.hidden = false;
          requestAnimationFrame(() => peek.classList.add('is-on'));
        }
        const x = Math.min(e.clientX + 24, innerWidth - 280);
        const y = Math.min(e.clientY - 70, innerHeight - 180);
        peek.style.transform = `translate(${x}px, ${Math.max(10, y)}px)`;
      });
      tbody.addEventListener('pointerleave', () => { current = null; peek.classList.remove('is-on'); });
    }
  }

  /* ── item page ── */
  const frame = $('.stage-frame');
  if (frame) {
    const start = () => {
      if ($('iframe', frame)) return $('iframe', frame);
      frame.innerHTML = '';
      const f = document.createElement('iframe');
      f.className = 'stage-iframe';
      f.src = frame.dataset.src;
      f.title = frame.dataset.title;
      f.allow = 'fullscreen; autoplay; clipboard-write; gamepad; accelerometer; gyroscope; geolocation; camera';
      f.allowFullscreen = true;
      frame.appendChild(f);
      f.focus();
      return f;
    };
    // Pieces that draw on the GPU: if the browser won't give them the context they need, say so by the stage.
    const glNote = $('.gl-note');
    if (glNote) {
      let ok = false;
      try {
        const c = document.createElement('canvas');
        const ctx = c.getContext(glNote.dataset.gl) || (glNote.dataset.gl === 'webgl' && c.getContext('experimental-webgl'));
        ok = !!ctx;
        const lose = ctx && ctx.getExtension('WEBGL_lose_context');
        if (lose) lose.loseContext();
      } catch {}
      glNote.hidden = ok;
    }
    const runBtn = $('.stage-run', frame);
    if (runBtn) runBtn.addEventListener('click', start);

    const flash = (btn, text) => {
      const label = $('span', btn);
      const old = label.textContent;
      label.textContent = text;
      btn.classList.add('is-done');
      setTimeout(() => { label.textContent = old; btn.classList.remove('is-done'); }, 1600);
    };
    const copy = async (text, btn, done = 'Copied') => {
      try { await navigator.clipboard.writeText(text); flash(btn, done); } catch { prompt('Copy this:', text); }
    };
    const actions = {
      restart: () => { const f = $('iframe', frame); if (f) f.src = f.src; else start(); },
      fullscreen: () => { const f = start(); (f.requestFullscreen || f.webkitRequestFullscreen || (() => {})).call(f); },
      share: async (btn) => {
        const data = { title: document.title, text: $('meta[name="description"]').content, url: $('link[rel="canonical"]').href };
        if (navigator.share && canHover === false) { try { await navigator.share(data); } catch {} }
        else copy(data.url, btn, 'Link copied');
      },
      embed: () => { const d = $('.embed-dialog'); d.showModal(); $('textarea', d).select(); },
      'copy-embed': (btn) => copy($('.embed-dialog textarea').value, btn),
    };
    $$('[data-act]').forEach((b) => b.addEventListener('click', () => actions[b.dataset.act] && actions[b.dataset.act](b)));

    addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT|IFRAME/.test(document.activeElement.tagName)) return;
      if (e.key === 'f') actions.fullscreen();
      else if (e.key === 'r') actions.restart();
      else if (e.key === 'ArrowLeft' && $('[data-key="prev"]')) location.href = $('[data-key="prev"]').href;
      else if (e.key === 'ArrowRight' && $('[data-key="next"]')) location.href = $('[data-key="next"]').href;
    });
  }

  /* ── view transitions: the poster you clicked grows into the stage ── */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a.item-link, .case-label a, .case-open');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    $$('[style*="view-transition-name"]').forEach((el) => (el.style.viewTransitionName = ''));
    const box = a.classList.contains('item-link') ? $('.item-box', a) : $('.case-glass', a.closest('.case'));
    if (box && !$('.stage-frame')) box.style.viewTransitionName = 'stage';
  });
  addEventListener('pagereveal', (e) => {
    if (!e.viewTransition || $('.stage-frame')) return;
    try {
      const from = navigation.activation && navigation.activation.from && new URL(navigation.activation.from.url);
      const m = from && from.pathname.match(/\/a\/([^/]+)\//);
      const box = m && $(`.item-link[data-slug="${CSS.escape(m[1])}"] .item-box`);
      if (box) {
        box.style.viewTransitionName = 'stage';
        e.viewTransition.finished.finally(() => (box.style.viewTransitionName = ''));
      }
    } catch {}
  });
})();
