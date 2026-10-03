/* Sanctuary Grace: Packing List block.
   One block, same look at every foyer, placed after the free thing.
   Usage: <div data-manifest="foyer|tqa|secret|gatezero"></div><script src="manifest.js" defer></script>
   Edit items here once and every foyer updates. Add a new link by adding one object to ITEMS
   and its key to a foyer in SETS. Only add links Grace has confirmed. */
(function () {
  var AMZ = 'sanctuarygr0a-20';
  var ITEMS = {
    harmony: {
      label: 'For the body and the spirit',
      title: 'Harmony Within: Faith and Resilience Guide',
      text: 'For the season when getting out of bed was the hard part.',
      url: 'https://www.digistore24.com/redir/512623/tdwdemp/',
      affiliate: true
    },
    throw_: {
      label: 'For rest',
      title: 'Weighted Fleece Throw',
      text: 'Somewhere soft to be still. You are allowed to be held.',
      url: 'https://www.amazon.com/dp/B0C7V67VVV?tag=' + AMZ,
      affiliate: true
    },
    diffuser: {
      label: 'For the room',
      title: 'Cool Mist Essential Oil Diffuser',
      text: 'Change the air in the room where you meet Him.',
      url: 'https://amzn.to/4pcq9Lw',
      affiliate: true
    },
    journal: {
      label: 'For the quiet hour',
      title: 'Leather-Lined Journal',
      text: 'Write it down. Pour out something besides yourself.',
      url: 'https://amzn.to/44rtiyA',
      affiliate: true
    },
    study: {
      label: 'For the Word',
      title: 'Step-by-Step Interactive Intimacy Blueprints',
      text: 'A map for studying the Word with real understanding.',
      url: 'https://buy.stripe.com/6oU8wPbNmggFevigr8cQU0F',
      affiliate: false
    },
    wear: {
      label: 'For the vow',
      title: 'The Sanctuary Grace Shop',
      text: 'Wear what you have said yes to.',
      url: 'https://sanctuary-grace-shop.printful.me',
      affiliate: false
    }
  };
  var SETS = {
    foyer:   ['harmony', 'throw_', 'journal', 'study', 'wear'],
    tqa:     ['harmony', 'throw_', 'journal', 'study'],
    secret:  ['journal', 'throw_', 'harmony', 'wear'],
    gatezero:['throw_', 'diffuser', 'journal', 'harmony']
  };

  var CSS =
    '.pm{max-width:520px;margin:48px auto 0;padding:36px 22px 8px;text-align:center;border-top:1px solid #C9A84C33}' +
    '.pm-eyebrow{font-family:Cinzel,Georgia,serif;font-size:11px;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;margin:0 0 14px}' +
    '.pm h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:30px;color:#F5F0E8;margin:0 0 14px}' +
    '.pm-intro{font-family:Jost,sans-serif;font-weight:300;font-size:15px;line-height:1.9;color:#F5F0E8bb;margin:0 auto 26px;max-width:440px}' +
    '.pm-item{display:flex;gap:14px;align-items:flex-start;text-align:left;padding:16px 0;border-top:1px solid #C1593C55;text-decoration:none}' +
    '.pm-item:last-of-type{border-bottom:1px solid #C1593C55}' +
    '.pm-box{flex:0 0 16px;width:16px;height:16px;border:1px solid #C9A84C;margin-top:5px}' +
    '.pm-label{display:block;font-family:Cinzel,Georgia,serif;font-size:10px;letter-spacing:3px;color:#C1593C;text-transform:uppercase;margin-bottom:4px}' +
    '.pm-title{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:20px;font-weight:600;color:#F5F0E8}' +
    '.pm-text{display:block;font-family:Jost,sans-serif;font-weight:300;font-size:13px;line-height:1.7;color:#F5F0E899;margin-top:3px}' +
    '.pm-item:hover .pm-title,.pm-item:focus .pm-title{color:#C9A84C}' +
    '.pm-note{font-family:Jost,sans-serif;font-weight:300;font-size:11px;line-height:1.7;color:#F5F0E855;margin:18px auto 0;max-width:420px}';

  function build(key) {
    var keys = SETS[key] || SETS.foyer;
    var html =
      '<p class="pm-eyebrow">The Packing List</p>' +
      '<h2>Pack for the Journey</h2>' +
      '<p class="pm-intro">You do not go to Hawaii without a swimsuit. You do not stay without a place to rest. ' +
      'These are the things that help you stay on the road. Every one of them is optional. Come as you are.</p>';
    var hasAff = false;
    keys.forEach(function (k) {
      var it = ITEMS[k];
      if (!it) return;
      if (it.affiliate) hasAff = true;
      html +=
        '<a class="pm-item" href="' + it.url + '" target="_blank" rel="' + (it.affiliate ? 'sponsored ' : '') + 'noopener">' +
        '<span class="pm-box" aria-hidden="true"></span>' +
        '<span><span class="pm-label">' + it.label + '</span>' +
        '<span class="pm-title">' + it.title + '</span>' +
        '<span class="pm-text">' + it.text + '</span></span></a>';
    });
    if (hasAff) {
      html += '<p class="pm-note">Some of these are affiliate links. If you buy through them, Sanctuary Grace may earn a small commission at no extra cost to you. It helps fund this ministry.</p>';
    }
    return html;
  }

  function init() {
    var nodes = document.querySelectorAll('[data-manifest]');
    if (!nodes.length) return;
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].className = (nodes[i].className ? nodes[i].className + ' ' : '') + 'pm';
      nodes[i].innerHTML = build(nodes[i].getAttribute('data-manifest'));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
