/* Storefront visibility filter. Plain JavaScript, no build step.
   Reads storefront-visibility.json and hides any element marked data-shop-item
   unless its status is "complete". An item that needs the Printful key also
   stays hidden until token_activated is true. If the file cannot be read,
   nothing is hidden, so a network error never removes finished products.
   Only the page view changes. No product, file or Printful record is touched. */
(function () {
  var REG = null;

  function shown(id) {
    var it = REG.items && REG.items[id];
    if (!it) return false;
    if (it.status !== 'complete') return false;
    if (it.needs_token && REG.token_activated !== true) return false;
    return true;
  }

  function apply(root) {
    if (!REG) return;
    var nodes = (root || document).querySelectorAll('[data-shop-item]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (shown(n.getAttribute('data-shop-item'))) {
        if (n.hasAttribute('data-shop-hidden')) {
          n.removeAttribute('data-shop-hidden');
          n.hidden = false;
          n.removeAttribute('aria-hidden');
        }
      } else {
        n.setAttribute('data-shop-hidden', '1');
        n.hidden = true;
        n.setAttribute('aria-hidden', 'true');
        n.style.display = 'none';
      }
    }
  }

  function start() {
    var base = document.currentScript && document.currentScript.src ? document.currentScript.src : '';
    var url = (base ? base.replace(/[^\/]*$/, '') : '/') + 'storefront-visibility.json?v=' + Date.now();
    fetch(url).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.items) return;
      REG = j;
      apply(document);
      if (window.MutationObserver) {
        new MutationObserver(function () { apply(document); }).observe(document.body, { childList: true, subtree: true });
      }
    }).catch(function () {});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
