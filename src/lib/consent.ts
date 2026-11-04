// Cookie-consent persistence (qa-standards rule 24).
// Accept stores {choice:'granted', ts, v} in localStorage for CONSENT_DAYS and sets <html data-consent="granted">,
// so an inline head rule hides the banner before first paint (no flash, no layout shift) and the banner is removed
// as soon as it parses. Analytics/tag scripts only run after a granted choice (window 'wt:consent' event, plus the
// Google Consent Mode update when a tag is present). No optional tag is loaded by this site at rest.
export const CONSENT_KEY = 'wt-consent';
export const CONSENT_DAYS = 180;

const HEAD = `<script is:inline>(function(){var K='${CONSENT_KEY}',D=${CONSENT_DAYS},el=document.documentElement,c=null;
try{c=JSON.parse(localStorage.getItem(K)||'null')}catch(e){}
if(c&&(!c.choice||!c.ts||(Date.now()-c.ts)/864e5>D)){try{localStorage.removeItem(K)}catch(e){}c=null}
function apply(v){if(v){el.setAttribute('data-consent',v)}else{el.removeAttribute('data-consent')}}
apply(c&&c.choice);
function granted(){if(window.gtag){window.gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'})}
try{window.dispatchEvent(new CustomEvent('wt:consent',{detail:{choice:'granted'}}))}catch(e){}}
window.wtConsent={get:function(){return c&&c.choice||null},days:${CONSENT_DAYS},
set:function(v){c={choice:v,ts:Date.now(),v:1};try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}apply(v);if(v==='granted')granted()},
clear:function(){c=null;try{localStorage.removeItem(K)}catch(e){}apply(null)}};
function pad(){var b=document.getElementById('sp-cookie-consent');var open=!!(b&&b.style.display!=='none'&&!b.hidden);
if(open){el.setAttribute('data-cookie-open','')}else{el.removeAttribute('data-cookie-open')}
if(open){document.documentElement.style.setProperty('--wt-cookie-h',(b.getBoundingClientRect().height+12)+'px')}else{document.documentElement.style.removeProperty('--wt-cookie-h')}}
function hide(){var b=document.getElementById('sp-cookie-consent');if(!b)return;b.style.display='none';b.setAttribute('hidden','');b.setAttribute('aria-hidden','true');pad()}
window.addEventListener('resize',pad,{passive:true});
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',pad)}else{pad()}
if(c&&c.choice==='granted'){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',hide)}else{hide()}granted()}
document.addEventListener('click',function(e){var t=e.target;if(!t||t.nodeType!==1)return;var b=t.closest('.sp-cookie-allow, .sp-cookie-close, [data-cookie-dismiss]');if(!b)return;
var bar=document.getElementById('sp-cookie-consent');if(!bar||!bar.contains(b))return;e.preventDefault();
var accept=b.classList.contains('sp-cookie-allow');
if(accept){window.wtConsent.set('granted')}
hide();});})();</script><style>html[data-consent="granted"] #sp-cookie-consent{display:none!important}
#sp-cookie-consent .sp-cookie-consent-action{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:flex-end}
#sp-cookie-consent .sp-cookie-dismiss{appearance:none;background:transparent;border:1px solid rgba(40,64,92,.45);border-radius:999px;color:inherit;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;font-size:20px;line-height:1;min-height:44px;min-width:44px;padding:0;text-decoration:none!important}
#sp-cookie-consent .sp-cookie-dismiss:hover,#sp-cookie-consent .sp-cookie-dismiss:focus-visible{border-color:currentColor}
@media only screen and (max-width:768px){#sp-cookie-consent .sp-cookie-dismiss{border-color:rgba(255,255,255,.7);color:#fff;min-height:40px;min-width:40px}}
@media only screen and (max-width:991px){#sp-cookie-consent .sp-cookie-consent-action{margin-left:auto;justify-content:flex-end}}</style>`;

const BODY = `<style>html body #sp-cookie-consent>div{padding-left:84px!important}html body #sp-cookie-consent .sp-cookie-short{display:none}@media only screen and (max-width:768px){html body #sp-cookie-consent{background-color:#4a13d6!important}html body #sp-cookie-consent>div{padding:8px 12px calc(8px + env(safe-area-inset-bottom)) 84px!important}html body #sp-cookie-consent.position-bottom>div{align-items:center!important;display:flex!important;flex-wrap:wrap!important;gap:6px 8px}html body #sp-cookie-consent .sp-cookie-long{display:none}html body #sp-cookie-consent .sp-cookie-short{display:inline;color:#fff;font-size:13px;line-height:1.25}html body #sp-cookie-consent .sp-cookie-short a{color:#fff}html body #sp-cookie-consent .sp-cookie-consent-content{flex:1 1 120px;min-width:0}html body #sp-cookie-consent .sp-cookie-consent-action{flex:0 0 auto;margin:0 0 0 auto!important;gap:6px;flex-wrap:nowrap}html body #sp-cookie-consent .sp-cookie-allow{font-size:13px!important;padding:6px 10px!important;white-space:nowrap}html body #sp-cookie-consent .sp-cookie-dismiss{border-color:rgba(255,255,255,.8)!important;min-height:38px!important;min-width:38px!important;color:#fff!important;font-size:18px!important}}html[data-cookie-open] body{padding-bottom:var(--wt-cookie-h,0px)}</style>`;

/** Insert the consent bootstrap immediately after <head> so it runs before the banner is parsed, and the banner
 *  layout rules at the end of <body> so they win over the page's own inlined banner CSS. */
export function withConsent(html: string): string {
  let out = html.includes('</head>') ? html.replace('<head>', '<head>' + HEAD) : html;
  return out.includes('</body>') ? out.replace('</body>', BODY + '</body>') : out;
}
