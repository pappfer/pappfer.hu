(function () {
  var input = document.getElementById('gl-q');
  if (!input || !window.fetch) return;
  var box = document.getElementById('gl-results');
  var statusEl = document.getElementById('gl-status');
  var clearBtn = document.getElementById('gl-clear');
  var L = JSON.parse(document.getElementById('gl-i18n').textContent);
  var indexUrl = input.getAttribute('data-index');
  var idx = null, loading = false, timer = null, active = -1, hits = [];
  var askBtn = document.getElementById('gl-ask');
  var askOut = document.getElementById('gl-answer');
  var askReady = false, asking = false, lastQuery = '';
  // People type questions, not keywords. Left in, "mi az a RAG" scores every
  // document containing a word starting with "mi", which buries the one term
  // actually being asked about.
  var STOP = {
    hu: 'a az egy es és de hogy mi mit mik mint van vannak ez ezt azt ott itt vagy nem igen milyen hogyan miert miért kell lehet jo jó',
    en: 'a an the and or of to in on for is are was what how do does did you your i my it this that with can could would should',
    de: 'der die das ein eine und oder von zu in im auf fur für ist sind was wie kann man ich sie mit dass den dem des'
  };
  var stop = {};
  (STOP[document.documentElement.lang.slice(0, 2)] || STOP.en).split(' ').forEach(function (w) { stop[w] = 1; });

  function norm(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  function toks(s) {
    return norm(s).split(/[^a-z0-9#+.]+/).filter(function (t) { return t.length > 1; });
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  // A query token matches an indexed one on either prefix: Hungarian and German
  // glue suffixes onto words, so "embeddingeket" has to find "embedding" and
  // "embed" has to find it too.
  function match(t, q) {
    if (t === q) return true;
    // Two-letter queries ("AI", "ML") only ever match exactly — as a prefix they
    // would hit half the corpus.
    if (q.length < 3) return false;
    return t.indexOf(q) === 0 || (t.length > 3 && q.indexOf(t) === 0);
  }

  // Question words go, unless that would leave nothing to search for.
  function queryTokens(q) {
    var all = toks(q);
    var kept = all.filter(function (t) { return !stop[t]; });
    return kept.length ? kept : all;
  }

  var KIND_WEIGHT = { term: 1.18, page: 1, section: 0.95 };

  function build(list) {
    var total = 0;
    var docs = list.map(function (d) {
      var tf = {}, body = toks(d.x), title = toks(d.t), sect = toks(d.s || '');
      function add(arr, w) {
        arr.forEach(function (t) { tf[t] = (tf[t] || 0) + w; });
      }
      add(body, 1); add(title, 3); add(sect, 1.5);
      total += body.length;
      return { d: d, tf: tf, tt: title, len: body.length + title.length, nt: norm(d.t), nx: norm(d.x) };
    });
    return { docs: docs, N: docs.length || 1, avg: (total / (docs.length || 1)) || 1 };
  }

  function docFreq(q) {
    var n = 0;
    for (var i = 0; i < idx.docs.length; i++) {
      for (var t in idx.docs[i].tf) {
        if (match(t, q)) { n++; break; }
      }
    }
    return n;
  }

  function search(query) {
    var qs = queryTokens(query), nq = norm(query).trim();
    if (!qs.length) return [];
    var dfs = qs.map(docFreq);
    var out = [];
    idx.docs.forEach(function (o) {
      var score = 0, covered = 0;
      qs.forEach(function (q, i) {
        var tf = 0;
        for (var t in o.tf) { if (match(t, q)) tf += o.tf[t]; }
        if (!tf) return;
        covered++;
        var n = dfs[i] || 1;
        var idf = Math.log(1 + (idx.N - n + 0.5) / (n + 0.5));
        score += idf * (tf * 2.2) / (tf + 1.2 * (0.4 + 0.6 * o.len / idx.avg));
      });
      if (!covered) return;
      // Covering more of the question beats matching one word very often.
      score *= 1 + 0.4 * (covered - 1);
      score *= KIND_WEIGHT[o.d.k] || 1;
      // How much of the question is in the title, not just somewhere in the body.
      var tHit = 0;
      qs.forEach(function (q) {
        for (var i = 0; i < o.tt.length; i++) { if (match(o.tt[i], q)) { tHit++; return; } }
      });
      if (tHit) score += 6 * (tHit / qs.length);
      // A definition whose own name is what was typed is the answer, not a
      // document that merely mentions it.
      var title = o.nt, titleTokens = o.tt;
      if (qs.length === titleTokens.length && qs.every(function (q, i) { return titleTokens[i] === q; })) score += 24;
      else if (nq.length > 2 && title.indexOf(nq) >= 0) score += 10;
      else if (nq.length > 3 && o.nx.indexOf(nq) >= 0) score += 3;
      out.push({ d: o.d, score: score, qs: qs });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    // Better to say "nothing found" than to answer "how much does it cost" with
    // whatever happened to share a common word: the site has no pricing page,
    // and a confident irrelevant hit reads worse than an empty result.
    var best = out.length ? out[0].score : 0;
    if (best < 5) return [];
    return out.filter(function (h) { return h.score >= best * 0.33; }).slice(0, 8);
  }

  function snippet(text, qs) {
    var n = norm(text), at = -1;
    for (var i = 0; i < qs.length && at < 0; i++) {
      var p = n.indexOf(qs[i]);
      if (p >= 0) at = p;
    }
    var start = at < 60 ? 0 : at - 60;
    var cut = text.slice(start, start + 190).trim();
    var html = esc(cut).split(/(\s+)/).map(function (w) {
      var nw = norm(w);
      for (var i = 0; i < qs.length; i++) {
        if (match(nw, qs[i])) return '<mark>' + w + '</mark>';
      }
      return w;
    }).join('');
    return (start > 0 ? '…' : '') + html + (text.length > start + 190 ? '…' : '');
  }

  function kind(k) {
    return k === 'term' ? L.kindTerm : (k === 'page' ? L.kindPage : L.kindSection);
  }

  function render(list) {
    hits = list;
    active = -1;
    if (!list.length) {
      box.innerHTML = '<p class="gl-empty">' + esc(L.searchEmpty) + '</p>';
      say(L.searchEmpty);
    } else {
      box.innerHTML = list.map(function (h, i) {
        return '<a class="gl-hit" role="option" id="gl-hit-' + i + '" aria-selected="false" href="' + h.d.u + '">' +
          '<span class="gl-hit-kind">' + esc(kind(h.d.k)) + '</span>' +
          '<span class="gl-hit-title">' + esc(h.d.t) + '</span>' +
          '<span class="gl-hit-text">' + snippet(h.d.x, h.qs) + '</span>' +
          '</a>';
      }).join('');
      say(list.length === 1 ? L.searchCountOne : L.searchCountMany.replace('{n}', list.length));
    }
    open(true);
  }

  function say(msg) { statusEl.textContent = msg; }

  function open(state) {
    box.hidden = !state;
    input.setAttribute('aria-expanded', state ? 'true' : 'false');
    if (!state) {
      input.removeAttribute('aria-activedescendant');
      active = -1;
    }
  }

  function close() {
    open(false);
    box.innerHTML = '';
    say('');
  }

  function highlight(i) {
    var nodes = box.querySelectorAll('.gl-hit');
    for (var n = 0; n < nodes.length; n++) {
      var on = n === i;
      nodes[n].setAttribute('aria-selected', on ? 'true' : 'false');
      nodes[n].classList.toggle('active', on);
      if (on) {
        input.setAttribute('aria-activedescendant', nodes[n].id);
        nodes[n].scrollIntoView({ block: 'nearest' });
      }
    }
    active = i;
  }

  function run() {
    var q = input.value.trim();
    clearBtn.hidden = !q;
    lastQuery = q;
    if (q.length < 2) { close(); hideAsk(); return; }
    if (!idx) { load(q); return; }
    render(search(q));
    // Only offer a generated answer when there is something to ground it in.
    askBtn.hidden = !(askReady && hits.length);
  }

  function hideAsk() {
    askBtn.hidden = true;
    askOut.hidden = true;
    askOut.innerHTML = '';
  }

  // The endpoint reports whether it is configured; if it isn't (or isn't
  // deployed at all), the button never appears and search works as before.
  function probeAsk() {
    fetch('/api/ask').then(function (r) {
      return r.ok ? r.json() : { ready: false };
    }).then(function (d) {
      askReady = !!(d && d.ready);
      if (askReady && hits.length && input.value.trim()) askBtn.hidden = false;
    })['catch'](function () { askReady = false; });
  }

  function ask() {
    if (asking || !hits.length) return;
    asking = true;
    askBtn.disabled = true;
    askOut.hidden = false;
    askOut.innerHTML = '<p class="gl-answer-note">' + esc(L.askRunning) + '</p>';
    fetch('/api/ask', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        question: lastQuery,
        lang: document.documentElement.lang.slice(0, 2),
        ids: hits.slice(0, 5).map(function (h) { return h.d.u; })
      })
    }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    }).then(function (d) {
      var cites = (d.sources || []).map(function (sr) {
        return '<a href="' + sr.url + '">[' + sr.n + '] ' + esc(sr.title) + '</a>';
      }).join('');
      askOut.innerHTML = '<h3 class="gl-answer-title">' + esc(L.askTitle) + '</h3>' +
        '<p class="gl-answer-text">' + esc(d.answer).replace(/\n+/g, '<br>') + '</p>' +
        '<p class="gl-answer-sources"><span>' + esc(L.askSources) + ':</span> ' + cites + '</p>' +
        '<p class="gl-answer-note">' + esc(L.askNote) + '</p>';
    })['catch'](function () {
      askOut.innerHTML = '<p class="gl-answer-note">' + esc(L.askError) + '</p>';
    })['finally'](function () {
      asking = false;
      askBtn.disabled = false;
    });
  }

  if (askBtn) {
    askBtn.addEventListener('click', ask);
    probeAsk();
  }

  // The index is only fetched once someone actually types, so the page costs
  // nothing extra to load.
  function load() {
    if (loading) return;
    loading = true;
    say(L.searchLoading);
    fetch(indexUrl).then(function (r) { return r.json(); }).then(function (data) {
      idx = build(data.docs);
      loading = false;
      run();
    })['catch'](function () {
      loading = false;
      say(L.searchError);
    });
  }

  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(run, 120);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close(); input.blur(); return; }
    if (!hits.length || box.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); highlight((active + 1) % hits.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); highlight((active - 1 + hits.length) % hits.length); }
    else if (e.key === 'Enter') {
      var target = box.querySelectorAll('.gl-hit')[active < 0 ? 0 : active];
      if (target) { e.preventDefault(); target.click(); }
    }
  });

  clearBtn.addEventListener('click', function () {
    input.value = '';
    clearBtn.hidden = true;
    close();
    hideAsk();
    input.focus();
  });

  document.addEventListener('click', function (e) {
    if (!box.hidden && !box.contains(e.target) && e.target !== input) close();
  });
})();
