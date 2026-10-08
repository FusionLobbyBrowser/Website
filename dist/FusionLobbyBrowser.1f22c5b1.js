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
})({"2UJpY":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "5b174a4f1f22c5b1";
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

},{}],"akTkr":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _unityRichTextJs = require("./unityRichText.js");
var _constJs = require("./const.js");
var _steamJs = require("./steam.js");
var _discordJs = require("./discord.js");
var _discordJsDefault = parcelHelpers.interopDefault(_discordJs);
var _settingsJs = require("./settings.js");
var _tippyJs = require("tippy.js");
var _tippyJsDefault = parcelHelpers.interopDefault(_tippyJs);
var _tippyCss = require("tippy.js/dist/tippy.css");
var _dompurify = require("dompurify");
var _dompurifyDefault = parcelHelpers.interopDefault(_dompurify);
var _webp = require("../images/default/*.webp");
let HOST = "https://fusionapi.hahoos.dev/"; // https://localhost:7073/
const LOBBY_LIST = "[host]lobbylist";
const THUMBNAIL = "[host]thumbnail/[modId]?barcode=[barcode]";
const URI_JOIN = "flb-bridge://join/[data]";
const LOBBY_PARAM = "lobby";
const SIMULATE_HOODRP = false;
let allLobbies;
let friendIDs;
let infoView = -1;
let refreshInterval = 10;
let refreshing = false;
let lastRefresh = Date.now();
let fullyLoaded = false;
let lobbiesSignal;
let infoSignal;
let thumbnailCache = new Map();
const cacheExpireTime = 900;
let showingInfo = false;
let fetchError = false;
let inLobby;
let oldSize = {
    width: window.innerWidth,
    height: window.innerHeight
};
window.addEventListener("resize", onResize);
const converter = new (0, _unityRichTextJs.Converter)();
let uptimeContainer;
let uptimeContent;
// Sort Order
// 1 - Descending
// 2 - Ascending
const sorting = [
    {
        name: "Alphabetical",
        callback: (lobbies, order)=>{
            lobbies.sort((a, b)=>getLobbyName(a).toLowerCase().localeCompare(getLobbyName(b).toLowerCase()));
            if (order == 2) lobbies.reverse();
        }
    },
    {
        name: "Players",
        callback: (lobbies, order)=>{
            lobbies.sort((a, b)=>parseInt(b.playerCount) - parseInt(a.playerCount));
            if (order == 2) lobbies.reverse();
        }
    },
    {
        name: "Uptime",
        callback: (lobbies, order)=>{
            lobbies.sort((a, b)=>parseInt(a.lobbyUptime) - parseInt(b.lobbyUptime));
            if (order == 2) lobbies.reverse();
        }
    }
];
async function fetchAndCreateLobbies() {
    if (refreshing) return;
    refreshing = true;
    console.log("Fetching lobbies");
    const start = Date.now();
    try {
        if (lobbiesSignal) lobbiesSignal.abort();
        if (infoSignal) infoSignal.abort();
        const controller = new AbortController();
        lobbiesSignal = controller;
        filterBadges();
        const refreshBtn = document.getElementById("refreshButton");
        const refresh = document.getElementById("refresh");
        try {
            refreshBtn.classList.add("blocked");
            refreshBtn.getElementsByClassName("textIcon")[0].classList.add("fa-spin");
            refreshBtn.blocked = true;
            const lobbies = document.getElementById("lobbies");
            const res = await getJSON();
            const json = res.res ?? res;
            if (json.error != null) {
                lobbies.replaceChildren();
                if (!await isServerOnline()) {
                    lobbyNotice("Request Error", "Failed to fetch lobbies, because the server is currently offline. Try again later!", "fas fa-xmark", "--flb-error-color");
                    fetchError = true;
                } else {
                    lobbyNotice("Request Error", (0, _dompurifyDefault.default).sanitize("Failed to fetch lobbies, server responded with the following error: " + json.error.detail), "fas fa-xmark", "--flb-error-color");
                    fetchError = true;
                }
                setTimeElem(refresh, null);
                setLobbyCount(-1);
                setPlayerCount(0, 0);
                document.getElementById("steamCount").textContent = 0;
                document.getElementById("epicCount").textContent = 0;
                hideShow(true);
            } else {
                fetchError = false;
                if (json.interval) refreshInterval = Number(json.interval);
                let date = refresh.getAttribute("date");
                let numDate = -1;
                if (date) numDate = Number(date) / 1000;
                if (numDate == -1 || numDate != json.date) {
                    setURLParams();
                    timeFromResponse(refresh, json.date);
                    if (json.lobbies != null) {
                        let lobbies = json.lobbies;
                        allLobbies = structuredClone(lobbies);
                        friendIDs = structuredClone(json.friends);
                        let _gamemodes = [];
                        lobbies.forEach((val)=>{
                            if (!val) return;
                            const gamemode = val.gamemodeBarcode;
                            const g = (0, _constJs.gamemodes).find((x)=>x.barcode == val.gamemodeBarcode);
                            if (!_gamemodes.includes(gamemode)) {
                                (0, _settingsJs.addSetting)({
                                    id: `gamemode_${!gamemode || gamemode == "" ? "Lakatrazz.Sandbox" : gamemode}`,
                                    category: "Gamemodes",
                                    type: "filter",
                                    name: val.gamemodeTitle ? (0, _unityRichTextJs.Converter).removeRichText(val.gamemodeTitle) : "Sandbox",
                                    icon: g && g.icon ? g.icon : "fas fa-puzzle-piece",
                                    lobbyFilter: true,
                                    filterValue: false,
                                    lobbyValidator: (lobby)=>{
                                        return lobby.gamemodeBarcode == gamemode;
                                    },
                                    defaultValue: {
                                        include: false,
                                        exclude: false
                                    }
                                });
                                _gamemodes.push(gamemode);
                            }
                        });
                        await createLobbies(controller);
                    } else hideShow(true);
                }
            }
        } finally{
            refreshing = false;
            setContent(refreshBtn, "Refresh");
            refreshBtn.classList.remove("blocked");
            refreshBtn.blocked = false;
            refreshBtn.getElementsByClassName("textIcon")[0].classList.remove("fa-spin");
            if (refresh.hasAttribute("date")) await refreshButton(new Date(Number(refresh.getAttribute("date"))));
        }
    } catch (ex) {
        lobbyNotice("Error", 'An unexpected error has occurred while fetching/creating lobbies! If the error persits, contact the developer (check FAQ for contact)! If possible, <a class="modLink" href="https://balsamiq.com/support/troubleshooting-faqs/browser-console/" target="_blank" rel="noopener noreferrer">provide the error from the console</a> <br /> Exception: ' + (0, _dompurifyDefault.default).sanitize(ex), "fas fa-xmark", "--flb-error-color");
        console.error("Failed to create lobbies");
        console.error(ex);
        hideShow(true);
    } finally{
        refreshing = false;
        const time = (Date.now() - start) / 1000;
        console.log(`Creating lobbies took %c${time.toFixed(4)}s`, "color: #FF0");
    }
}
function filterBadges() {
    const list = document.getElementById("appliedFilters");
    list.replaceChildren();
    let any = false;
    for (const x of (0, _settingsJs.settings)){
        const val = (0, _settingsJs.getSettingValue)(x.id);
        if (val == null || val == undefined || !x.lobbyFilter) continue;
        let filter = false;
        if (typeof x.filterValue == "function") filter = x.filterValue(x, val);
        else filter = x.filterValue == val;
        if (filter) {
            any = true;
            const badge = document.createElement("p");
            badge.classList.add("infoBadge");
            const content = document.createElement("span");
            content.classList.add("elemContent");
            const text = x.type != "search" ? x.baseName && x.baseName != "" ? x.baseName : x.name : val;
            if (!x.icon) content.textContent = text;
            else {
                const settingIcon = (0, _settingsJs.getIconElem)(x.icon);
                const settingContent = document.createElement("span");
                settingContent.classList.add("elemContent");
                settingContent.textContent = text;
                content.appendChild(settingIcon);
                content.appendChild(settingContent);
                if (x.type == "filter") {
                    const settingType = document.createElement("i");
                    settingType.classList.add("fas");
                    if (val && val.include == true) {
                        settingType.classList.add("fa-check");
                        content.appendChild(settingType);
                    } else if (val && val.exclude == true) {
                        settingType.classList.add("fa-xmark");
                        content.appendChild(settingType);
                    }
                }
            }
            badge.appendChild(content);
            list.appendChild(badge);
        }
    }
    if (!any) {
        list.classList.add("noFilters");
        const title = document.createElement("h4");
        title.id = "noFiltersText";
        title.textContent = "No filters applied!";
        list.appendChild(title);
    } else list.classList.remove("noFilters");
}
function adjustLobby(lobby, height) {
    const lobbyName = lobby.getElementsByClassName("lobbyName")[0];
    const levelTitle = lobby.getElementsByClassName("levelTitle")[0];
    const hostName = lobby.getElementsByClassName("lobbyHostName")[0];
    const gamemode = lobby.getElementsByClassName("gamemodeTitle")[0];
    const lineHeight = 20;
    if (height <= lineHeight) gamemode.classList.add("oneLine");
    else gamemode.classList.remove("oneLine");
    const ellipsisElems = [
        lobbyName,
        gamemode,
        levelTitle,
        hostName
    ];
    ellipsisElems.forEach((val)=>{
        if (isEllipsisActive(val)) createToolTip(val, val.innerHTML);
        else if (val._tippy) val._tippy.destroy();
    });
}
function adjustPlayer(player, height) {
    const name = player.getElementsByClassName("name")[0];
    const permissions = player.getElementsByClassName("permissions")[0];
    const avatarTitle = player.getElementsByClassName("avatarTitle")[0];
    const lineHeight = 20;
    if (height <= lineHeight) avatarTitle.classList.add("oneLineAvatar");
    else avatarTitle.classList.remove("oneLineAvatar");
    const ellipsisElems = [
        name,
        permissions,
        avatarTitle
    ];
    ellipsisElems.forEach((val)=>{
        if (isEllipsisActive(val)) createToolTip(val, val.innerHTML);
        else if (val._tippy) val._tippy.destroy();
    });
}
const lobbyObserver = new ResizeObserver((entries)=>{
    for (const x of entries)if (x.contentRect) adjustLobby(x.target.parentElement, x.contentRect.height);
});
const playerObserver = new ResizeObserver((entries)=>{
    for (const x of entries)if (x.contentRect) adjustPlayer(x.target.parentElement, x.contentRect.height);
});
function getLobbyName(lobby, stripRichText = true) {
    const name = lobby.lobbyName != "" ? lobby.lobbyName : `${lobby.lobbyHostName}'s Lobby`;
    if (stripRichText) return (0, _unityRichTextJs.Converter).removeRichText(name);
    else return name;
}
async function createLobbies(signal) {
    if (allLobbies == null || allLobbies == undefined) return;
    let infoUpdated = false;
    const refreshBtn = document.getElementById("refreshButton");
    const lobbies = document.getElementById("lobbies");
    lobbies.replaceChildren();
    let lobbyList = structuredClone(allLobbies);
    let lobbyCountMax = lobbyList.length;
    let allowed = hideLobbies(false);
    const sort = (0, _settingsJs.getSettingValue)("sort");
    let sorted = false;
    if (sort) {
        const s = sorting.find((x)=>x.name == sort);
        if (s) {
            s.callback(lobbyList, (0, _settingsJs.getSettingValue)("sortOrder") != "Descending" ? 2 : 1);
            sorted = true;
        }
    }
    if (!sorted) sorting.find((x)=>x.name == "Players").callback(lobbyList, 2);
    let players = 0;
    let steam = 0;
    let epic = 0;
    let allPlayers = 0;
    lobbyList.forEach((val)=>{
        if (val.lobbyPlatform == "Steam") steam++;
        else if (val.lobbyPlatform == "Epic") epic++;
        allPlayers += Number(val.playerCount);
        if (allowed.includes(val.lobbyID)) players += Number(val.playerCount);
    });
    document.getElementById("steamCount").textContent = steam;
    document.getElementById("epicCount").textContent = epic;
    setLobbyCount(allowed.length, lobbyCountMax);
    setPlayerCount(players, allPlayers);
    if (lobbyList.length == 0) lobbyNotice("No Lobbies Found", "There are currently no lobbies available!", "fas fa-face-frown", "--flb-gray-color");
    else if (allowed.length == 0) lobbyNotice("All Lobbies Filtered Out", "Seems like you set the wrong filters!", "fas fa-face-frown", "--flb-gray-color", false);
    inLobby = [];
    let lobbiesWithFriends = [];
    lobbyList.forEach((x)=>{
        const filtered = x.playerList.players.filter((y)=>friendIDs.some((x)=>x == String(y.platformID)));
        if (filtered && filtered.length > 0) {
            lobbiesWithFriends.push(x);
            filtered.forEach((y)=>{
                inLobby.push({
                    id: String(y.platformID),
                    lobbyName: getLobbyName(x, false),
                    lobbyCode: x.lobbyCode,
                    lobbyPlatform: x.lobbyPlatform,
                    lobbyID: x.lobbyID
                });
            });
        }
    });
    if ((0, _settingsJs.friends) != undefined) (0, _settingsJs.setFriendsInLobby)(inLobby);
    else window.addEventListener("onfriendslistfetched", waitForFriendsFetch);
    console.log(`Creating %c${lobbyList.length}%c %s`, "color: #0ff", "color: inherit", "lobbies");
    let prioritized = [];
    if (isToggleChecked("prioritizeLobbiesWithFriends")) prioritized = lobbiesWithFriends;
    else if (isToggleChecked("prioritizeFriendsOnlyLobbies")) prioritized = lobbyList.filter((x)=>x.privacy == 2);
    if (prioritized && prioritized.length > 0) {
        const sort = (0, _settingsJs.getSettingValue)("sort");
        let sorted = false;
        if (sort) {
            const s = sorting.find((x)=>x.name == sort);
            if (s) {
                s.callback(prioritized, (0, _settingsJs.getSettingValue)("sortOrder") != "Descending" ? 2 : 1);
                sorted = true;
            }
        }
        if (!sorted) sorting.find((x)=>x.name == "Players").callback(prioritized, 2);
    }
    const shouldUpdate = infoView != -1;
    let count = 0;
    for(let i = 0; i < prioritized.length; i++){
        if (signal?.signal?.aborted == true) return;
        count++;
        const lobby = prioritized[i];
        setContent(refreshBtn, `Loading (${count} of ${lobbyList.length})`);
        if (await createLobby(lobby, signal, !allowed.includes(lobby.lobbyID))) infoUpdated = true;
    }
    const other = lobbyList.filter((x)=>!prioritized.some((y)=>y.lobbyID == x.lobbyID));
    for(let i = 0; i < other.length; i++){
        if (signal?.signal?.aborted == true) return;
        count++;
        const lobby = other[i];
        setContent(refreshBtn, `Loading (${count} of ${lobbyList.length})`);
        if (await createLobby(lobby, signal, !allowed.includes(lobby.lobbyID))) infoUpdated = true;
    }
    if (infoUpdated == false && shouldUpdate) hideShow(true);
}
function waitForFriendsFetch() {
    (0, _settingsJs.setFriendsInLobby)(inLobby);
    window.removeEventListener("onfriendslistfetched", waitForFriendsFetch);
}
async function refreshButton(date) {
    if (refreshing) return;
    const seconds = Math.round((Date.now() - date) / 1000);
    const button = document.getElementById("refreshButton");
    if (seconds >= refreshInterval) {
        button.disabled = false;
        button.classList.remove("blocked");
        setContent(button, "Refresh");
        if (!refreshing) autoRefresh();
    } else {
        button.disabled = true;
        if (button.classList.contains("inProgress")) {
            button.classList.remove("blocked");
            setContent(button, "Refresh");
        } else {
            button.classList.add("blocked");
            setContent(button, `Refresh (${refreshInterval - seconds})`);
        }
    }
}
async function autoRefresh() {
    if (!document.hidden && document.hasFocus() && isToggleChecked("autoRefresh") && fullyLoaded && !refreshing && Date.now() - lastRefresh > 1500) {
        console.log("[Auto Refresh] Creating lobbies");
        lastRefresh = Date.now();
        await fetchAndCreateLobbies();
    }
}
async function createLobby(lobby, signal, hidden) {
    const date = Date.now();
    if (!lobby || !lobby.lobbyID || lobby.lobbyID == 0) {
        console.log("%c > Invalid lobby, cannot create", "color: #f00");
        return false;
    }
    console.log(` > Creating lobby %c${lobby.lobbyID}`, "color: #0f0");
    let infoUpdated = false;
    const lobbies = document.getElementById("lobbies");
    const copy = document.getElementById("lobbyToCopy");
    let lobbyElem = copy.cloneNode(true);
    lobbyElem.removeAttribute("id");
    let _friends = [];
    let friendsTooltip = "";
    if (lobby.privacy == 2) friendsTooltip = "[Friends Only]<br />";
    lobby.playerList.players.forEach((y)=>{
        if (friendIDs.some((x)=>String(y.platformID) == String(x))) {
            _friends.push(String(y.platformID));
            const n = getName(y).name.trim();
            friendsTooltip += `<p class="playerTooltip">${n}</p>`;
        }
    });
    if (isToggleChecked("highlightFriends")) lobbyElem.setAttribute("hasFriend", _friends.length > 0);
    if (_friends.length > 0) {
        const friendsElem = lobbyElem.getElementsByClassName("lobbyFriends")[0];
        if (friendsElem) {
            friendsElem.classList.remove("hidden");
            if (lobby.privacy == 2) friendsElem.getElementsByClassName("textIcon")[0].className = "textIcon fas fa-user-lock";
            setContent(friendsElem, _friends.length);
            createToolTip(friendsElem, friendsTooltip, "bottom", "100vw");
        }
    }
    lobbyElem.setAttribute("platform", lobby.lobbyPlatform);
    const icon = lobbyElem.getElementsByClassName("platformIcon")[0];
    icon.className = "";
    icon.classList.add("platformIcon");
    if (lobby.lobbyPlatform == "Steam") {
        icon.classList.add("fa-brands");
        icon.classList.add("fa-steam");
    } else {
        icon.classList.add("fa-custom");
        icon.classList.add("fa-epicgames");
    }
    createToolTip(icon, `ID: ${lobby.lobbyID}`);
    const levelTitle = lobbyElem.getElementsByClassName("levelTitle")[0];
    function verifyNSFW(x) {
        if (thumb1.nsfw == true && isToggleChecked("hideNSFWLobbies")) {
            hidden = true;
            lobbyElem.setAttribute("filteredout", true);
        }
        censorModTitle(levelTitle, lobby.levelModID, lobby.levelTitle, x.nsfw);
    }
    const thumb1 = setThumbnail(lobbyElem.getElementsByClassName("lobbyThumbnail")[0], lobby.levelModID, lobby.levelTitle, lobby.levelBarcode, false);
    thumb1.then(verifyNSFW);
    if (infoView != -1 && infoView == lobby.lobbyID) {
        infoUpdated = true;
        if (signal?.signal?.aborted != true) displayInfo(lobby, new AbortController());
    }
    lobbyElem.setAttribute("lobbyId", lobby.lobbyID);
    const lobbyName = lobbyElem.getElementsByClassName("lobbyName")[0];
    lobbyObserver.observe(lobbyName);
    lobbyName.innerHTML = convert(getLobbyName(lobby, false));
    const player = lobby.playerList.players.find((val)=>val.platformID == lobby.lobbyID);
    let name;
    if (player) name = getName(player).name;
    else name = convert(lobby.lobbyHostName);
    const hostName = lobbyElem.getElementsByClassName("lobbyHostName")[0];
    setContent(hostName, name);
    if (!hidden) censorModTitle(levelTitle, lobby.levelModID, lobby.levelTitle, thumb1.nsfw);
    const gamemode = lobbyElem.getElementsByClassName("gamemodeTitle")[0];
    const g = (0, _constJs.gamemodes).find((x)=>x.barcode == lobby.gamemodeBarcode);
    const gIcon = gamemode.getElementsByClassName("textIcon")[0];
    if (g) {
        const iconElem = (0, _settingsJs.getIconElem)(g.icon);
        gIcon.remove();
        gamemode.insertBefore(iconElem, gamemode.firstChild);
    } else gIcon.setAttribute("class", "fas fa-puzzle-piece textIcon");
    setContent(gamemode, lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode ? convert(lobby.gamemodeTitle) : "Sandbox");
    const playerCount = lobbyElem.getElementsByClassName("lobbyPlayerCount")[0];
    const connectBtn = lobbyElem.getElementsByClassName("connect")[0];
    setContent(playerCount, `(${lobby.playerCount}/${lobby.maxPlayers})`);
    if (lobby.playerCount >= lobby.maxPlayers) {
        playerCount.classList.add("fullLobby");
        connectBtn.classList.add("blocked");
        connectBtn.disabled = true;
    } else {
        playerCount.classList.add("availableLobby");
        connectBtn.classList.remove("blocked");
        connectBtn.disabled = false;
    }
    let tooltip = "";
    const players = structuredClone(lobby.playerList.players);
    players.sort((first, second)=>{
        if (second.platformID == lobby.lobbyID) return 100;
        if (first.platformID == lobby.lobbyID) return -100;
        return parseInt(second.permissionLevel) - parseInt(first.permissionLevel);
    });
    for (const p of players){
        const n = getName(p).name.trim();
        tooltip += `<p class="playerTooltip">${n}</p>`;
    }
    createToolTip(playerCount, tooltip, "bottom", "100vw");
    joinInfo(connectBtn);
    const infoBtn = lobbyElem.getElementsByClassName("infoButton")[0];
    connectBtn.onclick = async ()=>await onConnect(connectBtn, lobby);
    infoBtn.onclick = async ()=>{
        infoView = lobby.lobbyID;
        enableInfoButton(false);
        const iSignal = new AbortController();
        try {
            await displayInfo(lobby, iSignal);
        } finally{
            enableInfoButton(true);
        }
    };
    if (showingInfo) setButton(infoBtn, false);
    lobbyElem.setAttribute("filteredout", hidden);
    lobbies.appendChild(lobbyElem);
    const time = (Date.now() - date) / 1000;
    console.log(` > Created lobby %c${lobby.lobbyID}%c (${time.toFixed(4)}s)`, "color: #0f0", "color: #0ff");
    return infoUpdated;
}
function isEllipsisActive(e) {
    return e.clientHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
}
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
function getName(player) {
    let hasNickname = player.nickname != "" && player.nickname;
    let name = hasNickname ? player.nickname : player.username;
    if (!player.nickname && !player.username) name = "N/A";
    else if (hasNickname && (0, _unityRichTextJs.Converter).removeRichText(player.username) == (0, _unityRichTextJs.Converter).removeRichText(player.nickname)) hasNickname = false;
    if (name.includes("\n")) name = name.split("\n")[0];
    return {
        name: convert(name),
        hasNickName: hasNickname
    };
}
function setButton(btn, enabled) {
    btn.blocked = !enabled;
    if (enabled) btn.classList.remove("inProgress");
    else btn.classList.add("inProgress");
}
function enableInfoButton(enabled) {
    const lobbies = document.getElementById("lobbies");
    for (const lobby of lobbies.children){
        const btns = lobby.getElementsByClassName("infoButton");
        if (btns && btns.length > 0) setButton(btns[0], enabled);
    }
}
async function displayInfo(lobby, signal) {
    if (infoSignal) infoSignal.abort();
    showingInfo = true;
    try {
        const start = Date.now();
        console.log(` > Displaying more info for %c${lobby.lobbyID}`, "color: #0f0");
        infoSignal = signal;
        infoView = lobby.lobbyID;
        hideShow(false);
        const content = document.getElementById("info-content");
        const right = content.getElementsByClassName("right-content")[0];
        const left = content.getElementsByClassName("left-content")[0];
        const thumb1 = left.getElementsByClassName("thumbnail")[0];
        const description = right.getElementsByClassName("lobbyDescription")[0];
        let _thumbnail;
        function verifyNSFW(x) {
            _thumbnail = x;
            censorModTitle(header.getElementsByClassName("level")[0], lobby.levelModID, lobby.levelTitle, x.nsfw);
        }
        const thumbnail = setThumbnail(thumb1, lobby.levelModID, lobby.levelTitle, lobby.levelBarcode, false);
        thumbnail.then(verifyNSFW);
        const lobbyInfo = document.getElementById("info");
        lobbyInfo.setAttribute("uptime", Number(lobby.lobbyUptime));
        const header = lobbyInfo.getElementsByClassName("header")[0];
        document.getElementById("info-title").innerHTML = convert(getLobbyName(lobby, false));
        setContent(header.getElementsByClassName("version")[0], `v${lobby.lobbyVersion}`);
        censorModTitle(header.getElementsByClassName("level")[0], lobby.levelModID, lobby.levelTitle, _thumbnail?.nsfw ?? false);
        const gamemode = header.getElementsByClassName("gamemode")[0];
        const icon = gamemode.getElementsByTagName("i");
        if (icon && icon.length > 0) icon.item(0).remove();
        const g = (0, _constJs.gamemodes).find((x)=>x.barcode == lobby.gamemodeBarcode);
        const iconElem = (0, _settingsJs.getIconElem)(g && g.icon ? g.icon : "fas fa-puzzle-piece");
        gamemode.insertBefore(iconElem, gamemode.firstChild);
        const platform = header.getElementsByClassName("platform")[0];
        const platformIcon = platform.getElementsByTagName("i")[0];
        platformIcon.className = "";
        platformIcon.classList.add("textIcon");
        if (lobby.lobbyPlatform == "Steam") {
            platformIcon.classList.add("fa-brands");
            platformIcon.classList.add("fa-steam");
        } else {
            platformIcon.classList.add("fa-custom");
            platformIcon.classList.add("fa-epicgames");
        }
        setContent(platform, lobby.lobbyPlatform == "Steam" ? "Steam" : "Epic Games");
        setContent(gamemode, lobby.gamemodeBarcode != "" && lobby.gamemodeBarcode ? convert(lobby.gamemodeTitle) : "Sandbox");
        const connectBtn = document.getElementById("info-connect");
        connectBtn.onclick = async ()=>await onConnect(connectBtn, lobby);
        if (lobby.playerCount >= lobby.maxPlayers) {
            connectBtn.classList.add("blocked");
            connectBtn.disabled = true;
        } else {
            connectBtn.classList.remove("blocked");
            connectBtn.disabled = false;
        }
        description.innerHTML = convert((lobby.lobbyDescription != "" ? lobby.lobbyDescription : "No description provided").replaceAll("\n", "<br>"));
        const discord = await (0, _discordJsDefault.default)(lobby.lobbyDescription ?? "N/A");
        const permissionLevels = right.getElementsByClassName("permissionsLevels")[0];
        const permissionList = right.getElementsByClassName("permissionsList")[0];
        permissionLevels.replaceChildren();
        permissionList.replaceChildren();
        const perms = new Map((0, _constJs.permissions));
        perms.forEach((val)=>{
            const item = document.createElement("p");
            item.classList.add(`permission-${val}`);
            item.classList.add("permissionLevel");
            item.textContent = val.toUpperCase();
            permissionLevels.appendChild(item);
        });
        (0, _constJs.permsList).forEach((val)=>{
            let displayName = val.name ?? String(val.entry).charAt(0).toUpperCase() + String(val.entry).slice(1);
            const item = document.createElement("p");
            const level = perms.get(lobby[val.entry]);
            item.classList.add(`permission-${level}`);
            item.classList.add("permissionItem");
            if (val.icon) {
                const icon = (0, _settingsJs.getIconElem)(val.icon);
                item.appendChild(icon);
                const cont = document.createElement("span");
                cont.classList.add("elemContent");
                cont.textContent = displayName;
                item.appendChild(cont);
            } else item.textContent = displayName;
            permissionList.appendChild(item);
        });
        if (discord) {
            let discordElem = right.getElementsByClassName("discordElem")?.item(0);
            if (!discordElem) {
                const info = document.createElement("p");
                info.classList.add("discordElem");
                right.appendChild(info);
                discordElem = info;
            }
            discordElem.replaceChildren();
            discordElem.appendChild(discord);
        } else {
            let discordElem = right.getElementsByClassName("discordElem")?.item(0);
            let discordTitle = right.getElementsByClassName("discordTitle")?.item(0);
            if (discordElem) right.removeChild(discordElem);
            if (discordTitle) right.removeChild(discordTitle);
        }
        const plrCount = lobbyInfo.getElementsByClassName("plrCount")[0];
        plrCount.textContent = `(${lobby.playerCount}/${lobby.maxPlayers})`;
        if (lobby.playerCount >= lobby.maxPlayers) plrCount.classList.add("fullLobby");
        else plrCount.classList.add("availableLobby");
        const playersList = document.getElementById("info-players");
        playersList.replaceChildren();
        const players = lobby.playerList.players;
        players.sort((first, second)=>{
            if (second.platformID == lobby.lobbyID) return 100;
            if (first.platformID == lobby.lobbyID) return -100;
            return parseInt(second.permissionLevel) - parseInt(first.permissionLevel);
        });
        for (const player of players){
            const plrStart = Date.now();
            if ((!player.username || player.username == "") && (!player.nickname || player.nickname == "")) continue;
            if (signal?.signal?.aborted == true) break;
            console.log(`  > Creating player %c${player.platformID}`, "color: #0f0");
            const toCopy = document.getElementById("playerToCopy");
            const playerElem = toCopy.cloneNode(true);
            playerElem.removeAttribute("id");
            let avatar = player.avatarTitle && player.avatarTitle != "" ? convert(player.avatarTitle) : "N/A";
            const avatarTitle = playerElem.getElementsByClassName("avatarTitle")[0];
            let thumbRes;
            function verifyNSFW1(x) {
                thumbRes = x;
                censorModTitle(avatarTitle, player.avatarModID, avatar, thumb1.nsfw);
            }
            const thumb1 = setThumbnail(playerElem.getElementsByClassName("avatarThumbnail")[0], player.avatarModID, player.avatarTitle, player.avatarTitle, true);
            thumb1.then(verifyNSFW1);
            const name = getName(player);
            const nameElem = playerElem.getElementsByClassName("name")[0];
            nameElem.innerHTML = convert(name.name);
            const perms = colorPermission(player.permissionLevel);
            const permsElem = playerElem.getElementsByClassName("permissions")[0];
            permsElem.classList.add(perms.class);
            setContent(permsElem, perms.text);
            if (player.platformID == lobby.lobbyID) {
                const icon = permsElem.getElementsByClassName("textIcon")[0];
                icon.setAttribute("class", "fas fa-crown textIcon");
            }
            playerElem.getElementsByClassName("profile")[0].addEventListener("click", async ()=>{
                const html = await createPlayerView(player, thumbRes, lobby.lobbyPlatform);
                Swal.fire({
                    title: "",
                    html: html,
                    showCloseButton: true,
                    showDenyButton: true,
                    focusConfirm: false,
                    confirmButtonText: '<i class="fas fa-x"></i> Close',
                    denyButtonText: '<i class="fas fa-flag"></i> Report',
                    theme: adjustTheme(),
                    width: "30em"
                }).then((x)=>{
                    if (x.isDenied) window.open(`https://docs.google.com/forms/d/e/1FAIpQLScGK73O2jhOQOXtfHFahOrMZeuVfjYlKbdDPupaifjLGG_QMA/viewform?entry.1722663242=${(0, _unityRichTextJs.Converter).removeRichText(player.username)}&entry.1219785058=${player.platformID}`);
                });
            });
            playerObserver.observe(avatarTitle);
            avatarTitle.innerHTML = avatar;
            playerElem.setAttribute("playerId", player.platformID);
            if (signal?.signal?.aborted == true) break;
            playersList.appendChild(playerElem);
            const time = (Date.now() - plrStart) / 1000;
            console.log(`  > Created player %c${player.platformID}%c (${time.toFixed(4)}s)`, "color: #0f0", "color: #0ff");
        }
        playersList.childNodes.forEach((x)=>{
            if (x.tagName.toLowerCase() == "div" && !x.hasAttribute("playerId")) x.remove();
        });
        playersList.childNodes.forEach((x)=>{
            if (x.tagName.toLowerCase() == "div") x.classList.remove("hidden");
        });
        lobbyInfo.setAttribute("lobbyId", lobby.lobbyID);
        lobbyInfo.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        const time = (Date.now() - start) / 1000;
        console.log(` > Displayed more info for %c${lobby.lobbyID}%c (${time.toFixed(4)}s)`, "color: #0f0", "color: #0ff");
    } catch (ex) {
        console.error("An error has occurred while trying to display info!");
        console.error(ex);
        hideShow(true, true);
        Swal.fire({
            title: "Something broke!",
            html: 'An error has occurred while trying to display info for the lobby! If the error persists, contact the developer (check on FAQ page!). If possible, <a class="modLink" href="https://balsamiq.com/support/troubleshooting-faqs/browser-console/" target="_blank" rel="noopener noreferrer">provide the error from the console</a>. <br /> Error: ' + (0, _dompurifyDefault.default).sanitize(ex),
            icon: "error",
            toast: true,
            position: "bottom-end",
            width: "30em",
            theme: adjustTheme(),
            showCloseButton: true,
            showConfirmButton: false
        });
    } finally{
        showingInfo = false;
        enableInfoButton(true);
    }
}
async function createPlayerView(player, thumbnail, platform) {
    const toCopy = document.getElementById("playerViewToCopy");
    const view = toCopy.cloneNode(true);
    view.removeAttribute("id");
    const name = getName(player);
    if (thumbnail && thumbnail.thumbnail && thumbnail.alt) {
        const thumb1 = view.getElementsByClassName("viewThumbnail")[0];
        thumb1.src = thumbnail.thumbnail;
        thumb1.alt = thumbnail.alt;
    } else thumb.classList.add("hidden");
    const spinner = view.getElementsByClassName("thumbnailSpinner")[0];
    spinner.classList.add("hidden");
    view.getElementsByClassName("playerDisplayName")[0].innerHTML = convert(name.name);
    view.getElementsByClassName("playerUsername")[0].innerHTML = convert(player.username ?? "N/A");
    let avatar = player.avatarTitle && player.avatarTitle != "" ? convert(player.avatarTitle) : "N/A";
    censorModTitle(view.getElementsByClassName("playerAvatar")[0], player.avatarModID, avatar, thumbnail.nsfw);
    view.getElementsByClassName("playerId")[0].textContent = `(${player.platformID})`;
    view.getElementsByClassName("playerDescription")[0].innerHTML = convert((player.description != "" ? player.description : "No description provided").replaceAll("\n", "<br>"));
    if (platform == "Steam") {
        const req = await (0, _steamJs.getProfile)(player.platformID);
        if (req && !req.error) {
            const avatar = view.getElementsByClassName("steamAvatar")[0];
            avatar.setAttribute("src", req.avatarFullUrl);
            const indicator = view.getElementsByClassName("statusIndicator")[0];
            indicator.setAttribute("class", `statusIndicator status${req.userStatus}`);
            const numToStatus = new Map((0, _constJs.statuses));
            const status = numToStatus.get(req.userStatus);
            if (status) indicator.setAttribute("data-tippy-content", status);
            const username = view.getElementsByClassName("steamUsername")[0];
            username.href = req.profileUrl;
            setContent(username, convert(req.nickname));
            if (req.countryCode) username.getElementsByClassName("textIcon")[0].setAttribute("class", `fi fi-${req.countryCode.toLowerCase()}`);
            else username.getElementsByClassName("textIcon")[0].classList.add("hidden");
            if (req.accountCreatedDate && req.profileVisibility == 3) {
                const date = new Date(req.accountCreatedDate);
                var yyyy = date.getFullYear();
                var mm = date.getMonth() + 1;
                var dd = date.getDate();
                view.getElementsByClassName("steamAdditionalInfo")[0].textContent = `Created on: ${dd}-${mm}-${yyyy}`;
            } else view.getElementsByClassName("steamAdditionalInfo")[0].classList.add("hidden");
        }
    } else {
        view.getElementsByClassName("steamProfile")[0].classList.add("hidden");
        view.getElementsByClassName("steamDetail")[0].classList.add("hidden");
    }
    const html = view.outerHTML;
    view.remove();
    return html;
}
function censorModTitle(elem, modId, title, nsfw, usesIcon = true) {
    if (nsfw && isToggleChecked("censorNSFW")) {
        if (usesIcon) setContent(elem, "[NSFW]");
        else elem.textContent = "[NSFW]";
        elem.classList.add("filterNSFW");
    } else if (usesIcon) setContent(elem, modRedirect(modId, title));
    else elem.innerHTML = modRedirect(modId, title);
}
function lobbyNotice(title, description, icon = "fas fa-xmark", colorVariable = "--flb-gray-color", removeLobbies = true) {
    const lobbies = document.getElementById("lobbies");
    const notices = lobbies.getElementsByClassName("notice");
    if (removeLobbies) lobbies.replaceChildren();
    if (notices && notices.length > 0) for (const n of notices)n.remove();
    const toCopy = document.getElementById("noticeToCopy");
    const notice = toCopy.cloneNode(true);
    notice.removeAttribute("id");
    const _icon = notice.getElementsByClassName("noticeIcon")[0];
    const _title = notice.getElementsByClassName("noticeTitle")[0];
    const _description = notice.getElementsByClassName("noticeDescription")[0];
    const classes = icon.split(" ");
    classes.forEach((x)=>_icon.classList.add(x));
    _title.textContent = title;
    _description.innerHTML = description;
    notice.style.color = `var(${colorVariable})`;
    lobbies.appendChild(notice);
}
async function isServerOnline() {
    try {
        const res = await fetch(HOST);
        return res.ok;
    } catch (ex) {
        console.error(ex);
        return false;
    }
}
function colorPermission(perm) {
    let name = "default";
    const mapped = new Map((0, _constJs.permissions)).get(perm);
    if (mapped) name = mapped;
    return {
        class: `permission-${name.toLowerCase()}`,
        text: name.toUpperCase()
    };
}
function convert(text) {
    return (0, _dompurifyDefault.default).sanitize(converter.unity2html(text));
}
// DOES NOT sanitize!!!
function setContent(elem, content) {
    const contents = elem.getElementsByClassName("elemContent");
    if (contents && contents.length > 0) {
        const span = contents[0];
        if (span) {
            span.innerHTML = content;
            return;
        }
    }
    elem.innerHTML = content;
}
function hideShow(hide, removeView = true) {
    const elements = [
        "#info",
        "#info-outer",
        "#info-content",
        ".playersTitle",
        "#info-players"
    ];
    elements.forEach((match)=>{
        const elem = document.querySelector(match);
        if (elem) {
            if (hide) elem.classList.add("hidden");
            else elem.classList.remove("hidden");
        }
    });
    const header = document.getElementsByTagName("header")[0];
    if (!hide) header.classList.add("header-infoOpened");
    else header.classList.remove("header-infoOpened");
    const lobbyInfo = document.getElementById("info");
    if (hide) {
        lobbyInfo.removeAttribute("lobbyId");
        if (removeView) infoView = -1;
    }
    setURLParams();
}
function setURLParams() {
    const url = new URL(window.location.href);
    if (infoView != -1) url.searchParams.set(LOBBY_PARAM, infoView);
    else url.searchParams.delete(LOBBY_PARAM);
    if (url.searchParams.size <= 0) url.searchParams.forEach((_, key)=>url.searchParams.delete(key));
    window.history.pushState(null, "", url.toString());
}
let processed = [];
async function getThumbnail(modId, title, barcode, isAvatar) {
    while(processed.some((x)=>x.modId == modId || x.barcode == barcode))await delay(50);
    const obj = {
        modId: modId,
        barcode: barcode
    };
    processed.push(obj);
    if (modId == -1 || modId == 0 || modId == null) {
        const value = (0, _constJs.barcodes).find((x)=>x.barcode == barcode || barcode?.startsWith(x.name) == true || x.name == barcode);
        if (value) {
            const index = processed.indexOf(obj);
            if (index > -1) processed.splice(index, 1);
            return {
                thumbnail: _webp[`${value.name}.webp`],
                alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
                nsfw: false
            };
        }
    }
    try {
        const cacheItem = thumbnailCache[`${barcode}`];
        if (cacheItem && cacheItem.src && cacheItem.createdAt && Date.now() / 1000 - cacheItem.createdAt < cacheExpireTime) {
            const index = processed.indexOf(obj);
            if (index > -1) processed.splice(index, 1);
            return {
                thumbnail: cacheItem.src,
                alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
                nsfw: cacheItem.isNSFW
            };
        }
        const response = await fetch(THUMBNAIL.replace("[host]", HOST).replace("[modId]", modId).replace("[barcode]", barcode));
        if (!response.ok) {
            const index = processed.indexOf(obj);
            if (index > -1) processed.splice(index, 1);
            return {
                error: await response.text(),
                status: response.status
            };
        }
        const res = {
            thumbnail: URL.createObjectURL(await response.blob()),
            alt: `The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'`,
            nsfw: response.headers.get("modio-maturity") == "nsfw" ? true : false
        };
        thumbnailCache[`${barcode}`] = {
            src: res.thumbnail,
            isNSFW: res.nsfw,
            createdAt: Date.now() / 1000
        };
        const index = processed.indexOf(obj);
        if (index > -1) processed.splice(index, 1);
        return res;
    } catch (ex) {
        console.error(ex);
        const index = processed.indexOf(obj);
        if (index > -1) processed.splice(index, 1);
        return {
            error: "Failed to get thumbnail due to the request failing, check console for more details"
        };
    }
}
function delay(millisec) {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve("");
        }, millisec);
    });
}
async function setThumbnail(elem, modId, title, barcode, isAvatar) {
    const spinners = elem.parentElement.getElementsByClassName("thumbnailSpinner");
    let spinner;
    if (spinners && spinners.length > 0) spinner = spinners[0];
    elem.setAttribute("fetchpriority", "high");
    elem.addEventListener("error", function() {
        const alt = (0, _unityRichTextJs.Converter).removeRichText(`The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. An error occurred while loading, so an error was displayed instead`);
        elem.setAttribute("src", require("32227dca7f54e9e4"));
        elem.setAttribute("alt", alt);
    });
    var thumbnail = await getThumbnail(modId, title, barcode, isAvatar);
    if (thumbnail.error != null) {
        if (thumbnail.status == 404) {
            const alt = (0, _unityRichTextJs.Converter).removeRichText(`The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. The thumbnail was not found, so a placeholder was displayed instead`);
            spinner?.classList?.add("hidden");
            elem.setAttribute("src", require("220982f4abd779f3"));
            elem.setAttribute("alt", alt);
            return {
                thumbnail: require("220982f4abd779f3"),
                alt: alt,
                nsfw: false
            };
        }
        const alt = (0, _unityRichTextJs.Converter).removeRichText(`The thumbnail of ${isAvatar ? "an avatar" : "a level"} titled '${title}'. An error occurred while loading, so an error was displayed instead`);
        spinner?.classList?.add("hidden");
        elem.setAttribute("src", require("32227dca7f54e9e4"));
        elem.setAttribute("alt", alt);
        return {
            thumbnail: require("32227dca7f54e9e4"),
            alt: alt,
            nsfw: false
        };
    } else if (thumbnail.nsfw == true && isToggleChecked("censorNSFW")) {
        const alt = (0, _unityRichTextJs.Converter).removeRichText(`The thumbnail of ${isAvatar ? "an avatar" : "a level"}. The thumbnail and name was censored as it is an NSFW one.`);
        spinner?.classList?.add("hidden");
        elem.setAttribute("src", require("1dd7e82faaf19604"));
        elem.setAttribute("alt", alt);
        return {
            thumbnail: require("1dd7e82faaf19604"),
            alt: alt,
            nsfw: true
        };
    } else {
        spinner?.classList?.add("hidden");
        elem.setAttribute("src", thumbnail.thumbnail);
        elem.setAttribute("alt", (0, _unityRichTextJs.Converter).removeRichText(thumbnail.alt));
        return thumbnail;
    }
}
function modRedirect(id, name) {
    if (id == -1) return name;
    return `<a class="levelRedirect" href="https://mod.io/search/mods/${id}" target="_blank" rel="noopener noreferrer"">${convert(name)}</a>`;
}
function setLobbyCount(count, max) {
    const elem = document.getElementsByClassName("lobbyTitle")[0];
    if (count == -1) elem.textContent = "Lobbies (0)";
    else if (count == max) elem.textContent = `Lobbies (${count})`;
    else elem.textContent = `Lobbies (${count}/${max})`;
}
async function onConnect(elem, lobby) {
    setButton(elem, false);
    elem.getElementsByClassName("textIcon")[0].classList.add("fa-bounce");
    try {
        await requestJoin(lobby.lobbyCode, lobby.lobbyPlatform);
    } finally{
        setButton(elem, true);
        elem.getElementsByClassName("textIcon")[0].classList.remove("fa-bounce");
    }
}
function setPlayerCount(filteredPlayers, allPlayers) {
    const playerCount = document.getElementById("playerCount");
    if (filteredPlayers == allPlayers) playerCount.textContent = filteredPlayers;
    else playerCount.textContent = `${filteredPlayers}/${allPlayers}`;
}
async function getJSON() {
    try {
        const response = await fetch(LOBBY_LIST.replace("[host]", HOST), {
            credentials: "include"
        });
        if (!response.ok) return {
            error: await response.json()
        };
        return {
            res: await response.json(),
            uptime: response.headers.get("server-uptime")
        };
    } catch (ex) {
        console.error(ex);
        return {
            error: "Failed to get lobbies due to the request failing, check console for more details"
        };
    }
}
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
const timeRanges = {
    years: {
        min: 31536000,
        symbol: "y"
    },
    months: {
        min: 2592000,
        symbol: "m"
    },
    weeks: {
        min: 604800,
        symbol: "w"
    },
    days: {
        min: 86400,
        symbol: "d"
    },
    hours: {
        min: 3600,
        symbol: "h"
    },
    minutes: {
        min: 60,
        symbol: " min"
    },
    seconds: {
        min: 1,
        symbol: "s"
    }
};
function timeAgo(input) {
    const date = input instanceof Date ? input : new Date(input);
    const formatter = new Intl.RelativeTimeFormat("en");
    const secondsElapsed = (date.getTime() - Date.now()) / 1000;
    for(let key in timeRanges)if (timeRanges[key].min < Math.abs(secondsElapsed)) {
        const delta = secondsElapsed / timeRanges[key].min;
        return formatter.format(Math.round(delta), key);
    }
    // Handle times less than 1 second ago
    return formatter.format(-2, "seconds").replace("2", "0");
}
function timePassed(input, returnAfterFirst = true) {
    const date = input instanceof Date ? input : new Date(input);
    let time = Date.now() / 1000 - date;
    let string;
    for(let key in timeRanges)if (timeRanges[key].min < Math.abs(time)) {
        const val = time / timeRanges[key].min;
        time = time % timeRanges[key].min;
        const str = `${returnAfterFirst ? Math.round(val) : Math.floor(val)}${timeRanges[key].symbol}`;
        if (returnAfterFirst) return str;
        else if (!string) string = str;
        else string += ` ${str}`;
    }
    return string ?? "0s";
}
function isToggleChecked(id) {
    return (0, _settingsJs.getSettingValue)(id) == true || (0, _settingsJs.getSettingValue)(id) == "true";
}
function getAllowedIDs(lobbies) {
    let list = [];
    var filtered = (0, _settingsJs.filterWithSettings)(structuredClone(lobbies));
    filterBadges();
    filtered.forEach((x)=>list.push(x.lobbyID));
    return list;
}
function hideLobbies(changeElem = true) {
    if (!allLobbies) return;
    let list = getAllowedIDs(allLobbies);
    var lobbies = document.getElementById("lobbies").children;
    if (changeElem) for (const i of lobbies)i.setAttribute("filteredout", !list.includes(i.getAttribute("lobbyId")));
    const notice = document.getElementById("lobbies").getElementsByClassName("notice");
    if (list.length > 0 && notice.length > 0) notice[0].remove();
    else if (list.length == 0 && notice.length == 0) lobbyNotice("All Lobbies Filtered Out", "Seems like you set the wrong filters!", "fas fa-face-frown", "--flb-gray-color", false);
    return list;
}
async function updateFilters() {
    if (!allLobbies) return;
    let lobbyCountMax = allLobbies.length;
    let lobbies = hideLobbies();
    setLobbyCount(lobbies, lobbyCountMax);
    let players = 0;
    let allPlayers = 0;
    allLobbies.forEach((val)=>{
        allPlayers += Number(val.playerCount);
        if (lobbies.includes(val.lobbyID)) players += Number(val.playerCount);
    });
    setLobbyCount(lobbies.length, lobbyCountMax);
    setPlayerCount(players, allPlayers);
    filterBadges();
}
function filterEvent(id, redo = false) {
    if (!id) return;
    (0, _settingsJs.addEventListener)(id, async (val)=>{
        filterBadges();
        if (redo) {
            console.log("[Filters] Creating lobbies");
            if (fullyLoaded && !refreshing) {
                if (lobbiesSignal) lobbiesSignal.abort();
                const controller = new AbortController();
                lobbiesSignal = controller;
                await createLobbies(controller?.signal);
            }
        } else await updateFilters();
    });
}
function settingsEvent() {
    window.addEventListener("onsettingchanged", async (ev)=>{
        if (ev.detail && ev.detail.id) {
            const setting = (0, _settingsJs.getSetting)(ev.detail.id);
            if (!setting) return;
            if (setting.lobbyFilter) {
                filterBadges();
                await updateFilters();
            }
        }
    });
}
function collapsableMenus() {
    const menus = document.querySelectorAll('[data-toggle="collapse"]');
    for (const menu of menus)menu.addEventListener("click", ()=>{
        menu.classList.toggle("collapsed");
    });
}
document.getElementById("javascriptRequired").classList.add("hidden");
adjustTheme();
if (document.readyState !== "loading") init();
else window.addEventListener("DOMContentLoaded", init);
window.addEventListener("displayInfo", async (e)=>{
    if (e.detail && e.detail.lobbyID) {
        const lobby = allLobbies.find((x)=>String(x.lobbyID) == String(e.detail.lobbyID));
        if (lobby) {
            infoView = lobby.lobbyID;
            const iSignal = new AbortController();
            enableInfoButton(false);
            try {
                await displayInfo(lobby, iSignal);
            } finally{
                enableInfoButton(true);
            }
        }
    }
});
async function init() {
    adjustTheme();
    console.log("Window has been loaded");
    document.getElementById("javascriptRequired").classList.add("hidden");
    createGamemodes();
    (0, _settingsJs.init)();
    (0, _settingsJs.addEventListener)("theme", adjustTheme);
    const params = new URLSearchParams(window.location.search);
    if (params.has(LOBBY_PARAM)) {
        const num = params.get(LOBBY_PARAM);
        if (num) infoView = num;
    }
    if (window.location.hostname == "hoodrp.com" || window.location.hostname == "www.hoodrp.com" || SIMULATE_HOODRP) activateHoodRpMode();
    else if (window.location.hostname == "localhost:5500" || window.location.hostname == "localhost") HOST = "https://localhost:7073/";
    collapsableMenus();
    // Do not require lobby list to be created again
    settingsEvent();
    // Require the lobby list to be created again
    filterEvent("prioritizeLobbiesWithFriends", true);
    filterEvent("prioritizeFriendsOnlyLobbies", true);
    filterEvent("highlightFriends", true);
    filterEvent("censorNSFW", true);
    filterEvent("sort", true);
    filterEvent("sortOrder", true);
    filterEvent("hideNSFWLobbies", true);
    clickEvent("refreshButton", async ()=>await fetchAndCreateLobbies());
    clickEvent("info-close", ()=>hideShow(true));
    clickEvent("settingsButton", openSettings);
    clickEvent("settingsClose", closeSettings);
    clickEvent("hotak0CurseButton", initCurse);
    joinInfo(document.getElementById("info-connect"));
    uptimeContainer = document.querySelector(".uptime-container");
    uptimeContent = document.querySelector(".uptime-content");
    (0, _tippyJsDefault.default)(document.getElementById("info").getElementsByClassName("uptime")[0], {
        content: uptimeContainer,
        animation: "scale",
        appendTo: "parent",
        interactive: true,
        placement: "bottom",
        allowHTML: true,
        theme: "website",
        onShow: ()=>{
            uptimeContainer.appendChild(uptimeContent);
        },
        onHidden: ()=>{
            document.getElementById("info-header").appendChild(uptimeContent);
        }
    });
    const lucky = Math.round(7.3);
    const getRandomNumber = (min, max)=>{
        return Math.random() * (max - min) + min;
    };
    // fuck you
    const r = Math.round(getRandomNumber(1, 25));
    if (r == lucky) document.getElementById("hotak0CurseButton").classList.remove("hidden");
    updateTime();
    console.log("[Init] Creating lobbies");
    fullyLoaded = true;
    fetchAndCreateLobbies();
}
function onResize() {
    if (oldSize.width < 850 && window.innerWidth >= 850) {
        document.getElementById("popupBackground").classList.add("hidden");
        document.getElementById("settings").classList.remove("open");
    }
    oldSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };
}
function createGamemodes() {
    for (const g of (0, _constJs.gamemodes))(0, _settingsJs.addSetting)({
        id: `gamemode_${!g.barcode || g.barcode == "" ? "Lakatrazz.Sandbox" : g.barcode}`,
        category: "Gamemodes",
        type: "filter",
        name: g.title ? (0, _unityRichTextJs.Converter).removeRichText(g.title) : "Sandbox",
        icon: g && g.icon ? g.icon : "fas fa-puzzle-piece",
        lobbyFilter: true,
        filterValue: (s, val)=>val && (val.include || val.exclude),
        lobbyValidator: (lobby)=>{
            return lobby.gamemodeBarcode == g.barcode;
        },
        defaultValue: {
            include: false,
            exclude: false
        },
        storeAsJSON: true
    });
}
function activateHoodRpMode() {
    HOST = "https://api.hoodrp.com/";
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "styles/hoodrp.css";
    document.head.appendChild(link);
}
// i was forced to do this at exactly 00:47:30 AM by an individual that goes by the name Jack Baker
// i do not bear any responsibility for the possible trauma or any other issues
// fuck you jack baker
function initCurse() {
    document.getElementById("yourecursedgoodluck").classList.remove("hidden");
    document.getElementsByClassName("istfg")[0].classList.remove("hidden");
    document.getElementsByTagName("title")[0].textContent = "uh oh you angered the thing!";
    var fuckyouevenmorejackbaker = new Audio("hotak0/sounds/hotak0_ambience.mp3");
    fuckyouevenmorejackbaker.play();
    fuckyouevenmorejackbaker.loop = true;
    looped(fuckyouevenmorejackbaker);
}
async function looped(_audio) {
    while(true){
        var audio = new Audio("hotak0/sounds/youangeredthething.ogg");
        audio.play();
        audio.volume = Math.random();
        _audio.volume = Math.random();
        await new Promise((r)=>setTimeout(r, 500));
    }
}
function joinInfo(btn) {
    createToolTip(btn, 'To join, you must have the <a class="modLink" href="https://github.com/FusionLobbyBrowser/Mod/releases/latest" target="_blank" rel="noopener noreferrer">mod</a> (>= 1.1.0 version) installed and have launched the game at least once since installation');
}
function openSettings() {
    document.getElementById("popupBackground").classList.remove("hidden");
    document.getElementById("settings").classList.add("open");
}
function closeSettings() {
    document.getElementById("popupBackground").classList.add("hidden");
    document.getElementById("settings").classList.remove("open");
}
function clickEvent(id, callback) {
    document.getElementById(id).addEventListener("click", callback);
}
function adjustTheme() {
    const darkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    const isDarkMode = darkMode && darkMode.matches;
    const val = localStorage.getItem(`setting_theme`);
    let v;
    if (!val) v = isDarkMode ? "dark" : "light";
    else v = val == "systemPreference" ? isDarkMode ? "dark" : "light" : val;
    document.getElementsByTagName("html")[0].setAttribute("theme", v);
    return v;
}
async function updateTime() {
    const refresh = document.getElementById("refresh");
    while(true){
        timeAgoElem(refresh);
        const info = document.getElementById("info");
        if (info.hasAttribute("uptime") && uptimeContent) {
            const uptime = info.getElementsByClassName("uptime")[0];
            const t = Number(info.getAttribute("uptime"));
            if (t) {
                setContent(uptime, timePassed(t));
                uptimeContent.innerHTML = (0, _dompurifyDefault.default).sanitize(`${timePassed(t, false)}<br>Discovered: ${new Date(t * 1000).toLocaleString()}`);
            } else {
                setContent(uptime, "N/A");
                uptimeContent.innerHTML = "N/A";
            }
        }
        await refreshButton(new Date(Number(refresh.getAttribute("date"))));
        await new Promise((resolve)=>setTimeout(resolve, 1000));
    }
}
function timeAgoElem(elem, date = null) {
    if (date != null || elem.hasAttribute("date")) {
        const _date = date ?? new Date(Number(elem.getAttribute("date")));
        if (_date) setTimeElem(elem, timeAgo(_date));
    }
}
function setTimeElem(elem, val) {
    if (val == null || val == undefined) val = "N/A";
    elem.textContent = val;
    if (val == "N/A") elem.removeAttribute("date");
}
function timeFromResponse(elem, val) {
    let date = null;
    if (val != null && val != undefined) {
        const num = Number(val) * 1000;
        date = new Date(num);
        elem.setAttribute("date", num);
    }
    timeAgoElem(elem, date);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT","./unityRichText.js":"3L0Tf","./const.js":"jw8vm","./steam.js":"7BUeb","./discord.js":"WErSg","./settings.js":"6zYs7","tippy.js":"7X8ND","tippy.js/dist/tippy.css":"2hEyg","dompurify":"1IHUz","32227dca7f54e9e4":"fQLqg","220982f4abd779f3":"2gmdY","1dd7e82faaf19604":"brBtC","../images/default/*.webp":"P1Pul"}],"WErSg":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>elem);
var _unityRichTextJs = require("./unityRichText.js");
var _tippyJs = require("tippy.js");
var _tippyJsDefault = parcelHelpers.interopDefault(_tippyJs);
var _tippyCss = require("tippy.js/dist/tippy.css");
var _dompurify = require("dompurify");
var _dompurifyDefault = parcelHelpers.interopDefault(_dompurify);
const regex = new RegExp(/(?:https:\/\/discord[\.\,]com\/invite\/|(?<=^|\s)(?:discord)?[\.\,]com\/invite\/|https?:\/\/discord[\.\,]gg\/|(?<=^|\s)(?:discord)?[\.\,]gg\/|Discord(?: Server| Link| Code|):(?: |))(?<code>[a-zA-Z0-9-]+)(?=\s|$)/im);
function getServerIconURL(guildId, id, size = 256, animated = true) {
    return `https://cdn.discordapp.com/icons/${guildId}/${id}.webp?size=${size}&animated=${animated}`;
}
async function getServerInfo(inviteCode) {
    try {
        const res = await fetch(`https://discord.com/api/invite/${inviteCode}?with_counts=true`);
        if (res.ok) {
            const json = res.json();
            return json;
        } else return null;
    } catch (ex) {
        console.error("An unexpected error has occurred while trying to fetch information about Discord server, response: " + ex);
        return null;
    }
}
// This is probably horrible, but hey it works
function formatNumber(num) {
    if (num < 1000) return `${num}`;
    else if (num >= 1000 && num < 1000000) return `${(num / 1000).toFixed(num % 1000 > 0 ? 1 : 0)}k`;
    else if (num >= 1000000) return `${(num / 1000000).toFixed(num % 1000000 > 0 ? 1 : 0)}m`;
}
function createServerElem(obj, code) {
    if (!obj) return null;
    // NSFW Guilds will not appear and there are no plans on adding it, even with it being censored
    if (obj.guild.nsfw == true) return null;
    const toCopy = document.getElementById("discordToCopy");
    const server = toCopy.cloneNode(true);
    server.removeAttribute("id");
    const iconElem = server.getElementsByClassName("serverIcon")[0];
    const serverNameElem = server.getElementsByClassName("serverName")[0];
    const serverDescriptionElem = server.getElementsByClassName("serverDescription")[0];
    const memberCountElem = server.getElementsByClassName("memberCount")[0];
    const joinElem = server.getElementsByClassName("discordJoin")[0];
    iconElem.setAttribute("src", getServerIconURL(obj.guild.id, obj.guild.icon));
    iconElem.setAttribute("alt", `Icon of the discord server named '${obj.guild.name}'`);
    serverNameElem.textContent = obj.guild.name;
    if (obj.guild.description && obj.guild.description != "") {
        createTooltip(serverNameElem, `${obj.guild.name} \u{2022} ${obj.guild.description}`);
        serverDescriptionElem.innerHTML = (0, _dompurifyDefault.default).sanitize(new (0, _unityRichTextJs.Converter)().unity2html(obj.guild.description));
    } else {
        createTooltip(serverNameElem, obj.guild.name);
        serverDescriptionElem.textContent = "No description provided";
    }
    const num = obj.profile.member_count ?? -1;
    memberCountElem.innerHTML = (0, _dompurifyDefault.default).sanitize(`<i class="fa-solid fa-users textIcon"></i>${formatNumber(num)}`);
    createTooltip(memberCountElem, `${obj.profile.member_count} members \u{2022} ${obj.profile.online_count} online`);
    joinElem.setAttribute("href", `https://discord.gg/${code}`);
    return server;
}
function createTooltip(e, content, placement = "top", maxWidth = 350) {
    if (e._tippy) e._tippy.setProps({
        content: content
    });
    e._tippy = (0, _tippyJsDefault.default)(e, {
        content: content,
        animation: "scale",
        appendTo: "parent",
        placement: placement,
        maxWidth: maxWidth,
        theme: "website"
    });
}
async function elem(text) {
    const match = regex.exec((0, _unityRichTextJs.Converter).removeRichText(text));
    if (match) {
        const g = match.groups["code"];
        if (g) {
            if (!g) return null;
            console.log(`  > Found a discord server: %c${g}`, "color: #0ff");
            const serverInfo = await getServerInfo(g);
            if (!serverInfo) return null;
            let elem;
            try {
                elem = createServerElem(serverInfo, g);
                if (!elem) return null;
            } catch (ex) {
                console.error(`Failed to create discord server element. Exception:\n${ex}`);
                return null;
            }
            return elem;
        }
    }
    return null;
}

},{"./unityRichText.js":"3L0Tf","tippy.js":"7X8ND","tippy.js/dist/tippy.css":"2hEyg","dompurify":"1IHUz","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2hEyg":[function() {},{}],"6zYs7":[function(require,module,exports,__globalThis) {
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

},{"./unityRichText.js":"3L0Tf","./const.js":"jw8vm","./steam.js":"7BUeb","tippy.js":"7X8ND","tippy.js/dist/tippy.css":"2hEyg","dompurify":"1IHUz","fuse.js":"kK0g7","/node_modules/flag-icons/css/flag-icons.min.css":"hRoQ7","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}],"2hEyg":[function() {},{}],"hRoQ7":[function() {},{}],"2hEyg":[function() {},{}],"fQLqg":[function() {},{}],"2gmdY":[function() {},{}],"brBtC":[function() {},{}],"P1Pul":[function(require,module,exports,__globalThis) {
const _temp0 = require("c4607aa98106c44d");
const _temp1 = require("41a4abce3d97c119");
const _temp2 = require("b7fe96cdd6efb218");
const _temp3 = require("1a56916c58232a16");
const _temp4 = require("e26dd46b5841ebd3");
const _temp5 = require("fcbce6fbd644926e");
const _temp6 = require("19b28956fb152af7");
const _temp7 = require("6a9cec449702d6e7");
const _temp8 = require("57e06621959d0a0f");
const _temp9 = require("e7d0c845b1203dc2");
const _temp10 = require("583ae70f63450f56");
const _temp11 = require("8bb25cba197e4159");
const _temp12 = require("98d9ed2de42ca26a");
const _temp13 = require("f10da2b000f1f66b");
const _temp14 = require("3e298204523d131e");
const _temp15 = require("7b19060a0f4d1873");
const _temp16 = require("16bd367510f1e691");
const _temp17 = require("880d7affe576479d");
const _temp18 = require("922a40b4e67f641");
const _temp19 = require("a9eb70aeebab224b");
const _temp20 = require("18598333c9c41ea9");
const _temp21 = require("ec97a1d425d16a06");
const _temp22 = require("83d17f63167c053");
const _temp23 = require("db2765119f503239");
const _temp24 = require("3ce08c2081fe7db2");
const _temp25 = require("9e1cf83855600f99");
const _temp26 = require("a45b88a7be79dfbd");
const _temp27 = require("6883d05c9bfa7e0f");
const _temp28 = require("80da69e7eced8586");
const _temp29 = require("cc16fdc2711476f5");
const _temp30 = require("2d8d0c0deb29f37f");
const _temp31 = require("b28cfcd5e58b6e07");
const _temp32 = require("8c3b6d989f4f66de");
const _temp33 = require("19a6aad2c9e0ccd9");
const _temp34 = require("56920cbc41e8f18c");
const _temp35 = require("1b037b737d503270");
const _temp36 = require("1868fc292a4006b2");
const _temp37 = require("65d68284ca4887ad");
const _temp38 = require("b0ee7b206f29981b");
const _temp39 = require("4e0040a587eb8997");
const _temp40 = require("b3316d7fbb43a445");
const _temp41 = require("370f75c3cedde2e");
const _temp42 = require("f498974cef0dfaf0");
const _temp43 = require("80f62873af8fd49f");
const _temp44 = require("47276ee7594a0481");
const _temp45 = require("1a6751fefb774da");
const _temp46 = require("c55ae8ce2b5682dd");
module.exports = {
    "Ascent": _temp0,
    "Baseline": _temp1,
    "Big Anomaly B": _temp2,
    "Big Anomaly": _temp3,
    "Big Bone Bowling": _temp4,
    "BONELAB Hub": _temp5,
    "Container Yard": _temp6,
    "Descent": _temp7,
    "Drop Pit": _temp8,
    "Dungeon Warrior": _temp9,
    "Fantasy Arena": _temp10,
    "Fast": _temp11,
    "Ford": _temp12,
    "Gun Range": _temp13,
    "Halfway Park": _temp14,
    "Heavy": _temp15,
    "HoloChamber": _temp16,
    "Home": _temp17,
    "Jay": _temp18,
    "Light": _temp19,
    "LongRun": _temp20,
    "Magma Gate": _temp21,
    "Main Menu": _temp22,
    "Mine Dive": _temp23,
    "Mirror": _temp24,
    "Mods_Avatar": _temp25,
    "Mods_Level": _temp26,
    "Monogon Motorway": _temp27,
    "Moon Base": _temp28,
    "Museum Basement": _temp29,
    "Neon District Parkour": _temp30,
    "Neon District Tac Trial": _temp31,
    "Nullbody": _temp32,
    "Peasant": _temp33,
    "Pillar Climb": _temp34,
    "PolyBlank": _temp35,
    "Rooftops": _temp36,
    "Security Guard": _temp37,
    "Short": _temp38,
    "Skeleton": _temp39,
    "Sprint Bridge": _temp40,
    "Street Puncher": _temp41,
    "Strong": _temp42,
    "Tall": _temp43,
    "Tunnel Tipper": _temp44,
    "Tuscany": _temp45,
    "VoidG114": _temp46
};

},{"c4607aa98106c44d":"4zaba","41a4abce3d97c119":"5bMnq","b7fe96cdd6efb218":"a29b0","1a56916c58232a16":"3UKfI","e26dd46b5841ebd3":"29Upt","fcbce6fbd644926e":"h7QeW","19b28956fb152af7":"cUzmG","6a9cec449702d6e7":"blw0m","57e06621959d0a0f":"haH00","e7d0c845b1203dc2":"5UXyZ","583ae70f63450f56":"XnN8M","8bb25cba197e4159":"4YBul","98d9ed2de42ca26a":"7z5na","f10da2b000f1f66b":"aoEUj","3e298204523d131e":"84QMd","7b19060a0f4d1873":"2zGT8","16bd367510f1e691":"8yXP5","880d7affe576479d":"kqp4R","922a40b4e67f641":"e0vtZ","a9eb70aeebab224b":"7Skw4","18598333c9c41ea9":"8Ooiq","ec97a1d425d16a06":"3RRJ2","83d17f63167c053":"3Fkfe","db2765119f503239":"l1tXK","3ce08c2081fe7db2":"aYrJ6","9e1cf83855600f99":"fPuR3","a45b88a7be79dfbd":"2gmdY","6883d05c9bfa7e0f":"5fV9r","80da69e7eced8586":"7Er2H","cc16fdc2711476f5":"dKFuO","2d8d0c0deb29f37f":"bSQPi","b28cfcd5e58b6e07":"4cFkU","8c3b6d989f4f66de":"MDc9S","19a6aad2c9e0ccd9":"kMrSe","56920cbc41e8f18c":"iowra","1b037b737d503270":"1suiw","1868fc292a4006b2":"fyWL5","65d68284ca4887ad":"lfNa9","b0ee7b206f29981b":"fJRM9","4e0040a587eb8997":"3h8a9","b3316d7fbb43a445":"6mRDk","370f75c3cedde2e":"bWaPO","f498974cef0dfaf0":"9wElo","80f62873af8fd49f":"dfBns","47276ee7594a0481":"ca16W","1a6751fefb774da":"hh292","c55ae8ce2b5682dd":"g7Wid"}],"4zaba":[function() {},{}],"5bMnq":[function() {},{}],"a29b0":[function() {},{}],"3UKfI":[function() {},{}],"29Upt":[function() {},{}],"h7QeW":[function() {},{}],"cUzmG":[function() {},{}],"blw0m":[function() {},{}],"haH00":[function() {},{}],"5UXyZ":[function() {},{}],"XnN8M":[function() {},{}],"4YBul":[function() {},{}],"7z5na":[function() {},{}],"aoEUj":[function() {},{}],"84QMd":[function() {},{}],"2zGT8":[function() {},{}],"8yXP5":[function() {},{}],"kqp4R":[function() {},{}],"e0vtZ":[function() {},{}],"7Skw4":[function() {},{}],"8Ooiq":[function() {},{}],"3RRJ2":[function() {},{}],"3Fkfe":[function() {},{}],"l1tXK":[function() {},{}],"aYrJ6":[function() {},{}],"fPuR3":[function() {},{}],"2gmdY":[function() {},{}],"5fV9r":[function() {},{}],"7Er2H":[function() {},{}],"dKFuO":[function() {},{}],"bSQPi":[function() {},{}],"4cFkU":[function() {},{}],"MDc9S":[function() {},{}],"kMrSe":[function() {},{}],"iowra":[function() {},{}],"1suiw":[function() {},{}],"fyWL5":[function() {},{}],"lfNa9":[function() {},{}],"fJRM9":[function() {},{}],"3h8a9":[function() {},{}],"6mRDk":[function() {},{}],"bWaPO":[function() {},{}],"9wElo":[function() {},{}],"dfBns":[function() {},{}],"ca16W":[function() {},{}],"hh292":[function() {},{}],"g7Wid":[function() {},{}]},["2UJpY","akTkr"], "akTkr", "parcelRequire7ca3", {})

//# sourceMappingURL=FusionLobbyBrowser.1f22c5b1.js.map
