// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"k8Xbc":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "310769bd93566fe3";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"2VkcA":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "friends", ()=>friends);
parcelHelpers.export(exports, "areFriendsFetched", ()=>areFriendsFetched);
parcelHelpers.export(exports, "settings", ()=>settings);
parcelHelpers.export(exports, "setFriendsInLobby", ()=>setFriendsInLobby);
parcelHelpers.export(exports, "getIconElem", ()=>getIconElem);
parcelHelpers.export(exports, "containsWord", ()=>containsWord);
parcelHelpers.export(exports, "init", ()=>init);
parcelHelpers.export(exports, "setSetting", ()=>setSetting);
parcelHelpers.export(exports, "getSettingValue", ()=>getSettingValue);
parcelHelpers.export(exports, "getSetting", ()=>getSetting);
parcelHelpers.export(exports, "setSettingsTitle", ()=>setSettingsTitle);
parcelHelpers.export(exports, "addCategory", ()=>addCategory);
parcelHelpers.export(exports, "removeCategory", ()=>removeCategory);
parcelHelpers.export(exports, "addSetting", ()=>addSetting);
parcelHelpers.export(exports, "removeSetting", ()=>removeSetting);
parcelHelpers.export(exports, "filterWithSettings", ()=>filterWithSettings);
// This is in reverse
parcelHelpers.export(exports, "meetsConditions", ()=>meetsConditions);
parcelHelpers.export(exports, "addEventListener", ()=>addEventListener);
var _unityRichTextJs = require("./unityRichText.js");
var _constJs = require("./const.js");
var _steamJs = require("./steam.js");
var _tippyJs = require("tippy.js");
var _tippyJsDefault = parcelHelpers.interopDefault(_tippyJs);
var _tippyCss = require("tippy.js/dist/tippy.css");
var _dompurify = require("dompurify");
var _dompurifyDefault = parcelHelpers.interopDefault(_dompurify);
var _fuseJs = require("fuse.js");
var _fuseJsDefault = parcelHelpers.interopDefault(_fuseJs);
var _flagIconsMinCss = require("/node_modules/flag-icons/css/flag-icons.min.css");
let friends = undefined;
let friendListElem;
let friendsCancel;
let initialized = false;
let friendsAnyDisplayed = false;
let areFriendsFetched = false;
let categories = [
    {
        name: "General",
        icon: "fa-solid fa-house",
        expanded: true
    },
    {
        name: "Groups",
        icon: "fa-solid fa-book",
        expanded: false
    },
    {
        name: "Platforms",
        icon: "fa-solid fa-computer",
        expanded: true
    },
    {
        name: "Players",
        icon: "fa-solid fa-users",
        expanded: false
    },
    {
        name: "Visibility",
        icon: "fa-solid fa-eye",
        expanded: false
    },
    {
        name: "Level",
        icon: "fa-solid fa-map",
        expanded: false
    },
    {
        name: "Gamemodes",
        icon: "fa-solid fa-puzzle-piece",
        expanded: false,
        sort: true,
        sortMode: "filterTotalCount",
        sortOrder: 1
    },
    {
        name: "Filtering",
        icon: "fa-solid fa-shield-halved",
        expanded: false
    },
    {
        name: "Steam Settings",
        icon: "fa-brands fa-steam",
        expanded: false
    },
    {
        name: "Friends",
        icon: "fa-solid fa-user-group",
        expanded: true,
        customHandler: async (container)=>{
            if (friendsCancel) friendsCancel.abort();
            const controller = new AbortController();
            friendsCancel = controller;
            fillCategory({
                name: "Friends"
            });
            const list = container.getElementsByTagName("div")[0];
            friendListElem = list;
            list.classList.add("friendsContainer");
            if (list.hasChildNodes()) {
                const divider = document.createElement("div");
                divider.classList.add("divider");
                list.appendChild(divider);
            }
            const toCopy = document.getElementById("friendToCopy");
            const order = [
                6,
                1,
                4,
                2,
                3,
                0,
                5
            ];
            let seconds = 0;
            function counter() {
                seconds++;
                if (seconds >= 30) create();
            }
            async function create(ignore = false) {
                if (!ignore) {
                    if (document.hidden || !document.hasFocus()) return;
                }
                if (controller?.aborted == true) {
                    clearInterval(counter);
                    return;
                }
                seconds = 0;
                function hide() {
                    list.childNodes.forEach((x)=>{
                        if (x.classList.contains("steamAccount")) x.classList.add("hidden");
                    });
                }
                const notices = list.getElementsByClassName("notice");
                if (notices && notices.length > 0) for (const n of notices)n.remove();
                const self = await (0, _steamJs.getSelf)();
                if (!self) {
                    notice(list, "Not Logged In!", "You need to log in with Steam to view friends list!", "fas fa-arrow-right-to-bracket");
                    areFriendsFetched = true;
                    window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
                    hide();
                    return;
                }
                friends = await (0, _steamJs.getFriends)();
                if (friends == false) {
                    friends = [];
                    notice(list, "Friends List Not Public!", "You must set your steam friends list to be public!", "fas fa-xmark", "--flb-error-color");
                    areFriendsFetched = true;
                    window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
                    hide();
                    return;
                } else if (!friends) {
                    notice(list, "Failed!", "Failed to fetch friends list", "fas fa-xmark", "--flb-error-color");
                    areFriendsFetched = true;
                    window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
                    hide();
                    return;
                }
                const sorted = structuredClone(friends);
                sorted.forEach((f)=>{
                    if (f.playingGameName && f.playingGameName != "") f.userStatus = 6;
                });
                sorted.sort((a, b)=>order.findIndex((x)=>x == a.userStatus) - order.findIndex((x)=>x == b.userStatus));
                friendsAnyDisplayed = false;
                const onlyInLobby = getSettingValue("displayInLobby");
                sorted.forEach((f)=>{
                    let elem = list.querySelector(`div[steamid="${f.steamId}"]`);
                    if (!elem) elem = toCopy.cloneNode(true);
                    elem.removeAttribute("id");
                    const avatar = elem.getElementsByClassName("friendAvatar")[0];
                    const inLobby = friendsLobbies.find((x)=>x.id == f.steamId);
                    if (f.userStatus == 0 || onlyInLobby && !inLobby) {
                        elem.classList.add("hidden");
                        avatar.loading = "lazy";
                        avatar.fetchpriority = "low";
                    } else {
                        elem.classList.remove("hidden");
                        avatar.loading = "eager";
                        avatar.fetchpriority = "auto";
                        friendsAnyDisplayed = true;
                    }
                    elem.setAttribute("steamid", f.steamId);
                    avatar.width = 32;
                    avatar.height = 32;
                    avatar.setAttribute("alt", `Avatar of ${f.nickname}`);
                    avatar.setAttribute("src", f.avatarUrl.replace("avatars.steamstatic.com", "avatars.fastly.steamstatic.com"));
                    const username = elem.getElementsByClassName("friendUsername")[0];
                    username.textContent = f.nickname;
                    username.href = f.profileUrl;
                    const additionalInfo = elem.getElementsByClassName("steamAdditionalInfo")[0];
                    const btnContainer = elem.getElementsByClassName("buttonContainer")[0];
                    if (!inLobby) {
                        additionalInfo.style.color = `var(--flb-status${f.userStatus}-color)`;
                        elem.style.order = order.findIndex((x)=>x == f.userStatus) + 1;
                        btnContainer.classList.add("hidden");
                    } else {
                        elem.setAttribute("overridenInfo", "true");
                        elem.style.order = 0;
                        additionalInfo.style.color = "var(--flb-status6-color)";
                        additionalInfo.innerHTML = `Playing in a lobby - ${inLobby.lobbyName}`;
                        btnContainer.classList.remove("hidden");
                        const joinBtn = elem.getElementsByClassName("joinButton")[0];
                        joinInfo(joinBtn);
                        joinBtn.onclick = async ()=>await requestJoin(inLobby.lobbyCode, inLobby.lobbyPlatform);
                        const infoBtn = elem.getElementsByClassName("infoButton")[0];
                        infoBtn.onclick = ()=>window.dispatchEvent(new CustomEvent("displayInfo", {
                                detail: {
                                    lobbyID: inLobby.lobbyID
                                }
                            }));
                    }
                    let status;
                    switch(f.userStatus){
                        case 0:
                            status = "Offline";
                            break;
                        case 1:
                            status = "Online";
                            break;
                        case 2:
                            status = "Busy";
                            break;
                        case 3:
                            status = "Away";
                            break;
                        case 4:
                            status = "AFK...";
                            break;
                        case 6:
                            status = `Playing a game${f.playingGameName && f.playingGameName != "" ? ` - ${f.playingGameName}` : ""}`;
                            break;
                        default:
                            status = "Unknown status";
                            break;
                    }
                    if (!inLobby) additionalInfo.textContent = status;
                    elem.setAttribute("userStatus", f.userStatus);
                    elem.setAttribute("infoText", status);
                    list.appendChild(elem);
                });
                list.childNodes.forEach((x)=>{
                    if (x.classList.contains("steamAccount") && !friends.find((f)=>f.steamId == x.getAttribute("steamid"))) x.remove();
                });
                if (!friendsAnyDisplayed && friends) notice(list, "Nobody's there", onlyInLobby ? "Seems like nobody's playing BONELAB right now" : "Seems like nobody's playing anything right now", "fas fa-face-frown");
                else {
                    const notices = list.getElementsByClassName("notice");
                    if (notices && notices.length > 0) for (const n of notices)n.remove();
                }
                areFriendsFetched = true;
                window.dispatchEvent(new CustomEvent("onfriendslistfetched", {}));
            }
            create(true);
            setInterval(counter, 1000);
        }
    }
];
const RP_LEVELS = [
    "T0x1c.HoodCorner.Level.GmHoodCornerDay",
    "T0x1c.HoodCorner.Level.GmHoodCornerNight",
    "T0x1c.RPSouthside.Level.RPSouthside",
    "jiggy.gmnightlight.Level.gmdaylight",
    "jiggy.gmnightlight.Level.gmnightlight",
    "Cheezy.HoodCorner.Level.GmHoodCorner",
    "SoldierThree57.rpdowntowntiny.Level.rpdowntowntinynight",
    "SoldierThree57.rpdowntowntiny.Level.rpdowntowntinyday"
];
let settings = [
    // General
    {
        id: "searchField",
        category: "General",
        type: "search",
        name: "Search",
        icon: "fa-solid fa-magnifying-glass",
        defaultValue: "",
        filterValue: (s, val1)=>val1 && val1.length > 0,
        lobbyFilter: true,
        lobbyValidator: (lobby, val1)=>{
            const name = lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`;
            const fuse = new (0, _fuseJsDefault.default)([
                (0, _unityRichTextJs.Converter).removeRichText(name.toLowerCase())
            ], {
                threshold: 0.35
            });
            const res = fuse.search(val1);
            return !res || res.length < 1;
        },
        setFilterName: false,
        saveToStorage: false
    },
    {
        id: "sort",
        name: "Sort Mode",
        category: "General",
        type: "select",
        displayLabel: false,
        values: [
            {
                name: "Alphabetical",
                icon: "fas fa-arrow-down-a-z"
            },
            {
                name: "Players",
                icon: "fas fa-people-group"
            },
            {
                name: "Uptime",
                icon: "fas fa-clock"
            }
        ],
        defaultValue: "Players"
    },
    {
        id: "sortOrder",
        name: "Sort Order",
        category: "General",
        type: "select",
        displayLabel: false,
        values: [
            {
                name: "Ascending",
                icon: "fas fa-arrow-up"
            },
            {
                name: "Descending",
                icon: "fas fa-arrow-down"
            }
        ],
        defaultValue: "Descending"
    },
    {
        id: "theme",
        name: "Theme",
        category: "General",
        type: "select",
        icon: "fas fa-fill-drip",
        values: [
            {
                name: "System Preference",
                id: "systemPreference",
                icon: "fas fa-computer"
            },
            {
                name: "Dark",
                id: "dark",
                icon: "fas fa-moon"
            },
            {
                name: "Light",
                id: "light",
                icon: "fas fa-sun"
            }
        ],
        defaultValue: "systemPreference"
    },
    {
        id: "autoRefresh",
        category: "General",
        type: "toggle",
        name: "Auto Refresh",
        icon: "fa-solid fa-arrows-rotate fa-spin",
        defaultValue: false
    },
    {
        id: "filterCount",
        category: "General",
        type: "toggle",
        name: "Show Lobby Count on Filters",
        icon: "fa-solid fa-list-ol",
        defaultValue: false,
        callback: ()=>init()
    },
    // Groups
    {
        id: "roleplayLobbies",
        category: "Groups",
        type: "filter",
        name: "Roleplay",
        icon: "fa-solid fa-briefcase",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        filterWords: [
            "shooting",
            "shooter",
            {
                word: "rp",
                type: "whole-word"
            },
            "war",
            "roleplay",
            "cops",
            "robbers"
        ],
        filterLevels: RP_LEVELS,
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "hoodLobbies",
        category: "Groups",
        type: "filter",
        name: "Hood RP",
        icon: "fa-solid fa-person-rifle",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        filterWords: [
            "hood",
            "hoodrp"
        ],
        filterLevels: RP_LEVELS,
        defaultValue: {
            include: false,
            exclude: true
        },
        storeAsJSON: true
    },
    {
        id: "russianLobbies",
        category: "Groups",
        type: "filter",
        name: "Russian",
        icon: "fi fis fi-ru",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        filterWords: [
            "russian",
            "russia",
            "rus",
            "russ",
            "russi",
            "russkie",
            {
                word: "ru",
                type: "whole-word"
            }
        ],
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "horrorLobbies",
        category: "Groups",
        type: "filter",
        name: "Horror",
        icon: "fa-solid fa-ghost",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        filterWords: [
            "horror",
            "monster",
            "survive",
            "killer",
            "hide and seek",
            "hide & seek",
            "hideseek",
            "hideandseek",
            "hide n seek"
        ],
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "backroomsLobbies",
        category: "Groups",
        type: "filter",
        name: "Backrooms",
        icon: "fa-solid fa-biohazard",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        filterWords: [
            "backrooms",
            "backroom"
        ],
        filterLevels: [
            "0gravity.BackroomsEntropy.Level.BackroomsEntropy",
            "HombresGuapos.TheBackroomsA24.Level.TheBackroomsA24"
        ],
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "furryLobbies",
        category: "Groups",
        type: "filter",
        name: "Furry",
        icon: "fa-solid fa-paw",
        tooltip: 'This shows lobbies that HAVE players in them with furry avatars from <a class="modLink" href="https://mod.io/g/bonelab/c/every-furry-mod" target="_blank" rel="noopener noreferrer">Bonesi\'s collection</a> this means that if for example somebody joins a hood rp lobby with a furry avatar, it will be considered in this filter.',
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>lobby.lobbyHasFurries == "true" || lobby.lobbyHasFurries == true,
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "otherLobbies",
        category: "Groups",
        type: "filter",
        name: "Other",
        icon: "fa-solid fa-plus",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            for (const x of settings){
                if (x.category != "Groups" || x.id == "otherLobbies") continue;
                if (!x.filterWords && !x.filterLevels && !x.lobbyValidator) continue;
                if (meetsConditions(x, lobby)) return false;
            }
            return true;
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    // Platforms
    {
        id: "steamPlatform",
        category: "Platforms",
        type: "filter",
        name: "Steam",
        icon: "fa-brands fa-steam",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return lobby.lobbyPlatform == "Steam";
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "epicPlatform",
        category: "Platforms",
        type: "filter",
        name: "Epic Games",
        icon: "fa-custom fa-epicgames",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return lobby.lobbyPlatform == "Epic";
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    // Visibility
    {
        id: "publicLobbies",
        category: "Visibility",
        type: "filter",
        name: "Public",
        icon: "fas fa-user-group",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return lobby.privacy == 0;
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "friendsOnlyLobbies",
        category: "Visibility",
        type: "filter",
        name: "Friends Only",
        icon: "fas fa-user-lock",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return lobby.privacy == 2;
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    // Levels
    {
        id: "vanillaLevels",
        category: "Level",
        type: "filter",
        name: "Vanilla",
        icon: "fas fa-map-location-dot",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return (0, _constJs.barcodes).find((x)=>x.barcode == lobby.levelBarcode);
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    {
        id: "moddedLevels",
        category: "Level",
        type: "filter",
        name: "Modded",
        icon: "fas fa-wrench",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return !(0, _constJs.barcodes).find((x)=>x.barcode == lobby.levelBarcode);
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    // Players
    {
        id: "playerCount",
        category: "Players",
        type: "range",
        name: "Player Count",
        icon: "fa-solid fa-people-arrows",
        filterValue: (s, val1)=>val1 && val1.min && val1.max && !(val1.min == s.minValue && val1.max == s.maxValue),
        lobbyFilter: true,
        setFilterName: false,
        lobbyValidator: (lobby, val1)=>{
            return lobby.playerCount < val1.min || lobby.playerCount > val1.max;
        },
        minValue: 1,
        maxValue: 20,
        step: 1,
        defaultValue: {
            min: 1,
            max: 20
        },
        storeAsJSON: true
    },
    {
        id: "fullLobbies",
        category: "Players",
        type: "filter",
        icon: "fa-solid fa-users-viewfinder",
        name: "Full Lobbies",
        filterValue: (s, val1)=>val1 && (val1.include || val1.exclude),
        lobbyFilter: true,
        lobbyValidator: (lobby)=>{
            return lobby.playerCount == lobby.maxPlayers;
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    },
    // Filtering
    {
        id: "censorNSFW",
        category: "Filtering",
        type: "toggle",
        name: "Censor NSFW",
        icon: "fa-solid fa-lock",
        defaultValue: true
    },
    {
        id: "hideNSFWLobbies",
        category: "Filtering",
        type: "toggle",
        name: "Hide NSFW Lobbies",
        icon: "fa-solid fa-shield",
        defaultValue: true
    },
    // Steam Settings
    {
        id: "prioritizeLobbiesWithFriends",
        category: "Steam Settings",
        type: "toggle",
        name: "Prioritize Lobbies /w Friends",
        icon: "fa-solid fa-arrow-up",
        defaultValue: true
    },
    {
        id: "prioritizeFriendsOnlyLobbies",
        category: "Steam Settings",
        type: "toggle",
        name: "Prioritize Friends Only Lobbies",
        icon: "fa-solid fa-arrow-up",
        defaultValue: true
    },
    {
        id: "displayInLobby",
        category: "Steam Settings",
        type: "toggle",
        name: "Only Display Friends in Lobby",
        icon: "fa-solid fa-play",
        defaultValue: true,
        callback: ()=>init()
    },
    {
        id: "highlightFriends",
        category: "Steam Settings",
        type: "toggle",
        name: "Highlight Lobbies /w Friends",
        icon: "fa-solid fa-star",
        defaultValue: true
    }
];
let types = [
    {
        type: "toggle",
        callback: (setting, value)=>{
            const wrapper = document.createElement("div");
            wrapper.classList.add("checkbox-wrapper");
            const input = document.createElement("input");
            input.classList.add("checkbox");
            input.setAttribute("type", "checkbox");
            input.setAttribute("name", setting.name);
            input.setAttribute("id", getElemId(setting.id));
            if (value == "true" || value == true) input.setAttribute("checked", true);
            let old = input.checked;
            input.addEventListener("change", ()=>{
                wrapper.dispatchEvent(new CustomEvent("onsettingchanged", {
                    detail: {
                        old: old,
                        new: input.checked
                    }
                }));
                old = input.checked;
            });
            const label = document.createElement("label");
            label.setAttribute("for", getElemId(setting.id));
            fillLabel(setting, label);
            wrapper.appendChild(input);
            if (setting.displayLabel != false) wrapper.appendChild(label);
            return wrapper;
        },
        overrideCached: (value)=>{
            if (value == "true" || value == true) return true;
            else return false;
        },
        setTitle: (elem, title)=>setContent(elem.querySelector("label"), title),
        setValue: (elem, val1)=>{
            const input = elem?.getElementsByTagName("input");
            if (input && input.length > 0) {
                let _val;
                if (val1 == "true" || val1 == true) _val = true;
                else _val = false;
                input[0].checked = _val;
            }
        }
    },
    {
        type: "filter",
        callback: (setting, value)=>{
            const wrapper = document.createElement("div");
            wrapper.classList.add("checkbox-wrapper");
            const include = document.createElement("input");
            include.classList.add("checkbox");
            include.setAttribute("type", "checkbox");
            include.setAttribute("name", `Include ${setting.name}`);
            include.setAttribute("id", getElemId(setting.id));
            if (value.include) include.setAttribute("checked", true);
            const exclude = document.createElement("input");
            exclude.classList.add("exclude");
            exclude.setAttribute("type", "checkbox");
            exclude.setAttribute("name", `Exclude ${setting.name}`);
            exclude.setAttribute("id", `${getElemId(setting.id)}_exclude`);
            if (value.exclude) exclude.setAttribute("checked", true);
            createToolTip(exclude, "Exclude");
            let old = {
                include: include.checked,
                exclude: exclude.checked
            };
            function onChanged() {
                if (old.include && exclude.checked) include.checked = false;
                else if (old.exclude && include.checked) exclude.checked = false;
                const val1 = {
                    include: include.checked,
                    exclude: exclude.checked
                };
                wrapper.dispatchEvent(new CustomEvent("onsettingchanged", {
                    detail: {
                        old: old,
                        new: val1
                    }
                }));
                old = val1;
            }
            include.addEventListener("change", onChanged);
            exclude.addEventListener("change", onChanged);
            const label = document.createElement("label");
            label.setAttribute("for", getElemId(setting.id));
            fillLabel(setting, label);
            wrapper.appendChild(include);
            if (setting.displayLabel != false) wrapper.appendChild(label);
            wrapper.appendChild(exclude);
            return wrapper;
        },
        setTitle: (elem, title)=>setContent(elem.querySelector("label"), title),
        setValue: (elem, val1)=>{
            const include = elem?.querySelector(".checkbox");
            if (include) {
                let _val;
                if (val1 && val1.include) _val = true;
                else _val = false;
                include.checked = _val;
            }
            const exclude = elem?.querySelector(".exclude");
            if (exclude) {
                let _val;
                if (val1 && val1.exclude) _val = true;
                else _val = false;
                exclude.checked = _val;
            }
        }
    },
    {
        type: "select",
        callback: (setting, value)=>{
            const wrapper = document.createElement("div");
            wrapper.classList.add("selectWrapper");
            const label = document.createElement("label");
            label.setAttribute("for", getElemId(setting.id));
            label.classList.add("selectLabel");
            fillLabel(setting, label);
            if (setting.displayLabel != false) {
                wrapper.appendChild(label);
                const br = document.createElement("br");
                wrapper.appendChild(br);
            }
            const select = document.createElement("select");
            select.setAttribute("name", getElemId(setting.id));
            select.setAttribute("aria-label", setting.name);
            select.setAttribute("id", getElemId(setting.id));
            const btn = document.createElement("button");
            btn.appendChild(document.createElement("selectedcontent"));
            select.appendChild(btn);
            setting.values.forEach((val1)=>{
                const option = document.createElement("option");
                if (isString(val1)) setOption(option, val1, val1);
                else setOption(option, val1.id, val1.name, val1.icon);
                select.appendChild(option);
            });
            select.value = value;
            let old = select.value;
            select.addEventListener("change", ()=>{
                wrapper.dispatchEvent(new CustomEvent("onsettingchanged", {
                    detail: {
                        old: old,
                        new: select.value
                    }
                }));
                old = select.value;
            });
            wrapper.appendChild(select);
            return wrapper;
        },
        setTitle: (elem, title)=>setContent(elem.querySelector("label"), title),
        setValue: (elem, val1)=>{
            const input = elem?.getElementsByTagName("select");
            if (input && input.length > 0) input[0].value = val1;
        }
    },
    {
        type: "search",
        callback: (setting, value)=>{
            const wrapper = document.createElement("div");
            wrapper.classList.add("searchWrapper");
            const icon = document.createElement("i");
            icon.setAttribute("class", setting.icon);
            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = setting.name;
            input.id = getElemId(setting.id);
            input.value = value;
            let old = input.value;
            input.addEventListener("change", ()=>{
                wrapper.dispatchEvent(new CustomEvent("onsettingchanged", {
                    detail: {
                        old: old,
                        new: input.value
                    }
                }));
                old = input.value;
            });
            wrapper.appendChild(icon);
            wrapper.appendChild(input);
            return wrapper;
        },
        setTitle: (elem, title)=>setContent(elem.querySelector("label"), title),
        setValue: (elem, val1)=>{
            const input = elem?.getElementsByTagName("input");
            if (input && input.length > 0) input[0].value = val1;
        }
    },
    {
        type: "range",
        callback: (setting, value)=>{
            const wrapper = document.createElement("div");
            wrapper.classList.add("rangeWrapper");
            const label = document.createElement("label");
            fillLabel(setting, label);
            if (setting.displayLabel != false) wrapper.appendChild(label);
            const container = document.createElement("div");
            container.classList.add("rangeInputs");
            wrapper.appendChild(container);
            const sliderBackground = document.createElement("div");
            sliderBackground.classList.add("sliderBackground");
            container.appendChild(sliderBackground);
            const sliderDiv = document.createElement("div");
            sliderDiv.classList.add("rangeSlider");
            sliderBackground.appendChild(sliderDiv);
            let min;
            let max;
            function sliderCallback() {
                if (!setting.baseName) setting.baseName = setting.name;
                const minVal = parseInt(min.value);
                const maxVal = parseInt(max.value);
                const n = `${setting.baseName} [${minVal} - ${maxVal}]`;
                setting.name = n;
                setContent(label, n);
                const left = (minVal - setting.minValue) / (min.max - setting.minValue) * 100;
                const right = 100 - (maxVal - setting.minValue) / (max.max - setting.minValue) * 100;
                sliderDiv.style.left = `${left}%`;
                sliderDiv.style.right = `${right}%`;
            }
            function createSlider(_class, val1, label = null) {
                if (!label) label = val1;
                const slider = document.createElement("input");
                slider.setAttribute("aria-label", label);
                slider.type = "range";
                slider.classList.add(_class);
                slider.min = setting.minValue ?? 0;
                slider.max = setting.maxValue ?? 10;
                slider.step = setting.step ?? 1;
                slider.value = value[val1];
                let old = value;
                slider.addEventListener("input", ()=>{
                    sliderCallback();
                    wrapper.dispatchEvent(new CustomEvent("onsettingchanged", {
                        detail: {
                            old: old,
                            new: {
                                min: parseInt(min.value),
                                max: parseInt(max.value)
                            }
                        }
                    }));
                    old = {
                        min: parseInt(min.value),
                        max: parseInt(max.value)
                    };
                });
                return slider;
            }
            min = createSlider("minRange", "min", "Minimum Value");
            max = createSlider("maxRange", "max", "Maximum Value");
            container.appendChild(min);
            container.appendChild(max);
            sliderCallback();
            return wrapper;
        },
        setTitle: (elem, title)=>setContent(elem.querySelector("label"), title),
        setValue: (elem, val1, setting)=>{
            if (val1.min && val1.max) {
                const sliderDiv = elem?.querySelector(".rangeSlider");
                const minInput = elem?.getElementsByClassName("minRange");
                if (minInput && minInput.length > 0) minInput[0].value = val1.min;
                else return;
                const maxInput = elem?.getElementsByClassName("maxRange");
                if (maxInput && maxInput.length > 0) maxInput[0].value = val1.max;
                else return;
                if (!setting.baseName) setting.baseName = setting.name;
                const n = `${setting.baseName} [${val1.min} - ${val1.max}]`;
                setting.name = n;
                setSettingsTitle(setting.id, n);
                const left = (val1.min - setting.minValue) / (minInput[0].max - setting.minValue) * 100;
                const right = 100 - (val1.max - setting.minValue) / (maxInput[0].max - setting.minValue) * 100;
                sliderDiv.style.left = `${left}%`;
                sliderDiv.style.right = `${right}%`;
            }
        }
    }
];
// Sort Order
// 1 - Descending
// 2 - Ascending
const categorySorts = [
    {
        name: "alphabetical",
        callback: (_settings, order)=>{
            _settings.sort((a, b)=>(settings[a].baseName ?? settings[a].name).toLowerCase().localeCompare((settings[b].baseName ?? settings[b].name).toLowerCase()));
            if (order == 2) _settings.reverse();
            return _settings;
        }
    },
    {
        name: "filterTotalCount",
        callback: (_settings, order)=>{
            _settings.sort((a, b)=>parseInt(settings[b].totalCount ?? 0) - parseInt(settings[a].totalCount ?? 0));
            if (order == 2) _settings.reverse();
            return _settings;
        }
    },
    {
        name: "filterCurrentCount",
        callback: (_settings, order)=>{
            _settings.sort((a, b)=>parseInt(settings[b].currCount ?? 0) - parseInt(settings[a].currCount ?? 0));
            if (order == 2) _settings.reverse();
            return _settings;
        }
    }
];
let settingsValues = [];
let eventListeners = [];
let friendsLobbies = [];
function createToolTip(e, content, placement = "top", maxWidth = 350) {
    if (e._tippy) e._tippy.setProps({
        content: content
    });
    e._tippy = (0, _tippyJsDefault.default)(e, {
        content: content,
        animation: "scale",
        appendTo: "parent",
        interactive: true,
        placement: placement,
        allowHTML: true,
        maxWidth: maxWidth,
        theme: "website"
    });
}
function notice(div, title, description, icon = "fas fa-xmark", colorVariable = "--flb-gray-color") {
    const notices = div.getElementsByClassName("notice");
    if (notices && notices.length > 0) for (const n of notices)n.remove();
    const toCopy = document.getElementById("noticeToCopy");
    const notice1 = toCopy.cloneNode(true);
    notice1.removeAttribute("id");
    const _icon = notice1.getElementsByClassName("noticeIcon")[0];
    const _title = notice1.getElementsByClassName("noticeTitle")[0];
    const _description = notice1.getElementsByClassName("noticeDescription")[0];
    const classes = icon.split(" ");
    classes.forEach((x)=>_icon.classList.add(x));
    _title.textContent = title;
    _description.textContent = description;
    notice1.style.color = `var(${colorVariable})`;
    div.appendChild(notice1);
}
function joinInfo(btn) {
    createToolTip(btn, 'To join, you must have the <a class="modLink" href="https://github.com/FusionLobbyBrowser/Mod/releases/latest" target="_blank" rel="noopener noreferrer">mod</a> (>= 1.1.0 version) installed and have launched the game at least once since installation');
}
const URI_JOIN = "flb-bridge://join/[data]";
async function requestJoin(code, platform) {
    const mapped = new Map((0, _constJs.layers));
    const layer = mapped.get(platform);
    if (!layer) {
        console.error("An unmapped layer found, cannot join");
        return;
    }
    try {
        let encoded = btoa(JSON.stringify({
            code: code,
            layer: layer
        }));
        encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/\=+$/, "");
        window.location.replace(URI_JOIN.replace("[data]", encoded));
    } catch (ex) {
        console.error(ex);
    }
}
function setFriendsInLobby(friends) {
    friendsLobbies = friends;
    const order = [
        6,
        1,
        4,
        2,
        3,
        0,
        5
    ];
    const onlyInLobby = getSettingValue("displayInLobby");
    let anyVisible = false;
    friendListElem.childNodes.forEach((x)=>{
        const friend = friends.find((y)=>y.id == x.getAttribute("steamid"));
        const additionalInfo = x.getElementsByClassName("steamAdditionalInfo")[0];
        const avatar = x.getElementsByClassName("friendAvatar")[0];
        const btnContainer = x.getElementsByClassName("buttonContainer")[0];
        let userStatus = -1;
        if (friend) {
            x.style.order = 0;
            additionalInfo.style.color = window.getComputedStyle(x).getPropertyValue(`--flb-status6-color`);
            userStatus = 6;
            additionalInfo.innerHTML = `Playing in a lobby - ${friend.lobbyName}`;
            btnContainer.classList.remove("hidden");
            const joinBtn = x.getElementsByClassName("joinButton")[0];
            joinInfo(joinBtn);
            joinBtn.onclick = async ()=>await requestJoin(friend.lobbyCode, friend.lobbyPlatform);
            const infoBtn = x.getElementsByClassName("infoButton")[0];
            infoBtn.onclick = ()=>window.dispatchEvent(new CustomEvent("displayInfo", {
                    detail: {
                        lobbyID: friend.lobbyID
                    }
                }));
            friendsAnyDisplayed = true;
            anyVisible = true;
        } else if (x.hasAttribute("overridenInfo")) {
            userStatus = Number(x.getAttribute("userStatus"));
            additionalInfo.style.color = `var(--flb-status${userStatus}-color)`;
            x.style.order = order.findIndex((y)=>y == userStatus) + 1;
            additionalInfo.textContent = x.getAttribute("infoText");
            btnContainer.classList.add("hidden");
        }
        if (userStatus != -1) {
            if (userStatus == 0 || onlyInLobby && !friend) {
                x.classList.add("hidden");
                avatar.loading = "lazy";
                avatar.fetchpriority = "low";
            } else {
                x.classList.remove("hidden");
                avatar.loading = "eager";
                avatar.fetchpriority = "auto";
                const notices = friendListElem.getElementsByClassName("notice");
                if (notices && notices.length > 0) for (const n of notices)n.remove();
            }
        }
    });
    friendListElem.childNodes.forEach((x)=>{
        if (!x.classList.contains("hidden")) anyVisible = true;
    });
    if (!anyVisible && friends && friends.length > 0) {
        const notices = friendListElem.getElementsByClassName("notice");
        if (notices && notices.length > 0) for (const n of notices)n.remove();
        notice(friendListElem, "Nobody's there", onlyInLobby ? "Seems like nobody's playing BONELAB right now" : "Seems like nobody's playing anything right now", "fas fa-face-frown");
    }
}
function setOption(option, id, name, icon) {
    option.setAttribute("value", id ?? name);
    if (icon) {
        option.appendChild(getIconElem(icon));
        const content = document.createElement("span");
        content.classList.add("elemContent");
        content.textContent = name;
        option.appendChild(content);
    } else option.textContent = name;
}
function isString(val1) {
    return typeof val1 === "string" || val1 instanceof String;
}
function getIconElem(icon) {
    if (icon.startsWith("img:")) {
        const img = document.createElement("i");
        img.classList.add("gamemodeIcon");
        img.style.backgroundImage = `url(${icon.substring(4, icon.length)})`;
        return img;
    } else {
        const _icon = document.createElement("i");
        _icon.setAttribute("class", `textIcon ${icon}`);
        return _icon;
    }
}
function fillLabel(setting, elem) {
    if (setting.icon) elem.appendChild(getIconElem(setting.icon));
    const content = document.createElement("span");
    content.classList.add("elemContent");
    content.textContent = setting.name;
    elem.appendChild(content);
    if (setting.tooltip) {
        const tooltipIcon = document.createElement("i");
        tooltipIcon.classList.add("fas");
        tooltipIcon.classList.add("fa-circle-info");
        tooltipIcon.classList.add("tooltipIcon");
        createToolTip(tooltipIcon, setting.tooltip);
        elem.appendChild(tooltipIcon);
    }
}
function containsWord(lobby, array) {
    if (!lobby || !lobby.lobbyName || lobby.lobbyName == "") return false;
    const iName = (0, _unityRichTextJs.Converter).removeRichText(lobby.lobbyName);
    for (const s of array)if (s && s != "") {
        let match = s;
        let regex = null;
        if (!isString(s)) {
            match = s.word;
            if (s.type == "whole-word") regex = new RegExp(`\\b${RegExp.escape(match)}\\b`, "mi");
        }
        if (regex == null) regex = new RegExp(RegExp.escape(match), "mi");
        if (regex.test(iName)) return true;
    }
    /*
  const words = removeSymbols(iName).split(" ");
  for (const s of array) {
    if (!s) return;

    if (!s.includes(" ")) {
      for (const w of words) {
        if (w.toLowerCase() == removeSymbols(s).toLowerCase()) return true;
      }
    } else {
      if (removeSymbols(iName).toLowerCase().trim().includes(s.toLowerCase()))
        return true;
    }
  }
    */ return false;
}
function removeSymbols(text) {
    return text.replace(/[^a-zA-Z0-9]/gm, " ");
}
function createCategory(category) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("collapsable");
    wrapper.classList.add("settingsCategory");
    wrapper.setAttribute("id", getCategoryId(category));
    const button = document.createElement("button");
    button.classList.add("textButton");
    if (category.expanded) button.classList.add("collapsed");
    button.addEventListener("click", ()=>{
        button.classList.toggle("collapsed");
        category.expanded = !category.expanded;
    });
    const title = document.createElement("h3");
    title.innerHTML = getCategoryText(category);
    const div = document.createElement("div");
    wrapper.appendChild(button);
    button.appendChild(title);
    wrapper.appendChild(div);
    return wrapper;
}
function setContent(elem, content) {
    const contents = elem.getElementsByClassName("elemContent");
    if (contents && contents.length > 0) {
        const span = contents[0];
        if (span) {
            span.textContent = content;
            return;
        }
    }
    elem.textContent = content;
}
function init() {
    const settingsList = document.getElementById("settingsList");
    settingsList.replaceChildren();
    categories.forEach(setupCategory);
    initialized = true;
}
function setupCategory(val1) {
    const settingsList = document.getElementById("settingsList");
    const cat = createCategory(val1);
    settingsList.appendChild(cat);
    if (!val1.customHandler) fillCategory(val1);
    else val1.customHandler(cat);
}
function fillCategory(val1) {
    let index = [];
    settings.forEach((x, i)=>{
        if (x.category == val1.name) index.push(i);
    });
    if (val1.sort && val1.sortMode) {
        const order = categorySorts.find((x)=>x.name.toLowerCase() == val1.sortMode.toLowerCase());
        if (order) index = order.callback(index, val1.sortOrder);
    }
    for (const i of index){
        const val1 = settings[i];
        createSetting(val1);
    }
}
function createSetting(val1) {
    const settingsList = document.getElementById("settingsList");
    const type = types.find((t)=>t.type == val1.type);
    if (type == null) {
        console.warn(`Setting '${val1.id}' has unknown type: ${val1.type}`);
        return;
    }
    const saved = localStorage.getItem(getElemId(val1.id));
    let _val;
    if (saved != null && saved != undefined) try {
        if (!type.overrideCached) _val = val1.storeAsJSON ? JSON.parse(saved) : saved;
        else _val = type.overrideCached(saved);
    } catch (ex) {
        console.error("Failed to load value from storage, fallback to default (the stored one will be overwritten!)");
        console.error(ex);
        _val = val1.defaultValue;
    }
    else if (typeof val1.defaultValue == "function") _val = val1.defaultValue();
    else _val = val1.defaultValue;
    if (!val1.initialValueSet) {
        setSetting(val1.id, _val);
        val1.initialValueSet = true;
    }
    const category = settingsList.querySelector(`#${getCategoryId(categories.find((x)=>x.name == val1.category))}`)?.getElementsByTagName("div")[0];
    if (category == null) {
        console.warn(`Setting '${val1.id}' has unknown category: ${val1.category}`);
        return;
    }
    const wrapper = type.callback(val1, _val);
    if (wrapper == null) {
        console.warn(`Empty wrapper for setting '${val1.id}'`);
        return;
    }
    if (getSettingValue("filterCount") == false && val1.baseName && val1.name != val1.baseName && val1.setFilterName != false) type.setTitle(wrapper, val1.baseName);
    val1.elem = wrapper;
    wrapper.addEventListener("onsettingchanged", (v)=>setSetting(val1.id, v.detail.new, v.detail.old));
    category.appendChild(wrapper);
}
function setSetting(setting, value, old = null) {
    let index = settingsValues.findIndex((x)=>x.id == setting);
    if (index == -1 || settingsValues[index].value != value) {
        const s = getSetting(setting);
        if (!s) return;
        if (s.saveToStorage != false) localStorage.setItem(getElemId(setting), s.storeAsJSON ? JSON.stringify(value) : value);
        if (index != -1) settingsValues[index].value = value;
        else settingsValues.push({
            id: setting,
            value: value
        });
        eventListeners.forEach((x)=>{
            if (x.id == setting) x.callback(value);
        });
        if (s.callback && s.initialValueSet) s.callback(value, old);
        const type = types.find((t)=>t.type == s.type);
        if (type && type.setValue) type.setValue(s.elem, value, s);
        window.dispatchEvent(new CustomEvent("onsettingchanged", {
            detail: {
                id: setting,
                old: old,
                new: value
            }
        }));
    }
}
function getSettingValue(setting) {
    let index = settingsValues.findIndex((x)=>x.id == setting);
    if (index != -1) return settingsValues[index].value;
    else return undefined;
}
function getSetting(setting) {
    let index = settings.findIndex((x)=>x.id == setting);
    if (index != -1) return settings[index];
    else return undefined;
}
function setSettingsTitle(setting, title) {
    let index = settings.findIndex((x)=>x.id == setting);
    if (index != -1) {
        const val1 = settings[index];
        if (!val1.elem) return;
        settings[index].name = title;
        const type = types.find((t)=>t.type == val1.type);
        if (type && type.setTitle) type.setTitle(val1.elem, title, val1);
    }
}
function addCategory(category) {
    if (!category || categories.find((x)=>x.name == category.name)) return;
    categories.push(category);
    if (initialized) setupCategory(category);
}
function removeCategory(categoryName) {
    if (!categoryName || !categories.find((x)=>x.name == categoryName)) return;
    categories = categories.filter((x)=>x.name != categoryName);
    const settingsList = document.getElementById("settingsList");
    const category = settingsList.querySelector(`#${getCategoryId(categories.find((x)=>x.name == val.category))}`);
    if (category == null) return;
    category.remove();
}
function addSetting(setting) {
    if (!setting || settings.find((x)=>x.id == setting.id)) return;
    settings.push(setting);
    if (initialized) createSetting(setting);
}
function removeSetting(settingId) {
    const s = settings.find((x)=>x.id == settingId);
    if (!settingId || !s) return;
    if (s.elem) s.elem.remove();
    settings = settings.filter((x)=>x.id != settingId);
}
function filterWithSettings(lobbies) {
    const constValue = structuredClone(lobbies);
    const includes = [];
    for (const setting of settings){
        if (!setting || !setting.lobbyFilter || setting.type != "filter") continue;
        if (!setting.filterWords && !setting.filterLevels && !setting.lobbyValidator) continue;
        const val1 = getSettingValue(setting.id);
        if (val1.include) includes.push(setting);
        else if (val1.exclude) lobbies = lobbies.filter((i)=>!meetsConditions(setting, i));
    }
    if (includes && includes.length > 0) lobbies = lobbies.filter((i)=>{
        let _return = false;
        for (const x of includes)if (meetsConditions(x, i)) {
            _return = true;
            break;
        }
        return _return;
    });
    for (const setting of settings){
        if (!setting || !setting.lobbyFilter) continue;
        if (!setting.filterWords && !setting.filterLevels && !setting.lobbyValidator) continue;
        let filter = false;
        if (setting.type == "filter" && getSettingValue(setting.id).include == true) continue;
        const val1 = getSettingValue(setting.id);
        if (typeof setting.filterValue == "function") filter = setting.filterValue(setting, val1);
        else filter = setting.filterValue == val1;
        if (filter) lobbies = lobbies.filter((i)=>!meetsConditions(setting, i));
    }
    for (const setting of settings){
        if (!setting || !setting.lobbyFilter) continue;
        let total = 0;
        let curr = 0;
        if (!setting.filterWords && !setting.lobbyValidator) continue;
        if (setting.setFilterName != false) {
            constValue.forEach((element)=>{
                if (meetsConditions(setting, element)) total++;
            });
            lobbies.forEach((element)=>{
                if (meetsConditions(setting, element)) curr++;
            });
        }
        setting.totalCount = total;
        setting.currCount = curr;
        if (!setting.baseName) setting.baseName = setting.name;
        if (setting.setFilterName != false) {
            const name = `${setting.baseName} [${total == curr ? total : `${curr}/${total}`}]`;
            setting.name = name;
            if (getSettingValue("filterCount") == true) setSettingsTitle(setting.id, `${setting.baseName} [${total == curr ? total : `${curr}/${total}`}]`);
        }
    }
    return lobbies;
}
function meetsConditions(setting, i) {
    if (isString(setting)) setting = getSetting(setting);
    if (!setting) return true;
    let valid = false;
    if (setting.filterWords && containsWord(i, setting.filterWords)) valid = true;
    if (setting.lobbyValidator && setting.lobbyValidator(i, getSettingValue(setting.id))) valid = true;
    if (setting.filterLevels && setting.filterLevels.includes(i.levelBarcode)) valid = true;
    return valid;
}
function addEventListener(id, callback) {
    eventListeners.push({
        id: id,
        callback: callback
    });
}
function getElemId(setting) {
    return `setting_${setting}`;
}
function getCategoryText(category) {
    return `<i class="${category.icon} textIcon"></i>${category.name}`;
}
function getCategoryId(category) {
    return `category_${category?.name?.replace(" ", "")}`;
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./unityRichText.js":"3L0Tf","./const.js":"jw8vm","./steam.js":"7BUeb","tippy.js":"7X8ND","tippy.js/dist/tippy.css":"2hEyg","dompurify":"1IHUz","fuse.js":"kK0g7","/node_modules/flag-icons/css/flag-icons.min.css":"hRoQ7"}],"jw8vm":[function(require,module,exports,__globalThis) {
// Name is the name of the file in the /images/default folder
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "barcodes", ()=>barcodes);
parcelHelpers.export(exports, "limit", ()=>limit);
parcelHelpers.export(exports, "layers", ()=>layers);
parcelHelpers.export(exports, "permissions", ()=>permissions);
parcelHelpers.export(exports, "statuses", ()=>statuses);
parcelHelpers.export(exports, "gamemodes", ()=>gamemodes);
parcelHelpers.export(exports, "permsList", ()=>permsList);
const barcodes = [
    // Avatars
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Heavy",
        name: "Heavy"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Fast",
        name: "Fast"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.CharFurv4GB",
        name: "Short"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.CharTallv4",
        name: "Tall"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Strong",
        name: "Strong"
    },
    {
        barcode: "SLZ.BONELAB.Content.Avatar.Anime",
        name: "Light"
    },
    {
        barcode: "SLZ.BONELAB.Content.Avatar.CharJimmy",
        name: "Jay"
    },
    {
        barcode: "SLZ.BONELAB.Content.Avatar.FordBW",
        name: "Ford"
    },
    {
        barcode: "SLZ.BONELAB.Content.Avatar.CharFord",
        name: "Ford"
    },
    {
        barcode: "SLZ.BONELAB.Core.Avatar.PeasantFemaleA",
        name: "Peasant"
    },
    {
        barcode: "c3534c5a-10bf-48e9-beca-4ca850656173",
        name: "Peasant"
    },
    {
        barcode: "c3534c5a-2236-4ce5-9385-34a850656173",
        name: "Peasant"
    },
    {
        barcode: "c3534c5a-87a3-48b2-87cd-f0a850656173",
        name: "Peasant"
    },
    {
        barcode: "c3534c5a-f12c-44ef-b953-b8a850656173",
        name: "Peasant"
    },
    {
        barcode: "c3534c5a-3763-4ddf-bd86-6ca850656173",
        name: "Peasant"
    },
    {
        barcode: "SLZ.BONELAB.Content.Avatar.Nullbody",
        name: "Nullbody"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Avatar.Charskeleton",
        name: "Skeleton"
    },
    {
        barcode: "c3534c5a-d388-4945-b4ff-9c7a53656375",
        name: "Security Guard"
    },
    {
        barcode: "c3534c5a-94b2-40a4-912a-24a8506f6c79",
        name: "PolyBlank"
    },
    // Maps
    {
        barcode: "c2534c5a-80e1-4a29-93ca-f3254d656e75",
        name: "Main Menu"
    },
    {
        barcode: "c2534c5a-4197-4879-8cd3-4a695363656e",
        name: "Descent"
    },
    {
        barcode: "c2534c5a-6b79-40ec-8e98-e58c5363656e",
        name: "BONELAB Hub"
    },
    {
        barcode: "c2534c5a-56a6-40ab-a8ce-23074c657665",
        name: "LongRun"
    },
    {
        barcode: "c2534c5a-54df-470b-baaf-741f4c657665",
        name: "Mine Dive"
    },
    {
        barcode: "c2534c5a-7601-4443-bdfe-7f235363656e",
        name: "Big Anomaly"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.LevelStreetPunch",
        name: "Street Puncher"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.SprintBridge04",
        name: "Sprint Bridge"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.SceneMagmaGate",
        name: "Magma Gate"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.MoonBase",
        name: "Moon Base"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.LevelKartRace",
        name: "Monogon Motorway"
    },
    {
        barcode: "c2534c5a-c056-4883-ac79-e051426f6964",
        name: "Pillar Climb"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.LevelBigAnomalyB",
        name: "Big Anomaly B"
    },
    {
        barcode: "c2534c5a-db71-49cf-b694-24584c657665",
        name: "Ascent"
    },
    {
        barcode: "fa534c5a868247138f50c62e424c4144.Level.VoidG114",
        name: "VoidG114"
    },
    {
        barcode: "c2534c5a-61b3-4f97-9059-79155363656e",
        name: "Baseline"
    },
    {
        barcode: "c2534c5a-2c4c-4b44-b076-203b5363656e",
        name: "Tuscany"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelMuseumBasement",
        name: "Museum Basement"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelHalfwayPark",
        name: "Halfway Park"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelGunRange",
        name: "Gun Range"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelHoloChamber",
        name: "HoloChamber"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.LevelKartBowling",
        name: "Big Bone Bowling"
    },
    {
        barcode: "SLZ.BONELAB.Content.Level.LevelMirror",
        name: "Mirror"
    },
    {
        barcode: "c2534c5a-4f3b-480e-ad2f-69175363656e",
        name: "Neon District Tac Trial"
    },
    {
        barcode: "c2534c5a-de61-4df9-8f6c-416954726547",
        name: "Drop Pit"
    },
    {
        barcode: "c2534c5a-c180-40e0-b2b7-325c5363656e",
        name: "Tunnel Tipper"
    },
    {
        barcode: "fa534c5a868247138f50c62e424c4144.Level.LevelArenaMin",
        name: "Fantasy Arena"
    },
    {
        barcode: "c2534c5a-162f-4661-a04d-975d5363656e",
        name: "Container Yard"
    },
    {
        barcode: "c2534c5a-5c2f-4eef-a851-66214c657665",
        name: "Dungeon Warrior"
    },
    {
        barcode: "c2534c5a-c6ac-48b4-9c5f-b5cd5363656e",
        name: "Rooftops"
    },
    {
        barcode: "fa534c5a83ee4ec6bd641fec424c4142.Level.SceneparkourDistrictLogic",
        name: "Neon District Parkour"
    }
];
const limit = [
    [
        "Steam",
        50
    ],
    [
        "Epic",
        200
    ]
];
const layers = [
    [
        "Steam",
        "SteamVR"
    ],
    [
        "Epic",
        "Epic Online Services"
    ]
];
const permissions = [
    [
        -1,
        "guest"
    ],
    [
        0,
        "default"
    ],
    [
        1,
        "operator"
    ],
    [
        2,
        "owner"
    ]
];
const statuses = [
    [
        0,
        "Offline"
    ],
    [
        1,
        "Online"
    ],
    [
        2,
        "Busy"
    ],
    [
        3,
        "Away"
    ],
    [
        4,
        "Snooze / AFK"
    ],
    [
        5,
        "Unknown"
    ],
    [
        6,
        "In Game"
    ]
];
const gamemodes = [
    {
        title: "Sandbox",
        barcode: "",
        icon: "img:./images/gamemodes/Sandbox.png"
    },
    {
        title: "Deathmatch",
        barcode: "Lakatrazz.Deathmatch",
        icon: "img:./images/gamemodes/Deathmatch.png"
    },
    {
        title: "Team Deathmatch",
        barcode: "Lakatrazz.Team Deathmatch",
        icon: "img:./images/gamemodes/TeamDeathmatch.png"
    },
    {
        title: "Smash Bones",
        barcode: "Lakatrazz.Smash Bones",
        icon: "img:./images/gamemodes/SmashBones.png"
    },
    {
        title: "Juggernaut",
        barcode: "Lakatrazz.Juggernaut",
        icon: "img:./images/gamemodes/Juggernaut.png"
    },
    {
        title: "Hide & Seek",
        barcode: "Lakatrazz.Hide And Seek",
        icon: "img:./images/gamemodes/HideAndSeek.png"
    },
    {
        title: "Entangled",
        barcode: "Lakatrazz.Entangled",
        icon: "img:./images/gamemodes/Entangled.png"
    },
    {
        title: "Avatar Infection",
        barcode: "HAHOOS.Avatar Infection",
        icon: "img:./images/gamemodes/AvatarInfection.png",
        link: "https://thunderstore.io/c/bonelab/p/HAHOOS/AvatarInfection/"
    },
    {
        title: "Bone Strike",
        barcode: "Mash.Bone Strike",
        icon: "img:./images/gamemodes/BoneStrike.png",
        link: "https://thunderstore.io/c/bonelab/p/Mash/BoneStrike/"
    },
    {
        title: "Trouble In Ford Town",
        barcode: "JonLandonMods.TroubleInFordTown",
        icon: "fa-brands fa-redhat",
        link: "https://thunderstore.io/c/bonelab/p/JonLandonMods/TroubleInFordTown"
    },
    {
        title: "Ford Royale",
        barcode: "JonLandonMods.Ford Royale",
        icon: "fa-solid fa-umbrella",
        link: "https://thunderstore.io/c/bonelab/p/JonLandonMods/FordRoyale/"
    },
    {
        title: "DayZ Survival",
        barcode: "Codex.DayZFusionSurvival",
        icon: "fa-solid fa-suitcase-medical",
        link: "https://thunderstore.io/c/bonelab/p/ChappieStudios/DayZFusionSurvival/"
    }
];
const permsList = [
    {
        entry: "teleportation",
        name: "Teleportation",
        icon: "fas fa-person-falling"
    },
    {
        entry: "banning",
        name: "Banning",
        icon: "fas fa-ban"
    },
    {
        entry: "kicking",
        name: "Kicking",
        icon: "fas fa-gavel"
    },
    {
        entry: "customAvatars",
        name: "Custom Avatars",
        icon: "fas fa-shirt"
    },
    {
        entry: "constrainer",
        name: "Constrainer",
        icon: "fas fa-link"
    },
    {
        entry: "devTools",
        name: "Developer Tools",
        icon: "fas fa-code"
    }
];

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"7BUeb":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "getSelf", ()=>getSelf);
parcelHelpers.export(exports, "getProfile", ()=>getProfile);
parcelHelpers.export(exports, "getFriends", ()=>getFriends);
var _tippyJs = require("tippy.js");
var _tippyJsDefault = parcelHelpers.interopDefault(_tippyJs);
var _tippyCss = require("tippy.js/dist/tippy.css");
let HOST = "https://fusionapi.hahoos.dev/"; // https://localhost:7073/
const STEAM = "[host]steam/";
const ME = `${STEAM}me`;
const PROFILE = `${STEAM}profile/[id]`;
const FRIENDS = `${STEAM}friends/`; // ID needs to be the same as logged in user
if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);
async function init() {
    if (window.location.hostname == "hoodrp.com" || window.location.hostname == "www.hoodrp.com") HOST = "https://api.hoodrp.com/";
    else if (window.location.hostname == "localhost:5500" || window.location.hostname == "localhost") HOST = "https://localhost:7073/";
    const container = document.getElementById("steamAccount");
    const redirect = document.getElementById("steamRedirect");
    const account = container.getElementsByClassName("steamAccount")[0];
    const self = await getSelf();
    if (!self) {
        account.classList.add("hidden");
        redirect.classList.remove("hidden");
        redirect.href = `${HOST}steam/login?redirectUrl=${window.location.href}`;
    } else {
        account.classList.remove("hidden");
        redirect.classList.add("hidden");
        account.getElementsByClassName("steamSmall")[0].setAttribute("src", self.avatarUrl);
        account.getElementsByClassName("steamName")[0].getElementsByClassName("elemContent")[0].textContent = self.nickname;
        (0, _tippyJsDefault.default)(account, {
            content: `<a class="logout" href="${HOST}steam/logout?redirectUrl=${window.location.href}" rel="noopener noreferrer">Logout</a>`,
            animation: "scale",
            appendTo: "parent",
            interactive: true,
            allowHTML: true,
            theme: "website-background",
            placement: "bottom",
            trigger: "click"
        });
    }
}
async function getSelf() {
    try {
        const res = await fetch(ME.replace("[host]", HOST), {
            credentials: "include"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (ex) {
        console.error(ex);
        return null;
    }
}
async function getProfile(id) {
    try {
        const res = await fetch(PROFILE.replace("[host]", HOST).replace("[id]", id), {
            credentials: "include"
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (ex) {
        console.error(ex);
        return null;
    }
}
async function getFriends() {
    try {
        const res = await fetch(FRIENDS.replace("[host]", HOST), {
            credentials: "include"
        });
        if (res.status == 401) return false;
        if (!res.ok) return null;
        return await res.json();
    } catch (ex) {
        console.error(ex);
        return null;
    }
}

},{"tippy.js":"7X8ND","tippy.js/dist/tippy.css":"2hEyg","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2hEyg":[function() {},{}],"2hEyg":[function() {},{}],"kK0g7":[function(require,module,exports,__globalThis) {
/**
 * Fuse.js v7.5.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2026 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */ //#region src/helpers/typeGuards.ts
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
//#endregion
parcelHelpers.export(exports, "default", ()=>entry_default);
function isArray(value) {
    return !Array.isArray ? getTag(value) === "[object Array]" : Array.isArray(value);
}
function baseToString(value) {
    if (typeof value == "string") return value;
    if (typeof value === "bigint") return value.toString();
    const result = value + "";
    return result == "0" && 1 / value == -Infinity ? "-0" : result;
}
function toString(value) {
    return value == null ? "" : baseToString(value);
}
function isString(value) {
    return typeof value === "string";
}
function isNumber(value) {
    return typeof value === "number";
}
function isBoolean(value) {
    return value === true || value === false || isObjectLike(value) && getTag(value) == "[object Boolean]";
}
function isObject(value) {
    return typeof value === "object";
}
function isObjectLike(value) {
    return isObject(value) && value !== null;
}
function isDefined(value) {
    return value !== void 0 && value !== null;
}
function isBlank(value) {
    return !value.trim().length;
}
function getTag(value) {
    return value == null ? value === void 0 ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(value);
}
//#endregion
//#region src/core/errorMessages.ts
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const INVALID_DOC_INDEX = "Invalid doc index: must be a non-negative integer within the bounds of the docs array";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key)=>`Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = (max)=>`Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = (name)=>`Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = (key)=>`Property 'weight' in key '${key}' must be a positive integer`;
const FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED = "Fuse.match does not support useTokenSearch: token search requires corpus-level statistics (df, fieldCount) that a one-off string comparison does not have. Use new Fuse(...).search(...) instead.";
//#endregion
//#region src/tools/KeyStore.ts
const hasOwn = Object.prototype.hasOwnProperty;
var KeyStore = class {
    constructor(keys){
        this._keys = [];
        this._keyMap = {};
        let totalWeight = 0;
        keys.forEach((key)=>{
            const obj = createKey(key);
            this._keys.push(obj);
            this._keyMap[obj.id] = obj;
            totalWeight += obj.weight;
        });
        this._keys.forEach((key)=>{
            key.weight /= totalWeight;
        });
    }
    get(keyId) {
        return this._keyMap[keyId];
    }
    keys() {
        return this._keys;
    }
    toJSON() {
        return JSON.stringify(this._keys);
    }
};
function createKey(key) {
    let path = null;
    let id = null;
    let src = null;
    let weight = 1;
    let getFn = null;
    if (isString(key) || isArray(key)) {
        src = key;
        path = createKeyPath(key);
        id = createKeyId(key);
    } else {
        if (!hasOwn.call(key, "name")) throw new Error(MISSING_KEY_PROPERTY("name"));
        const name = key.name;
        src = name;
        if (hasOwn.call(key, "weight") && key.weight !== void 0) {
            weight = key.weight;
            if (weight <= 0) throw new Error(INVALID_KEY_WEIGHT_VALUE(createKeyId(name)));
        }
        path = createKeyPath(name);
        id = createKeyId(name);
        getFn = key.getFn ?? null;
    }
    return {
        path,
        id,
        weight,
        src,
        getFn
    };
}
function createKeyPath(key) {
    return isArray(key) ? key : key.split(".");
}
function createKeyId(key) {
    return isArray(key) ? key.join(".") : key;
}
//#endregion
//#region src/helpers/get.ts
function get(obj, path) {
    const list = [];
    let arr = false;
    const deepGet = (obj, path, index, arrayIndex)=>{
        if (!isDefined(obj)) return;
        if (!path[index]) list.push(arrayIndex !== void 0 ? {
            v: obj,
            i: arrayIndex
        } : obj);
        else {
            const value = obj[path[index]];
            if (!isDefined(value)) return;
            if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value) || typeof value === "bigint")) list.push(arrayIndex !== void 0 ? {
                v: toString(value),
                i: arrayIndex
            } : toString(value));
            else if (isArray(value)) {
                arr = true;
                for(let i = 0, len = value.length; i < len; i += 1)deepGet(value[i], path, index + 1, i);
            } else if (path.length) deepGet(value, path, index + 1, arrayIndex);
        }
    };
    deepGet(obj, isString(path) ? path.split(".") : path, 0);
    return arr ? list : list[0];
}
//#endregion
//#region src/core/config.ts
const MatchOptions = {
    includeMatches: false,
    findAllMatches: false,
    minMatchCharLength: 1
};
const BasicOptions = {
    isCaseSensitive: false,
    ignoreDiacritics: false,
    includeScore: false,
    keys: [],
    shouldSort: true,
    sortFn: (a, b)=>a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
    location: 0,
    threshold: .6,
    distance: 100
};
const AdvancedOptions = {
    useExtendedSearch: false,
    useTokenSearch: false,
    tokenize: void 0,
    tokenMatch: "any",
    getFn: get,
    ignoreLocation: false,
    ignoreFieldNorm: false,
    fieldNormWeight: 1
};
const Config = Object.freeze({
    ...BasicOptions,
    ...MatchOptions,
    ...FuzzyOptions,
    ...AdvancedOptions
});
//#endregion
//#region src/tools/fieldNorm.ts
function isWordSeparator(code) {
    return code >= 9 && code <= 13 || code === 32 || code === 160;
}
function norm(weight = 1, mantissa = 3) {
    const cache = /* @__PURE__ */ new Map();
    const m = Math.pow(10, mantissa);
    return {
        get (value) {
            let numTokens = 0;
            let inWord = false;
            for(let i = 0; i < value.length; i++)if (!isWordSeparator(value.charCodeAt(i))) {
                if (!inWord) {
                    numTokens++;
                    inWord = true;
                }
            } else inWord = false;
            if (numTokens === 0) numTokens = 1;
            if (cache.has(numTokens)) return cache.get(numTokens);
            const n = Math.round(m / Math.pow(numTokens, .5 * weight)) / m;
            cache.set(numTokens, n);
            return n;
        },
        clear () {
            cache.clear();
        }
    };
}
//#endregion
//#region src/tools/FuseIndex.ts
var FuseIndex = class {
    constructor({ getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}){
        this.norm = norm(fieldNormWeight, 3);
        this.getFn = getFn;
        this.isCreated = false;
        this.docs = [];
        this.keys = [];
        this._keysMap = {};
        this.setIndexRecords();
    }
    setSources(docs = []) {
        this.docs = docs;
    }
    setIndexRecords(records = []) {
        this.records = records;
    }
    setKeys(keys = []) {
        this.keys = keys;
        this._keysMap = {};
        keys.forEach((key, idx)=>{
            this._keysMap[key.id] = idx;
        });
    }
    create() {
        if (this.isCreated || !this.docs.length) return;
        this.isCreated = true;
        const len = this.docs.length;
        this.records = new Array(len);
        let recordCount = 0;
        if (isString(this.docs[0])) for(let i = 0; i < len; i++){
            const record = this._createStringRecord(this.docs[i], i);
            if (record) this.records[recordCount++] = record;
        }
        else for(let i = 0; i < len; i++)this.records[recordCount++] = this._createObjectRecord(this.docs[i], i);
        this.records.length = recordCount;
        this.norm.clear();
    }
    add(doc, docIndex) {
        if (!Number.isInteger(docIndex) || docIndex < 0) throw new Error(INVALID_DOC_INDEX);
        if (isString(doc)) {
            const record = this._createStringRecord(doc, docIndex);
            if (record) this.records.push(record);
            return record;
        }
        const record = this._createObjectRecord(doc, docIndex);
        this.records.push(record);
        return record;
    }
    removeAt(idx) {
        if (!Number.isInteger(idx) || idx < 0) throw new Error(INVALID_DOC_INDEX);
        for(let i = 0, len = this.records.length; i < len; i += 1)if (this.records[i].i === idx) {
            this.records.splice(i, 1);
            break;
        }
        for(let i = 0, len = this.records.length; i < len; i += 1)if (this.records[i].i > idx) this.records[i].i -= 1;
    }
    removeAll(indices) {
        const toRemove = /* @__PURE__ */ new Set();
        for (const v of indices)if (Number.isInteger(v) && v >= 0) toRemove.add(v);
        if (toRemove.size === 0) return;
        this.records = this.records.filter((r)=>!toRemove.has(r.i));
        const sorted = Array.from(toRemove).sort((a, b)=>a - b);
        for (const record of this.records){
            let lo = 0;
            let hi = sorted.length;
            while(lo < hi){
                const mid = lo + hi >>> 1;
                if (sorted[mid] < record.i) lo = mid + 1;
                else hi = mid;
            }
            record.i -= lo;
        }
    }
    getValueForItemAtKeyId(item, keyId) {
        return item[this._keysMap[keyId]];
    }
    size() {
        return this.records.length;
    }
    _createStringRecord(doc, docIndex) {
        if (!isDefined(doc) || isBlank(doc)) return null;
        return {
            v: doc,
            i: docIndex,
            n: this.norm.get(doc)
        };
    }
    _createObjectRecord(doc, docIndex) {
        const record = {
            i: docIndex,
            $: {}
        };
        for(let keyIndex = 0, keyLen = this.keys.length; keyIndex < keyLen; keyIndex++){
            const key = this.keys[keyIndex];
            const value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
            if (!isDefined(value)) continue;
            if (isArray(value)) {
                const subRecords = [];
                for(let i = 0, len = value.length; i < len; i += 1){
                    const item = value[i];
                    if (!isDefined(item)) continue;
                    if (isString(item)) {
                        if (!isBlank(item)) {
                            const subRecord = {
                                v: item,
                                i,
                                n: this.norm.get(item)
                            };
                            subRecords.push(subRecord);
                        }
                    } else if (isDefined(item.v)) {
                        const text = isString(item.v) ? item.v : toString(item.v);
                        if (!isBlank(text)) {
                            const subRecord = {
                                v: text,
                                i: item.i,
                                n: this.norm.get(text)
                            };
                            subRecords.push(subRecord);
                        }
                    }
                }
                record.$[keyIndex] = subRecords;
            } else if (isString(value) && !isBlank(value)) {
                const subRecord = {
                    v: value,
                    n: this.norm.get(value)
                };
                record.$[keyIndex] = subRecord;
            }
        }
        return record;
    }
    toJSON() {
        return {
            keys: this.keys.map(({ getFn, ...key })=>key),
            records: this.records
        };
    }
};
function createIndex(keys, docs, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const myIndex = new FuseIndex({
        getFn,
        fieldNormWeight
    });
    myIndex.setKeys(keys.map(createKey));
    myIndex.setSources(docs);
    myIndex.create();
    return myIndex;
}
function parseIndex(data, { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}) {
    const { keys, records } = data;
    const myIndex = new FuseIndex({
        getFn,
        fieldNormWeight
    });
    myIndex.setKeys(keys);
    myIndex.setIndexRecords(records);
    return myIndex;
}
//#endregion
//#region src/search/bitap/convertMaskToIndices.ts
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
    const indices = [];
    let start = -1;
    let end = -1;
    let i = 0;
    for(let len = matchmask.length; i < len; i += 1){
        const match = matchmask[i];
        if (match && start === -1) start = i;
        else if (!match && start !== -1) {
            end = i - 1;
            if (end - start + 1 >= minMatchCharLength) indices.push([
                start,
                end
            ]);
            start = -1;
        }
    }
    if (matchmask[i - 1] && i - start >= minMatchCharLength) indices.push([
        start,
        i - 1
    ]);
    return indices;
}
//#endregion
//#region src/search/bitap/search.ts
function search(text, pattern, patternAlphabet, { location = Config.location, distance = Config.distance, threshold = Config.threshold, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, includeMatches = Config.includeMatches, ignoreLocation = Config.ignoreLocation } = {}) {
    if (pattern.length > 32) throw new Error(PATTERN_LENGTH_TOO_LARGE(32));
    const patternLen = pattern.length;
    const textLen = text.length;
    const expectedLocation = Math.max(0, Math.min(location, textLen));
    let currentThreshold = threshold;
    let bestLocation = expectedLocation;
    const calcScore = (errors, currentLocation)=>{
        const accuracy = errors / patternLen;
        if (ignoreLocation) return accuracy;
        const proximity = Math.abs(expectedLocation - currentLocation);
        if (!distance) return proximity ? 1 : accuracy;
        return accuracy + proximity / distance;
    };
    const computeMatches = minMatchCharLength > 1 || includeMatches;
    const matchMask = computeMatches ? Array(textLen) : [];
    let index;
    while((index = text.indexOf(pattern, bestLocation)) > -1){
        const score = calcScore(0, index);
        currentThreshold = Math.min(score, currentThreshold);
        bestLocation = index + patternLen;
        if (computeMatches) {
            let i = 0;
            while(i < patternLen){
                matchMask[index + i] = 1;
                i += 1;
            }
        }
    }
    bestLocation = -1;
    let lastBitArr = [];
    let finalScore = 1;
    let bestErrors = 0;
    let binMax = patternLen + textLen;
    const mask = 1 << patternLen - 1;
    for(let i = 0; i < patternLen; i += 1){
        let binMin = 0;
        let binMid = binMax;
        while(binMin < binMid){
            if (calcScore(i, expectedLocation + binMid) <= currentThreshold) binMin = binMid;
            else binMax = binMid;
            binMid = Math.floor((binMax - binMin) / 2 + binMin);
        }
        binMax = binMid;
        let start = Math.max(1, expectedLocation - binMid + 1);
        const finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;
        const bitArr = Array(finish + 2);
        bitArr[finish + 1] = (1 << i) - 1;
        for(let j = finish; j >= start; j -= 1){
            const currentLocation = j - 1;
            const charMatch = patternAlphabet[text[currentLocation]];
            bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;
            if (i) bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
            if (bitArr[j] & mask) {
                finalScore = calcScore(i, currentLocation);
                if (finalScore <= currentThreshold) {
                    currentThreshold = finalScore;
                    bestLocation = currentLocation;
                    bestErrors = i;
                    if (bestLocation <= expectedLocation) break;
                    start = Math.max(1, 2 * expectedLocation - bestLocation);
                }
            }
        }
        if (calcScore(i + 1, expectedLocation) > currentThreshold) break;
        lastBitArr = bitArr;
    }
    if (computeMatches && bestLocation >= 0) {
        const matchEnd = Math.min(textLen - 1, bestLocation + patternLen - 1 + bestErrors);
        for(let k = bestLocation; k <= matchEnd; k += 1)if (patternAlphabet[text[k]]) matchMask[k] = 1;
    }
    const result = {
        isMatch: bestLocation >= 0,
        score: Math.max(.001, finalScore)
    };
    if (computeMatches) {
        const indices = convertMaskToIndices(matchMask, minMatchCharLength);
        if (!indices.length) result.isMatch = false;
        else if (includeMatches) result.indices = indices;
    }
    return result;
}
//#endregion
//#region src/search/bitap/createPatternAlphabet.ts
function createPatternAlphabet(pattern) {
    const mask = {};
    for(let i = 0, len = pattern.length; i < len; i += 1){
        const char = pattern.charAt(i);
        mask[char] = (mask[char] || 0) | 1 << len - i - 1;
    }
    return mask;
}
//#endregion
//#region src/helpers/mergeIndices.ts
function mergeIndices(indices) {
    if (indices.length <= 1) return indices;
    indices.sort((a, b)=>a[0] - b[0] || a[1] - b[1]);
    const merged = [
        indices[0]
    ];
    for(let i = 1, len = indices.length; i < len; i += 1){
        const last = merged[merged.length - 1];
        const curr = indices[i];
        if (curr[0] <= last[1] + 1) last[1] = Math.max(last[1], curr[1]);
        else merged.push(curr);
    }
    return merged;
}
//#endregion
//#region src/helpers/diacritics.ts
const NON_DECOMPOSABLE_MAP = {
    "\u0142": "l",
    "\u0141": "L",
    "\u0111": "d",
    "\u0110": "D",
    "\xf8": "o",
    "\xd8": "O",
    "\u0127": "h",
    "\u0126": "H",
    "\u0167": "t",
    "\u0166": "T",
    "\u0131": "i",
    "\xdf": "ss"
};
const NON_DECOMPOSABLE_RE = new RegExp("[" + Object.keys(NON_DECOMPOSABLE_MAP).join("") + "]", "g");
const stripDiacritics = typeof String.prototype.normalize === "function" ? (str)=>str.normalize("NFD").replace(/[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F]/g, "").replace(NON_DECOMPOSABLE_RE, (ch)=>NON_DECOMPOSABLE_MAP[ch]) : (str)=>str;
//#endregion
//#region src/search/bitap/index.ts
var BitapSearch = class {
    constructor(pattern, { location = Config.location, threshold = Config.threshold, distance = Config.distance, includeMatches = Config.includeMatches, findAllMatches = Config.findAllMatches, minMatchCharLength = Config.minMatchCharLength, isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, ignoreLocation = Config.ignoreLocation } = {}){
        this.options = {
            location,
            threshold,
            distance,
            includeMatches,
            findAllMatches,
            minMatchCharLength,
            isCaseSensitive,
            ignoreDiacritics,
            ignoreLocation
        };
        pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
        this.pattern = pattern;
        this.chunks = [];
        if (!this.pattern.length) return;
        const addChunk = (pattern, startIndex)=>{
            this.chunks.push({
                pattern,
                alphabet: createPatternAlphabet(pattern),
                startIndex
            });
        };
        const len = this.pattern.length;
        if (len > 32) {
            let i = 0;
            const remainder = len % 32;
            const end = len - remainder;
            while(i < end){
                addChunk(this.pattern.substr(i, 32), i);
                i += 32;
            }
            if (remainder) {
                const startIndex = len - 32;
                addChunk(this.pattern.substr(startIndex), startIndex);
            }
        } else addChunk(this.pattern, 0);
    }
    searchIn(text) {
        const { isCaseSensitive, ignoreDiacritics, includeMatches } = this.options;
        text = isCaseSensitive ? text : text.toLowerCase();
        text = ignoreDiacritics ? stripDiacritics(text) : text;
        if (this.pattern === text) {
            if (text.length < this.options.minMatchCharLength) return {
                isMatch: false,
                score: 1
            };
            const result = {
                isMatch: true,
                score: 0
            };
            if (includeMatches) result.indices = [
                [
                    0,
                    text.length - 1
                ]
            ];
            return result;
        }
        const { location, distance, threshold, findAllMatches, minMatchCharLength, ignoreLocation } = this.options;
        const allIndices = [];
        let totalScore = 0;
        let hasMatches = false;
        this.chunks.forEach(({ pattern, alphabet, startIndex })=>{
            const { isMatch, score, indices } = search(text, pattern, alphabet, {
                location: location + startIndex,
                distance,
                threshold,
                findAllMatches,
                minMatchCharLength,
                includeMatches,
                ignoreLocation
            });
            if (isMatch) hasMatches = true;
            totalScore += score;
            if (isMatch && indices) allIndices.push(...indices);
        });
        const result = {
            isMatch: hasMatches,
            score: hasMatches ? totalScore / this.chunks.length : 1
        };
        if (hasMatches && includeMatches) result.indices = mergeIndices(allIndices);
        return result;
    }
};
//#endregion
//#region src/search/extended/matchers.ts
const MULTI_MATCH_TYPES = new Set([
    "fuzzy",
    "include"
]);
function isInverse(type) {
    return type.startsWith("inverse");
}
const matchers = [
    {
        type: "exact",
        multiRegex: /^="(.*)"$/,
        singleRegex: /^=(.*)$/,
        create: (pattern)=>({
                type: "exact",
                search (text) {
                    const isMatch = text === pattern;
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices: [
                            0,
                            pattern.length - 1
                        ]
                    };
                }
            })
    },
    {
        type: "include",
        multiRegex: /^'"(.*)"$/,
        singleRegex: /^'(.*)$/,
        create: (pattern)=>({
                type: "include",
                search (text) {
                    let location = 0;
                    let index;
                    const indices = [];
                    const patternLen = pattern.length;
                    while((index = text.indexOf(pattern, location)) > -1){
                        location = index + patternLen;
                        indices.push([
                            index,
                            location - 1
                        ]);
                    }
                    const isMatch = !!indices.length;
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices
                    };
                }
            })
    },
    {
        type: "prefix-exact",
        multiRegex: /^\^"(.*)"$/,
        singleRegex: /^\^(.*)$/,
        create: (pattern)=>({
                type: "prefix-exact",
                search (text) {
                    const isMatch = text.startsWith(pattern);
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices: [
                            0,
                            pattern.length - 1
                        ]
                    };
                }
            })
    },
    {
        type: "inverse-prefix-exact",
        multiRegex: /^!\^"(.*)"$/,
        singleRegex: /^!\^(.*)$/,
        create: (pattern)=>({
                type: "inverse-prefix-exact",
                search (text) {
                    const isMatch = !text.startsWith(pattern);
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices: [
                            0,
                            text.length - 1
                        ]
                    };
                }
            })
    },
    {
        type: "inverse-suffix-exact",
        multiRegex: /^!"(.*)"\$$/,
        singleRegex: /^!(.*)\$$/,
        create: (pattern)=>({
                type: "inverse-suffix-exact",
                search (text) {
                    const isMatch = !text.endsWith(pattern);
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices: [
                            0,
                            text.length - 1
                        ]
                    };
                }
            })
    },
    {
        type: "suffix-exact",
        multiRegex: /^"(.*)"\$$/,
        singleRegex: /^(.*)\$$/,
        create: (pattern)=>({
                type: "suffix-exact",
                search (text) {
                    const isMatch = text.endsWith(pattern);
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices: [
                            text.length - pattern.length,
                            text.length - 1
                        ]
                    };
                }
            })
    },
    {
        type: "inverse-exact",
        multiRegex: /^!"(.*)"$/,
        singleRegex: /^!(.*)$/,
        create: (pattern)=>({
                type: "inverse-exact",
                search (text) {
                    const isMatch = text.indexOf(pattern) === -1;
                    return {
                        isMatch,
                        score: isMatch ? 0 : 1,
                        indices: [
                            0,
                            text.length - 1
                        ]
                    };
                }
            })
    },
    {
        type: "fuzzy",
        multiRegex: /^"(.*)"$/,
        singleRegex: /^(.*)$/,
        create: (pattern, options = {})=>{
            const bitap = new BitapSearch(pattern, {
                location: options.location ?? Config.location,
                threshold: options.threshold ?? Config.threshold,
                distance: options.distance ?? Config.distance,
                includeMatches: options.includeMatches ?? Config.includeMatches,
                findAllMatches: options.findAllMatches ?? Config.findAllMatches,
                minMatchCharLength: options.minMatchCharLength ?? Config.minMatchCharLength,
                isCaseSensitive: options.isCaseSensitive ?? Config.isCaseSensitive,
                ignoreDiacritics: options.ignoreDiacritics ?? Config.ignoreDiacritics,
                ignoreLocation: options.ignoreLocation ?? Config.ignoreLocation
            });
            return {
                type: "fuzzy",
                search (text) {
                    return bitap.searchIn(text);
                }
            };
        }
    }
];
//#endregion
//#region src/search/extended/parseQuery.ts
const matchersLen = matchers.length;
const ESCAPED_PIPE = "\0";
const OR_TOKEN = "|";
function tokenize(pattern) {
    const tokens = [];
    const len = pattern.length;
    let i = 0;
    while(i < len){
        while(i < len && pattern[i] === " ")i++;
        if (i >= len) break;
        let j = i;
        while(j < len && pattern[j] !== " " && pattern[j] !== "\"")j++;
        if (j < len && pattern[j] === "\"") {
            j++;
            while(j < len){
                if (pattern[j] === "\"") {
                    const next = j + 1;
                    if (next >= len || pattern[next] === " ") {
                        j++;
                        break;
                    }
                    if (pattern[next] === "$" && (next + 1 >= len || pattern[next + 1] === " ")) {
                        j += 2;
                        break;
                    }
                }
                j++;
            }
            tokens.push(pattern.substring(i, j));
            i = j;
        } else {
            while(j < len && pattern[j] !== " ")j++;
            tokens.push(pattern.substring(i, j));
            i = j;
        }
    }
    return tokens;
}
function getMatch(pattern, exp) {
    const matches = pattern.match(exp);
    return matches ? matches[1] : null;
}
function parseQuery(pattern, options = {}) {
    return pattern.replace(/\\\|/g, ESCAPED_PIPE).split(OR_TOKEN).map((item)=>{
        const query = tokenize(item.replace(/\u0000/g, "|").trim()).filter((item)=>item && !!item.trim());
        const results = [];
        for(let i = 0, len = query.length; i < len; i += 1){
            const queryItem = query[i];
            let found = false;
            let idx = -1;
            while(!found && ++idx < matchersLen){
                const def = matchers[idx];
                const token = getMatch(queryItem, def.multiRegex);
                if (token) {
                    results.push(def.create(token, options));
                    found = true;
                }
            }
            if (found) continue;
            idx = -1;
            while(++idx < matchersLen){
                const def = matchers[idx];
                const token = getMatch(queryItem, def.singleRegex);
                if (token) {
                    results.push(def.create(token, options));
                    break;
                }
            }
        }
        return results;
    });
}
//#endregion
//#region src/search/extended/index.ts
var ExtendedSearch = class {
    constructor(pattern, { isCaseSensitive = Config.isCaseSensitive, ignoreDiacritics = Config.ignoreDiacritics, includeMatches = Config.includeMatches, minMatchCharLength = Config.minMatchCharLength, ignoreLocation = Config.ignoreLocation, findAllMatches = Config.findAllMatches, location = Config.location, threshold = Config.threshold, distance = Config.distance } = {}){
        this.query = null;
        this.options = {
            isCaseSensitive,
            ignoreDiacritics,
            includeMatches,
            minMatchCharLength,
            findAllMatches,
            ignoreLocation,
            location,
            threshold,
            distance
        };
        pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        pattern = ignoreDiacritics ? stripDiacritics(pattern) : pattern;
        this.pattern = pattern;
        this.query = parseQuery(this.pattern, this.options);
    }
    static condition(_, options) {
        return options.useExtendedSearch;
    }
    searchIn(text) {
        const query = this.query;
        if (!query) return {
            isMatch: false,
            score: 1
        };
        const { includeMatches, isCaseSensitive, ignoreDiacritics } = this.options;
        text = isCaseSensitive ? text : text.toLowerCase();
        text = ignoreDiacritics ? stripDiacritics(text) : text;
        let numMatches = 0;
        const allIndices = [];
        let totalScore = 0;
        let hasInverse = false;
        for(let i = 0, qLen = query.length; i < qLen; i += 1){
            const searchers = query[i];
            allIndices.length = 0;
            numMatches = 0;
            hasInverse = false;
            for(let j = 0, pLen = searchers.length; j < pLen; j += 1){
                const matcher = searchers[j];
                const { isMatch, indices, score } = matcher.search(text);
                if (isMatch) {
                    numMatches += 1;
                    totalScore += score;
                    if (isInverse(matcher.type)) hasInverse = true;
                    if (includeMatches) {
                        if (MULTI_MATCH_TYPES.has(matcher.type)) allIndices.push(...indices);
                        else allIndices.push(indices);
                    }
                } else {
                    totalScore = 0;
                    numMatches = 0;
                    allIndices.length = 0;
                    hasInverse = false;
                    break;
                }
            }
            if (numMatches) {
                const result = {
                    isMatch: true,
                    score: totalScore / numMatches
                };
                if (hasInverse) result.hasInverse = true;
                if (includeMatches) result.indices = mergeIndices(allIndices);
                return result;
            }
        }
        return {
            isMatch: false,
            score: 1
        };
    }
};
//#endregion
//#region src/core/register.ts
const registeredSearchers = [];
function register(...args) {
    registeredSearchers.push(...args);
}
function createSearcher(pattern, options) {
    for(let i = 0, len = registeredSearchers.length; i < len; i += 1){
        const searcherClass = registeredSearchers[i];
        if (searcherClass.condition(pattern, options)) return new searcherClass(pattern, options);
    }
    return new BitapSearch(pattern, options);
}
//#endregion
//#region src/core/queryParser.ts
const LogicalOperator = {
    AND: "$and",
    OR: "$or"
};
const KeyType = {
    PATH: "$path",
    PATTERN: "$val"
};
const isExpression = (query)=>!!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = (query)=>!!query[KeyType.PATH];
const isLeaf = (query)=>!isArray(query) && isObject(query) && !isExpression(query);
const convertToExplicit = (query)=>({
        [LogicalOperator.AND]: Object.keys(query).map((key)=>({
                [key]: query[key]
            }))
    });
function parse(query, options, { auto = true } = {}) {
    const next = (query)=>{
        if (isString(query)) {
            const obj = {
                keyId: null,
                pattern: query
            };
            if (auto) obj.searcher = createSearcher(query, options);
            return obj;
        }
        const keys = Object.keys(query);
        const isQueryPath = isPath(query);
        if (!isQueryPath && keys.length > 1 && !isExpression(query)) return next(convertToExplicit(query));
        if (isLeaf(query)) {
            const key = isQueryPath ? query[KeyType.PATH] : keys[0];
            const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];
            if (!isString(pattern)) throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
            const obj = {
                keyId: createKeyId(key),
                pattern
            };
            if (auto) obj.searcher = createSearcher(pattern, options);
            return obj;
        }
        const node = {
            children: [],
            operator: keys[0]
        };
        keys.forEach((key)=>{
            const value = query[key];
            if (isArray(value)) value.forEach((item)=>{
                node.children.push(next(item));
            });
        });
        return node;
    };
    if (!isExpression(query)) query = convertToExplicit(query);
    return next(query);
}
//#endregion
//#region src/core/computeScore.ts
function computeScoreSingle(matches, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    let totalScore = 1;
    matches.forEach(({ key, norm, score })=>{
        const weight = key ? key.weight : null;
        totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm));
    });
    return totalScore;
}
function computeScore(results, { ignoreFieldNorm = Config.ignoreFieldNorm }) {
    results.forEach((result)=>{
        result.score = computeScoreSingle(result.matches, {
            ignoreFieldNorm
        });
    });
}
//#endregion
//#region src/tools/MaxHeap.ts
var MaxHeap = class {
    constructor(limit, comparator){
        this.limit = limit;
        this.heap = [];
        this.comparator = comparator;
    }
    get size() {
        return this.heap.length;
    }
    insert(item) {
        if (this.size < this.limit) {
            this.heap.push(item);
            this._bubbleUp(this.size - 1);
        } else if (this.comparator(item, this.heap[0]) < 0) {
            this.heap[0] = item;
            this._sinkDown(0);
        }
    }
    extractSorted() {
        return this.heap.sort(this.comparator);
    }
    _bubbleUp(i) {
        const heap = this.heap;
        while(i > 0){
            const parent = i - 1 >> 1;
            if (this.comparator(heap[i], heap[parent]) <= 0) break;
            const tmp = heap[i];
            heap[i] = heap[parent];
            heap[parent] = tmp;
            i = parent;
        }
    }
    _sinkDown(i) {
        const heap = this.heap;
        const len = heap.length;
        let largest = i;
        do {
            i = largest;
            const left = 2 * i + 1;
            const right = 2 * i + 2;
            if (left < len && this.comparator(heap[left], heap[largest]) > 0) largest = left;
            if (right < len && this.comparator(heap[right], heap[largest]) > 0) largest = right;
            if (largest !== i) {
                const tmp = heap[i];
                heap[i] = heap[largest];
                heap[largest] = tmp;
            }
        }while (largest !== i);
    }
};
//#endregion
//#region src/core/formatMatches.ts
function formatMatches(result) {
    const matches = [];
    result.matches.forEach((match)=>{
        if (!isDefined(match.indices) || !match.indices.length) return;
        const obj = {
            indices: match.indices,
            value: match.value
        };
        if (match.key) obj.key = match.key.id;
        if (match.idx > -1) obj.refIndex = match.idx;
        matches.push(obj);
    });
    return matches;
}
//#endregion
//#region src/core/format.ts
function format(results, docs, { includeMatches = Config.includeMatches, includeScore = Config.includeScore } = {}) {
    return results.map((result)=>{
        const { idx } = result;
        const data = {
            item: docs[idx],
            refIndex: idx
        };
        if (includeMatches) data.matches = formatMatches(result);
        if (includeScore) data.score = result.score;
        return data;
    });
}
//#endregion
//#region src/search/token/analyzer.ts
const DEFAULT_TOKEN = /[\p{L}\p{M}\p{N}_]+/gu;
const warned = /* @__PURE__ */ new WeakSet();
function warnNonGlobal(regex) {
    if (!warned.has(regex)) {
        warned.add(regex);
        console.warn(`[Fuse] tokenize regex ${regex} lacks the global flag; only the first match per text will be returned. Add the 'g' flag.`);
    }
}
function resolveTokenize(tokenize) {
    if (typeof tokenize === "function") {
        let validated = false;
        return (text)=>{
            const result = tokenize(text);
            if (!validated) {
                validated = true;
                if (!Array.isArray(result) || result.some((t)=>typeof t !== "string")) throw new Error(`[Fuse] tokenize function must return string[]; received ${Array.isArray(result) ? "array containing non-strings" : typeof result}.`);
            }
            return result;
        };
    }
    if (tokenize instanceof RegExp) {
        if (!tokenize.global) warnNonGlobal(tokenize);
        return (text)=>text.match(tokenize) || [];
    }
    return (text)=>text.match(DEFAULT_TOKEN) || [];
}
function createAnalyzer({ isCaseSensitive = false, ignoreDiacritics = false, tokenize } = {}) {
    const tokenizeFn = resolveTokenize(tokenize);
    return {
        tokenize (text) {
            if (!isCaseSensitive) text = text.toLowerCase();
            if (ignoreDiacritics) text = stripDiacritics(text);
            return tokenizeFn(text);
        }
    };
}
//#endregion
//#region src/search/token/index.ts
const MAX_MASK_TERMS = 31;
var TokenSearch = class {
    static condition(_, options) {
        return options.useTokenSearch;
    }
    constructor(pattern, options){
        this.options = options;
        this.analyzer = createAnalyzer({
            isCaseSensitive: options.isCaseSensitive,
            ignoreDiacritics: options.ignoreDiacritics,
            tokenize: options.tokenize
        });
        const queryTerms = this.analyzer.tokenize(pattern);
        const { df, fieldCount } = options._invertedIndex;
        this.termSearchers = [];
        this.idfWeights = [];
        for (const term of queryTerms){
            this.termSearchers.push(new BitapSearch(term, {
                location: options.location,
                threshold: options.threshold,
                distance: options.distance,
                includeMatches: options.includeMatches,
                findAllMatches: options.findAllMatches,
                minMatchCharLength: options.minMatchCharLength,
                isCaseSensitive: options.isCaseSensitive,
                ignoreDiacritics: options.ignoreDiacritics,
                ignoreLocation: true
            }));
            const docFreq = df.get(term) || 0;
            const idf = Math.log(1 + (fieldCount - docFreq + .5) / (docFreq + .5));
            this.idfWeights.push(idf);
        }
        this.combineAll = options.tokenMatch === "all";
        this.numTerms = this.termSearchers.length;
        this.useMask = this.numTerms <= 31;
    }
    searchIn(text) {
        if (!this.termSearchers.length) return {
            isMatch: false,
            score: 1
        };
        const allIndices = [];
        let weightedScore = 0;
        let maxPossibleScore = 0;
        let matchedCount = 0;
        let matchedMask = 0;
        const matchedTerms = this.combineAll && !this.useMask ? /* @__PURE__ */ new Set() : null;
        for(let i = 0; i < this.termSearchers.length; i++){
            const result = this.termSearchers[i].searchIn(text);
            const idf = this.idfWeights[i];
            maxPossibleScore += idf;
            if (result.isMatch) {
                matchedCount++;
                weightedScore += idf * (1 - result.score);
                if (result.indices) allIndices.push(...result.indices);
                if (this.combineAll) {
                    if (this.useMask) matchedMask |= 1 << i;
                    else matchedTerms.add(i);
                }
            }
        }
        if (matchedCount === 0) return {
            isMatch: false,
            score: 1
        };
        const normalized = maxPossibleScore > 0 ? 1 - weightedScore / maxPossibleScore : 0;
        const searchResult = {
            isMatch: true,
            score: Math.max(.001, normalized)
        };
        if (this.options.includeMatches && allIndices.length) searchResult.indices = mergeIndices(allIndices);
        if (this.combineAll) {
            if (this.useMask) searchResult.matchedMask = matchedMask;
            else searchResult.matchedTerms = matchedTerms;
            searchResult.termCount = this.numTerms;
        }
        return searchResult;
    }
};
//#endregion
//#region src/search/token/InvertedIndex.ts
function addField(index, text, docIdx, analyzer) {
    const tokens = analyzer.tokenize(text);
    if (!tokens.length) return;
    index.fieldCount++;
    index.docFieldCount.set(docIdx, (index.docFieldCount.get(docIdx) || 0) + 1);
    const distinctTerms = new Set(tokens);
    let perDocTerms = index.docTermFieldHits.get(docIdx);
    if (!perDocTerms) {
        perDocTerms = /* @__PURE__ */ new Map();
        index.docTermFieldHits.set(docIdx, perDocTerms);
    }
    for (const term of distinctTerms){
        perDocTerms.set(term, (perDocTerms.get(term) || 0) + 1);
        index.df.set(term, (index.df.get(term) || 0) + 1);
    }
}
function ingestRecord(index, record, keyCount, analyzer) {
    const { i: docIdx, v, $: fields } = record;
    if (v !== void 0) {
        addField(index, v, docIdx, analyzer);
        return;
    }
    if (!fields) return;
    for(let keyIdx = 0; keyIdx < keyCount; keyIdx++){
        const value = fields[keyIdx];
        if (!value) continue;
        if (Array.isArray(value)) for (const sub of value)addField(index, sub.v, docIdx, analyzer);
        else addField(index, value.v, docIdx, analyzer);
    }
}
function buildInvertedIndex(records, keyCount, analyzer) {
    const index = {
        fieldCount: 0,
        df: /* @__PURE__ */ new Map(),
        docFieldCount: /* @__PURE__ */ new Map(),
        docTermFieldHits: /* @__PURE__ */ new Map()
    };
    for (const record of records)ingestRecord(index, record, keyCount, analyzer);
    return index;
}
function addToInvertedIndex(index, record, keyCount, analyzer) {
    ingestRecord(index, record, keyCount, analyzer);
}
function removeFromInvertedIndex(index, docIdx) {
    const fieldCount = index.docFieldCount.get(docIdx);
    if (fieldCount === void 0) return;
    index.fieldCount -= fieldCount;
    index.docFieldCount.delete(docIdx);
    const perDocTerms = index.docTermFieldHits.get(docIdx);
    if (!perDocTerms) return;
    for (const [term, hits] of perDocTerms){
        const next = (index.df.get(term) || 0) - hits;
        if (next <= 0) index.df.delete(term);
        else index.df.set(term, next);
    }
    index.docTermFieldHits.delete(docIdx);
}
function removeAndShiftInvertedIndex(index, removedIndices) {
    if (removedIndices.length === 0) return;
    const sorted = Array.from(new Set(removedIndices)).sort((a, b)=>a - b);
    for (const idx of sorted)removeFromInvertedIndex(index, idx);
    const shift = (oldIdx)=>{
        let lo = 0;
        let hi = sorted.length;
        while(lo < hi){
            const mid = lo + hi >>> 1;
            if (sorted[mid] < oldIdx) lo = mid + 1;
            else hi = mid;
        }
        return oldIdx - lo;
    };
    const firstRemoved = sorted[0];
    const shiftedDocFieldCount = /* @__PURE__ */ new Map();
    for (const [oldKey, count] of index.docFieldCount)shiftedDocFieldCount.set(oldKey > firstRemoved ? shift(oldKey) : oldKey, count);
    index.docFieldCount = shiftedDocFieldCount;
    const shiftedDocTermFieldHits = /* @__PURE__ */ new Map();
    for (const [oldKey, terms] of index.docTermFieldHits)shiftedDocTermFieldHits.set(oldKey > firstRemoved ? shift(oldKey) : oldKey, terms);
    index.docTermFieldHits = shiftedDocTermFieldHits;
}
//#endregion
//#region src/core/index.ts
var Fuse = class {
    constructor(docs, options, index){
        this.options = {
            ...Config,
            ...options
        };
        this.options.useExtendedSearch;
        this.options.useTokenSearch;
        this._keyStore = new KeyStore(this.options.keys);
        this._docs = docs;
        this._myIndex = null;
        this._invertedIndex = null;
        this.setCollection(docs, index);
        this._lastQuery = null;
        this._lastSearcher = null;
    }
    _getSearcher(query) {
        if (this._lastQuery === query) return this._lastSearcher;
        const searcher = createSearcher(query, this._invertedIndex ? {
            ...this.options,
            _invertedIndex: this._invertedIndex
        } : this.options);
        this._lastQuery = query;
        this._lastSearcher = searcher;
        return searcher;
    }
    setCollection(docs, index) {
        this._docs = docs;
        if (index && !(index instanceof FuseIndex)) throw new Error(INCORRECT_INDEX_TYPE);
        this._myIndex = index || createIndex(this.options.keys, this._docs, {
            getFn: this.options.getFn,
            fieldNormWeight: this.options.fieldNormWeight
        });
        if (this.options.useTokenSearch) {
            const analyzer = createAnalyzer({
                isCaseSensitive: this.options.isCaseSensitive,
                ignoreDiacritics: this.options.ignoreDiacritics,
                tokenize: this.options.tokenize
            });
            this._invertedIndex = buildInvertedIndex(this._myIndex.records, this._myIndex.keys.length, analyzer);
        }
        this._invalidateSearcherCache();
    }
    add(doc) {
        if (!isDefined(doc)) return;
        this._docs.push(doc);
        const record = this._myIndex.add(doc, this._docs.length - 1);
        if (this._invertedIndex && record) {
            const analyzer = createAnalyzer({
                isCaseSensitive: this.options.isCaseSensitive,
                ignoreDiacritics: this.options.ignoreDiacritics,
                tokenize: this.options.tokenize
            });
            addToInvertedIndex(this._invertedIndex, record, this._myIndex.keys.length, analyzer);
        }
        this._invalidateSearcherCache();
    }
    remove(predicate = ()=>false) {
        const results = [];
        const indicesToRemove = [];
        for(let i = 0, len = this._docs.length; i < len; i += 1)if (predicate(this._docs[i], i)) {
            results.push(this._docs[i]);
            indicesToRemove.push(i);
        }
        if (indicesToRemove.length) {
            if (this._invertedIndex) removeAndShiftInvertedIndex(this._invertedIndex, indicesToRemove);
            const toRemove = new Set(indicesToRemove);
            this._docs = this._docs.filter((_, i)=>!toRemove.has(i));
            this._myIndex.removeAll(indicesToRemove);
            this._invalidateSearcherCache();
        }
        return results;
    }
    removeAt(idx) {
        if (!Number.isInteger(idx) || idx < 0 || idx >= this._docs.length) throw new Error(INVALID_DOC_INDEX);
        if (this._invertedIndex) removeAndShiftInvertedIndex(this._invertedIndex, [
            idx
        ]);
        const doc = this._docs.splice(idx, 1)[0];
        this._myIndex.removeAt(idx);
        this._invalidateSearcherCache();
        return doc;
    }
    _invalidateSearcherCache() {
        this._lastQuery = null;
        this._lastSearcher = null;
    }
    getIndex() {
        return this._myIndex;
    }
    _normalizedKeys() {
        return this._myIndex.keys.map((key)=>this._keyStore.get(key.id) || key);
    }
    search(query, options) {
        const { limit = -1 } = options || {};
        const { includeMatches, includeScore, shouldSort, sortFn, ignoreFieldNorm } = this.options;
        if (isString(query) && !query.trim()) {
            let docs = this._docs.map((item, idx)=>({
                    item,
                    refIndex: idx
                }));
            if (isNumber(limit) && limit > -1) docs = docs.slice(0, limit);
            return docs;
        }
        const useHeap = shouldSort && isNumber(limit) && limit > 0 && isString(query);
        const comparator = sortFn;
        const stable = (a, b)=>comparator(a, b) || a.idx - b.idx;
        let results;
        if (useHeap) {
            const heap = new MaxHeap(limit, stable);
            if (isString(this._docs[0])) this._searchStringList(query, {
                heap,
                ignoreFieldNorm
            });
            else this._searchObjectList(query, {
                heap,
                ignoreFieldNorm
            });
            results = heap.extractSorted();
        } else {
            results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
            computeScore(results, {
                ignoreFieldNorm
            });
            if (shouldSort) results.sort(isString(query) ? stable : comparator);
            if (isNumber(limit) && limit > -1) results = results.slice(0, limit);
        }
        return format(results, this._docs, {
            includeMatches,
            includeScore
        });
    }
    _searchStringList(query, { heap, ignoreFieldNorm } = {}) {
        const searcher = this._getSearcher(query);
        const requireAllTokens = this.options.useTokenSearch && this.options.tokenMatch === "all";
        const { records } = this._myIndex;
        const results = heap ? null : [];
        records.forEach(({ v: text, i: idx, n: norm })=>{
            if (!isDefined(text)) return;
            const searchResult = searcher.searchIn(text);
            if (searchResult.isMatch) {
                const match = {
                    score: searchResult.score,
                    value: text,
                    norm,
                    indices: searchResult.indices
                };
                if (requireAllTokens) {
                    match.matchedMask = searchResult.matchedMask;
                    match.matchedTerms = searchResult.matchedTerms;
                    match.termCount = searchResult.termCount;
                }
                const matches = [
                    match
                ];
                if (!requireAllTokens || this._coversAllTokens(matches)) {
                    const result = {
                        item: text,
                        idx,
                        matches
                    };
                    if (heap) {
                        result.score = computeScoreSingle(result.matches, {
                            ignoreFieldNorm
                        });
                        heap.insert(result);
                    } else results.push(result);
                }
            }
        });
        return results;
    }
    _searchLogical(query) {
        const expression = parse(query, this.options);
        const keys = this._normalizedKeys();
        const evaluate = (node, item, idx)=>{
            if (!("children" in node)) {
                const { keyId, searcher } = node;
                let matches;
                if (keyId === null) {
                    matches = [];
                    keys.forEach((key, keyIndex)=>{
                        matches.push(...this._findMatches({
                            key,
                            value: item[keyIndex],
                            searcher
                        }));
                    });
                } else matches = this._findMatches({
                    key: this._keyStore.get(keyId),
                    value: this._myIndex.getValueForItemAtKeyId(item, keyId),
                    searcher
                });
                if (matches && matches.length) return [
                    {
                        idx,
                        item,
                        matches
                    }
                ];
                return [];
            }
            const { children, operator } = node;
            const res = [];
            for(let i = 0, len = children.length; i < len; i += 1){
                const child = children[i];
                const result = evaluate(child, item, idx);
                if (result.length) res.push(...result);
                else if (operator === LogicalOperator.AND) return [];
            }
            return res;
        };
        const records = this._myIndex.records;
        const resultMap = /* @__PURE__ */ new Map();
        const results = [];
        records.forEach(({ $: item, i: idx })=>{
            if (isDefined(item)) {
                const expResults = evaluate(expression, item, idx);
                if (expResults.length) {
                    if (!resultMap.has(idx)) {
                        resultMap.set(idx, {
                            idx,
                            item,
                            matches: []
                        });
                        results.push(resultMap.get(idx));
                    }
                    expResults.forEach(({ matches })=>{
                        resultMap.get(idx).matches.push(...matches);
                    });
                }
            }
        });
        return results;
    }
    _searchObjectList(query, { heap, ignoreFieldNorm } = {}) {
        const searcher = this._getSearcher(query);
        const requireAllTokens = this.options.useTokenSearch && this.options.tokenMatch === "all";
        const { records } = this._myIndex;
        const keys = this._normalizedKeys();
        const results = heap ? null : [];
        records.forEach(({ $: item, i: idx })=>{
            if (!isDefined(item)) return;
            const matches = [];
            let anyKeyFailed = false;
            let hasInverse = false;
            keys.forEach((key, keyIndex)=>{
                const keyMatches = this._findMatches({
                    key,
                    value: item[keyIndex],
                    searcher
                });
                if (keyMatches.length) {
                    matches.push(...keyMatches);
                    if (keyMatches[0].hasInverse) hasInverse = true;
                } else anyKeyFailed = true;
            });
            if (hasInverse && anyKeyFailed) return;
            if (matches.length && (!requireAllTokens || this._coversAllTokens(matches))) {
                const result = {
                    idx,
                    item,
                    matches
                };
                if (heap) {
                    result.score = computeScoreSingle(result.matches, {
                        ignoreFieldNorm
                    });
                    heap.insert(result);
                } else results.push(result);
            }
        });
        return results;
    }
    _findMatches({ key, value, searcher }) {
        if (!isDefined(value)) return [];
        const matches = [];
        if (isArray(value)) value.forEach(({ v: text, i: idx, n: norm })=>{
            if (!isDefined(text)) return;
            const searchResult = searcher.searchIn(text);
            if (searchResult.isMatch) {
                const match = {
                    score: searchResult.score,
                    key,
                    value: text,
                    idx,
                    norm,
                    indices: searchResult.indices,
                    hasInverse: searchResult.hasInverse
                };
                if (searchResult.termCount !== void 0) {
                    match.matchedMask = searchResult.matchedMask;
                    match.matchedTerms = searchResult.matchedTerms;
                    match.termCount = searchResult.termCount;
                }
                matches.push(match);
            }
        });
        else {
            const { v: text, n: norm } = value;
            const searchResult = searcher.searchIn(text);
            if (searchResult.isMatch) {
                const match = {
                    score: searchResult.score,
                    key,
                    value: text,
                    norm,
                    indices: searchResult.indices,
                    hasInverse: searchResult.hasInverse
                };
                if (searchResult.termCount !== void 0) {
                    match.matchedMask = searchResult.matchedMask;
                    match.matchedTerms = searchResult.matchedTerms;
                    match.termCount = searchResult.termCount;
                }
                matches.push(match);
            }
        }
        return matches;
    }
    _coversAllTokens(matches) {
        const termCount = matches.length ? matches[0].termCount : void 0;
        if (termCount === void 0) return true;
        if (termCount <= 31) {
            let coverage = 0;
            for(let i = 0; i < matches.length; i++)coverage |= matches[i].matchedMask || 0;
            return coverage === 2 ** termCount - 1;
        }
        const coverage = /* @__PURE__ */ new Set();
        for(let i = 0; i < matches.length; i++){
            const terms = matches[i].matchedTerms;
            if (terms) for (const t of terms)coverage.add(t);
        }
        return coverage.size === termCount;
    }
};
//#endregion
//#region src/entry.ts
Fuse.version = "7.5.0";
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
Fuse.match = function(pattern, text, options) {
    if (options && options.useTokenSearch) throw new Error(FUSE_MATCH_TOKEN_SEARCH_UNSUPPORTED);
    return createSearcher(pattern, {
        ...Config,
        ...options
    }).searchIn(text);
};
Fuse.parseQuery = parse;
register(ExtendedSearch);
register(TokenSearch);
Fuse.use = function(...plugins) {
    plugins.forEach((plugin)=>register(plugin));
};
var entry_default = Fuse;

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"hRoQ7":[function() {},{}]},["k8Xbc","2VkcA"], "2VkcA", "parcelRequire7ca3", {})

//# sourceMappingURL=FusionLobbyBrowser.93566fe3.js.map
