/* FILAZUL — Google Analytics 4 (G-YSM7W9ETGR) with Consent Mode v2.
 *
 * - Loads GA only on filazul.com; on localhost events are logged to the console instead.
 * - Ads signals are always denied (we don't run ads). Analytics is granted by default,
 *   except in the EEA / UK / Switzerland, where it waits for consent.
 * - A small consent notice is shown to visitors whose browser time zone is in Europe.
 * - Custom events: age_gate_pass / age_gate_fail (result only, never the birth date),
 *   video_progress (25/50/75/100 through the scroll animation) and cta_click.
 */
(function () {
  var GA_ID = 'G-YSM7W9ETGR';
  var LIVE = /(^|\.)filazul\.com$/.test(location.hostname);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  if (!LIVE) {
    // Local preview: show what would be sent, send nothing.
    window.gtag = function () { console.debug('[gtag] ' + JSON.stringify([].slice.call(arguments))); };
  }

  var EU_REGIONS = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
                    'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO',
                    'GB','CH'];

  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'granted'
  });
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', region: EU_REGIONS, wait_for_update: 500
  });

  var saved = null;
  try { saved = localStorage.getItem('fz_consent'); } catch (e) {}
  if (saved === 'granted' || saved === 'denied') {
    gtag('consent', 'update', { analytics_storage: saved });
  }

  if (LIVE) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }
  gtag('js', new Date());
  gtag('config', GA_ID);

  // Public helper for page scripts: FZ.track('event_name', {params})
  window.FZ = window.FZ || {};
  window.FZ.track = function (name, params) { gtag('event', name, params || {}); };

  // CTA button clicks
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.cta-button');
    if (!a) return;
    FZ.track('cta_click', {
      cta_label: (a.textContent || '').trim().slice(0, 60),
      cta_destination: a.getAttribute('href') || ''
    });
  });

  // Consent notice — Europe time zones only, until a choice is made
  var tz = '';
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
  if (saved || tz.indexOf('Europe/') !== 0) return;

  function showNotice() {
    var box = document.createElement('div');
    box.id = 'fz-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie preferences');
    box.innerHTML =
      '<p>We use analytics cookies to understand how visitors enjoy our site. No ads, no selling data.</p>' +
      '<div class="fz-consent-actions">' +
        '<button type="button" data-choice="denied">Decline</button>' +
        '<button type="button" data-choice="granted" class="fz-accept">Accept</button>' +
      '</div>';
    var css = document.createElement('style');
    css.textContent =
      '#fz-consent{position:fixed;left:16px;right:16px;bottom:16px;max-width:420px;z-index:10000;' +
        'background:#2f4b50;color:#f5f0e8;padding:1.1rem 1.25rem;border-radius:10px;' +
        'box-shadow:0 12px 40px rgba(0,0,0,.35),0 2px 8px rgba(0,0,0,.2);font-size:.9rem;line-height:1.55}' +
      '#fz-consent p{margin:0 0 .9rem}' +
      '.fz-consent-actions{display:flex;gap:.6rem;justify-content:flex-end}' +
      '#fz-consent button{font:inherit;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;' +
        'padding:.6rem 1.2rem;border-radius:50px;border:1px solid rgba(245,240,232,.5);background:transparent;color:#f5f0e8;' +
        'transition:transform .2s ease,opacity .2s ease}' +
      '#fz-consent button:hover{transform:translateY(-1px)}' +
      '#fz-consent button:active{transform:translateY(0);opacity:.85}' +
      '#fz-consent button:focus-visible{outline:2px solid #c9a96e;outline-offset:2px}' +
      '#fz-consent .fz-accept{background:linear-gradient(135deg,#d97832,#f4a460);border-color:transparent;color:#fff;font-weight:700}';
    document.head.appendChild(css);
    document.body.appendChild(box);
    box.addEventListener('click', function (e) {
      var choice = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!choice) return;
      try { localStorage.setItem('fz_consent', choice); } catch (err) {}
      gtag('consent', 'update', { analytics_storage: choice });
      box.remove();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showNotice);
  else showNotice();
})();
