/* KI-Kandidat — Tweaks Panel Loader (always-on, no localhost restriction) */
(function () {
  var scripts = [
    { src: 'https://unpkg.com/react@18.3.1/umd/react.development.js',
      integrity: 'sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L' },
    { src: 'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
      integrity: 'sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm' },
    { src: 'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
      integrity: 'sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y' }
  ];

  function loadSeq(i) {
    if (i >= scripts.length) {
      // Babel loaded — inject JSX components
      setTimeout(function () {
        var p = document.createElement('script');
        p.type = 'text/babel'; p.src = 'tweaks-panel.jsx';
        document.body.appendChild(p);
        setTimeout(function () {
          var a = document.createElement('script');
          a.type = 'text/babel'; a.src = 'js/tweaks-app.jsx';
          document.body.appendChild(a);
        }, 80);
      }, 40);
      return;
    }
    var item = scripts[i];
    var el = document.createElement('script');
    el.src = item.src;
    el.integrity = item.integrity;
    el.crossOrigin = 'anonymous';
    el.onload = function () { loadSeq(i + 1); };
    el.onerror = function () { console.warn('[KIQ tweaks] failed:', item.src); };
    document.head.appendChild(el);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { loadSeq(0); });
  } else {
    loadSeq(0);
  }
})();
