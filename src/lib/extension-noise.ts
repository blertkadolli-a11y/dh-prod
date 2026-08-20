/**
 * Browser extensions (MetaMask being the usual culprit) inject a script into
 * every page and throw inside it — "Failed to connect to MetaMask",
 * "MetaMask extension not found". Those errors have nothing to do with this
 * site; there is no web3 code here at all. But they are unhandled errors on
 * the window, so Next's dev overlay catches them and shows a red issue badge,
 * which buries genuine app errors.
 *
 * This must be injected as a blocking inline script in `_document`, NOT from a
 * React effect. Error listeners on `window` fire in registration order, and
 * `stopImmediatePropagation` only cancels listeners registered *after* the one
 * calling it — so anything running from an effect loses the race to Next's own
 * overlay handler, which is installed while the client bundle boots.
 *
 * Scoped two ways so it can never mask a real problem: development only, and
 * only when the error's origin is an extension URL.
 */

const SCRIPT = `(function(){
  var EXT = ['chrome-extension://','moz-extension://','safari-web-extension://'];
  function fromExt(v){
    if (!v) return false;
    var s = '';
    try {
      s = (v.stack || '') + ' ' + (v.message || '');
      if (!v.stack && !v.message) s = String(v);
      if (v.cause) s += ' ' + ((v.cause.stack || '') + ' ' + (v.cause.message || ''));
    } catch (e) { return false; }
    for (var i = 0; i < EXT.length; i++) if (s.indexOf(EXT[i]) !== -1) return true;
    return false;
  }
  function guard(e, value, filename){
    if ((filename && filename.indexOf('-extension://') !== -1) || fromExt(value)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return true;
    }
    return false;
  }
  window.addEventListener('error', function(e){
    guard(e, e.error, e.filename);
  }, true);
  window.addEventListener('unhandledrejection', function(e){
    guard(e, e.reason, '');
  }, true);
})();`

/** Injected only in development; compiles to nothing in production. */
export const extensionNoiseScript = (): string | null =>
    process.env.NODE_ENV === 'development' ? SCRIPT : null
