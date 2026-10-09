/* Sanctuary Grace: saved language choice.
   One small bar at the top of each room. The choice is kept in localStorage (sg_lang) and mirrored
   into the googtrans cookie on every page, so a visitor picks a language once and every room
   opens in it. English visitors never contact Google: the translate script loads only when a
   non-English language is saved. Uses only the brand colors and fonts. */
(function () {
  var LANGS = [['en', 'EN'], ['es', 'ES'], ['pt', 'PT'], ['fr', 'FR'], ['ko', 'KO']];
  var KEY = 'sg_lang';

  function store(v) { try { if (v === undefined) { return localStorage.getItem(KEY); } localStorage.setItem(KEY, v); } catch (e) {} return null; }
  function cookieLang() { var m = document.cookie.match(/googtrans=\/en\/([a-z]+)/); return m ? m[1] : 'en'; }
  function setCookie(lang) {
    var h = location.hostname;
    var gone = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    if (lang === 'en') {
      document.cookie = 'googtrans=; ' + gone;
      document.cookie = 'googtrans=; ' + gone + '; domain=.' + h;
    } else {
      document.cookie = 'googtrans=/en/' + lang + '; path=/';
      document.cookie = 'googtrans=/en/' + lang + '; path=/; domain=.' + h;
    }
  }
  function valid(l) { return LANGS.some(function (x) { return x[0] === l; }); }

  // The saved choice wins. If only the cookie exists (set on another page), adopt it.
  var saved = store();
  if (!valid(saved)) { saved = cookieLang(); if (valid(saved)) { store(saved); } else { saved = 'en'; } }
  if (cookieLang() !== saved) {
    setCookie(saved);
    // Reload once so the translator sees the cookie. The flag stops any loop.
    var flag = 'sg_lang_applied';
    var done = false;
    try { done = sessionStorage.getItem(flag) === saved + location.pathname; sessionStorage.setItem(flag, saved + location.pathname); } catch (e) { done = true; }
    if (!done) { location.reload(); return; }
  }

  window.sgSetLanguage = function (lang) {
    if (!valid(lang)) { return; }
    store(lang);
    setCookie(lang);
    location.reload();
  };

  function build() {
    var css = document.createElement('style');
    css.textContent =
      '.goog-te-banner-frame,.skiptranslate{display:none!important}body{top:0!important}' +
      '#sg-lang{background:#0d0d0d;text-align:center;padding:6px 0;line-height:1;position:relative;z-index:50}' +
      '#sg-lang button{background:none;border:none;color:#807870;font-family:"Cinzel",serif;font-size:11px;letter-spacing:.16em;cursor:pointer;padding:8px 6px;line-height:1}' +
      '#sg-lang button:hover{color:#F5F0E8}#sg-lang button.cur{color:#C9A84C}' +
      '#sg-lang span{color:#323232;font-size:10px}';
    document.head.appendChild(css);

    var bar = document.createElement('div');
    bar.id = 'sg-lang';
    bar.className = 'notranslate';
    bar.setAttribute('translate', 'no');
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Language');
    LANGS.forEach(function (x, i) {
      if (i) { var s = document.createElement('span'); s.textContent = '·'; bar.appendChild(s); }
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = x[1];
      b.setAttribute('data-lang', x[0]);
      if (x[0] === saved) { b.className = 'cur'; b.setAttribute('aria-current', 'true'); }
      b.addEventListener('click', function () { window.sgSetLanguage(x[0]); });
      bar.appendChild(b);
    });
    document.body.insertBefore(bar, document.body.firstChild);

    if (saved !== 'en') {
      var holder = document.createElement('div');
      holder.id = 'google_translate_element';
      holder.style.cssText = 'display:none;visibility:hidden';
      document.body.appendChild(holder);
      window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
      };
      var sc = document.createElement('script');
      sc.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      sc.async = true;
      document.body.appendChild(sc);
    }
  }
  if (document.body) { build(); } else { document.addEventListener('DOMContentLoaded', build); }
})();
