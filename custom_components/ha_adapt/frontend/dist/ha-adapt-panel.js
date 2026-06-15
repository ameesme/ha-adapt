/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, it = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, rt = Symbol(), ht = /* @__PURE__ */ new WeakMap();
let yt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== rt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (it && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = ht.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ht.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Tt = (e) => new yt(typeof e == "string" ? e : e + "", void 0, rt), B = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new yt(s, e, rt);
}, Mt = (e, t) => {
  if (it) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = W.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, ct = it ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Tt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ht, defineProperty: Ut, getOwnPropertyDescriptor: kt, getOwnPropertyNames: Rt, getOwnPropertySymbols: Nt, getPrototypeOf: Lt } = Object, X = globalThis, dt = X.trustedTypes, It = dt ? dt.emptyScript : "", Dt = X.reactiveElementPolyfillSupport, N = (e, t) => e, F = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? It : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, nt = (e, t) => !Ht(e, t), pt = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ??= Symbol("metadata"), X.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = pt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Ut(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = kt(this.prototype, t) ?? { get() {
      return this[s];
    }, set(o) {
      this[s] = o;
    } };
    return { get: r, set(o) {
      const l = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? pt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Lt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const s = this.properties, i = [...Rt(s), ...Nt(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) s.unshift(ct(r));
    } else t !== void 0 && s.push(ct(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Mt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : F).toAttribute(s, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : F;
      this._$Em = r;
      const l = o.fromAttribute(s, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? nt)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: n }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? s ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, n] of i) {
        const { wrapped: o } = n, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[N("elementProperties")] = /* @__PURE__ */ new Map(), O[N("finalized")] = /* @__PURE__ */ new Map(), Dt?.({ ReactiveElement: O }), (X.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis, ut = (e) => e, G = ot.trustedTypes, _t = G ? G.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, wt = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, xt = "?" + x, jt = `<${xt}>`, C = document, D = () => C.createComment(""), j = (e) => e === null || typeof e != "object" && typeof e != "function", at = Array.isArray, zt = (e) => at(e) || typeof e?.[Symbol.iterator] == "function", tt = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, ft = />/g, S = RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), mt = /'/g, vt = /"/g, At = /^(?:script|style|textarea|title)$/i, Bt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), h = Bt(1), T = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), $t = /* @__PURE__ */ new WeakMap(), E = C.createTreeWalker(C, 129);
function St(e, t) {
  if (!at(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return _t !== void 0 ? _t.createHTML(t) : t;
}
const Kt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = R;
  for (let l = 0; l < s; l++) {
    const a = e[l];
    let p, u, c = -1, v = 0;
    for (; v < a.length && (o.lastIndex = v, u = o.exec(a), u !== null); ) v = o.lastIndex, o === R ? u[1] === "!--" ? o = gt : u[1] !== void 0 ? o = ft : u[2] !== void 0 ? (At.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = S) : u[3] !== void 0 && (o = S) : o === S ? u[0] === ">" ? (o = r ?? R, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? S : u[3] === '"' ? vt : mt) : o === vt || o === mt ? o = S : o === gt || o === ft ? o = R : (o = S, r = void 0);
    const w = o === S && e[l + 1].startsWith("/>") ? " " : "";
    n += o === R ? a + jt : c >= 0 ? (i.push(p), a.slice(0, c) + wt + a.slice(c) + x + w) : a + x + (c === -2 ? l : w);
  }
  return [St(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class z {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [p, u] = Kt(t, s);
    if (this.el = z.createElement(p, i), E.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = E.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(wt)) {
          const v = u[o++], w = r.getAttribute(c).split(x), q = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: n, name: q[2], strings: w, ctor: q[1] === "." ? qt : q[1] === "?" ? Wt : q[1] === "@" ? Ft : Q }), r.removeAttribute(c);
        } else c.startsWith(x) && (a.push({ type: 6, index: n }), r.removeAttribute(c));
        if (At.test(r.tagName)) {
          const c = r.textContent.split(x), v = c.length - 1;
          if (v > 0) {
            r.textContent = G ? G.emptyScript : "";
            for (let w = 0; w < v; w++) r.append(c[w], D()), E.nextNode(), a.push({ type: 2, index: ++n });
            r.append(c[v], D());
          }
        }
      } else if (r.nodeType === 8) if (r.data === xt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(x, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += x.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = C.createElement("template");
    return i.innerHTML = t, i;
  }
}
function M(e, t, s = e, i) {
  if (t === T) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = j(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = M(e, r._$AS(e, t.values), r, i)), t;
}
class Vt {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? C).importNode(s, !0);
    E.currentNode = r;
    let n = E.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let p;
        a.type === 2 ? p = new K(n, n.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (p = new Gt(n, this, t)), this._$AV.push(p), a = i[++l];
      }
      o !== a?.index && (n = E.nextNode(), o++);
    }
    return E.currentNode = C, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class K {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = M(this, t, s), j(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : zt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = z.createElement(St(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const n = new Vt(r, this), o = n.u(this.options);
      n.p(s), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = $t.get(t.strings);
    return s === void 0 && $t.set(t.strings, s = new z(t)), s;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new K(this.O(D()), this.O(D()), this, this.options)) : i = s[r], i._$AI(n), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = ut(t).nextSibling;
      ut(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = M(this, t, s, 0), o = !j(t) || t !== this._$AH && t !== T, o && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = n[0], a = 0; a < n.length - 1; a++) p = M(this, l[i + a], s, a), p === T && (p = this._$AH[a]), o ||= !j(p) || p !== this._$AH[a], p === d ? t = d : t !== d && (t += (p ?? "") + n[a + 1]), this._$AH[a] = p;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class qt extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Wt extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Ft extends Q {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = M(this, t, s, 0) ?? d) === T) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Gt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    M(this, t);
  }
}
const Zt = ot.litHtmlPolyfillSupport;
Zt?.(z, K), (ot.litHtmlVersions ??= []).push("3.3.3");
const Jt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = r = new K(t.insertBefore(D(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt = globalThis;
class b extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Jt(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return T;
  }
}
b._$litElement$ = !0, b.finalized = !0, lt.litElementHydrateSupport?.({ LitElement: b });
const Xt = lt.litElementPolyfillSupport;
Xt?.({ LitElement: b });
(lt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: F, reflect: !1, hasChanged: nt }, Yt = (e = Qt, t, s) => {
  const { kind: i, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), i === "accessor") {
    const { name: o } = s;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, e, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = s;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function _(e) {
  return (t, s) => typeof s == "object" ? Yt(e, t, s) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function y(e) {
  return _({ ...e, state: !0, attribute: !1 });
}
class te {
  constructor(t) {
    this.hass = t;
  }
  setHass(t) {
    this.hass = t;
  }
  getConfig() {
    return this.send("ha_adapt/get_config");
  }
  updateSettings(t) {
    return this.send("ha_adapt/update_settings", { settings: t });
  }
  saveSchema(t) {
    return this.send("ha_adapt/save_schema", { schema: t });
  }
  deleteSchema(t) {
    return this.send("ha_adapt/delete_schema", { schema_id: t });
  }
  setActiveSchema(t) {
    return this.send("ha_adapt/set_active_schema", { schema_id: t });
  }
  setManualControl(t, s) {
    return this.send("ha_adapt/set_manual_control", {
      entity_id: t,
      manual_control: s
    });
  }
  timeline(t) {
    return this.send("ha_adapt/timeline", { schema_id: t });
  }
  preview(t, s, i) {
    return this.send("ha_adapt/preview", {
      schema_id: t,
      hour: s,
      apply: i
    });
  }
  apply(t) {
    return this.send("ha_adapt/apply", t ? { entity_id: t } : {});
  }
  send(t, s = {}) {
    return this.hass.connection.sendMessagePromise({ type: t, ...s });
  }
}
const ee = B`
  :host {
    --bg: #fbf3e9;
    --surface: #fffaf2;
    --surface-alt: #f4e8d7;
    --border: #e6d4bc;
    --text: #3d2c1e;
    --text-soft: #836a52;
    --accent: #c8743a;
    --accent-strong: #a8521f;
    --accent-soft: #f0dcc3;
    --danger: #9c3b2e;
    --radius: 12px;
    --shadow: 0 2px 10px rgba(120, 80, 40, 0.12);

    display: block;
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: "Inter", "Segoe UI", Roboto, system-ui, sans-serif;
  }
`, U = B`
  * {
    box-sizing: border-box;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 18px;
    margin-bottom: 16px;
  }

  .card h2 {
    margin: 0 0 14px;
    font-size: 1.05rem;
    font-weight: 650;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--surface-alt);
  }

  .row:last-child {
    border-bottom: none;
  }

  .grow {
    flex: 1;
    min-width: 0;
  }

  .muted {
    color: var(--text-soft);
    font-size: 0.85rem;
  }

  label.field {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-soft);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 14px;
  }

  input[type="text"],
  input[type="number"],
  input[type="time"],
  select {
    font: inherit;
    color: var(--text);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 8px 10px;
    width: 100%;
  }

  input:focus,
  select:focus {
    outline: 2px solid var(--accent);
    border-color: var(--accent);
  }

  input[type="range"] {
    width: 100%;
    accent-color: var(--accent);
    padding: 0;
    border: none;
    background: transparent;
  }

  .field-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8px;
  }

  .field-head b {
    color: var(--accent-strong);
    font-variant-numeric: tabular-nums;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-soft);
    cursor: pointer;
  }

  button.btn {
    font: inherit;
    font-weight: 600;
    cursor: pointer;
    border-radius: 8px;
    padding: 8px 14px;
    border: 1px solid var(--accent);
    background: var(--accent);
    color: #fff8ef;
  }

  button.btn.ghost {
    background: transparent;
    color: var(--accent-strong);
  }

  button.btn.danger {
    border-color: var(--danger);
    background: transparent;
    color: var(--danger);
  }

  button.btn:disabled {
    opacity: 0.5;
    cursor: default;
  }

  .badge {
    padding: 2px 9px;
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 700;
    background: var(--accent-soft);
    color: var(--accent-strong);
  }

  .badge.manual {
    background: #f3d9c0;
    color: var(--danger);
  }

  .swatch {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1px solid var(--border);
    flex: none;
  }

  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 12px;
  }

  .empty {
    text-align: center;
    color: var(--text-soft);
    padding: 28px;
  }
`;
var se = Object.defineProperty, Et = (e, t, s, i) => {
  for (var r = void 0, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(t, s, r) || r);
  return r && se(t, s, r), r;
};
class Y extends b {
  /** Run an API mutation and bubble the resulting config (or error) up. */
  async run(t) {
    try {
      const s = await t;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: s,
          bubbles: !0,
          composed: !0
        })
      );
    } catch (s) {
      this.dispatchEvent(
        new CustomEvent("panel-error", {
          detail: String(s),
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
}
Et([
  _({ attribute: !1 })
], Y.prototype, "config");
Et([
  _({ attribute: !1 })
], Y.prototype, "api");
const et = Array.from({ length: 24 }, (e, t) => t), L = 1500, I = 6500;
function ie() {
  return {
    min_brightness: 5,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    ramp_dark: 5e3,
    ramp_light: 9e3,
    sunrise_time: null,
    sunset_time: null,
    sunrise_offset: 5e3,
    sunset_offset: -5e3,
    min_sunrise_time: null,
    max_sunrise_time: null,
    min_sunset_time: null,
    max_sunset_time: null
  };
}
function re() {
  return {
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    separate_turn_on_commands: !1,
    hours: Array.from({ length: 24 }, () => null)
  };
}
function ne(e, t) {
  return { id: e, name: t, sun: ie(), lights: {} };
}
function oe(e) {
  const t = Math.max(1e3, Math.min(12e3, e)) / 100;
  let s, i, r;
  t <= 66 ? (s = 255, i = 99.47 * Math.log(t) - 161.12) : (s = 329.7 * Math.pow(t - 60, -0.1332), i = 288.12 * Math.pow(t - 60, -0.0755)), t >= 66 ? r = 255 : t <= 19 ? r = 0 : r = 138.52 * Math.log(t - 10) - 305.04;
  const n = (o) => Math.max(0, Math.min(255, Math.round(o)));
  return `rgb(${n(s)}, ${n(i)}, ${n(r)})`;
}
function ae(e) {
  return String(e).padStart(2, "0");
}
function $(e, t, s) {
  return h`<label class="field"
    >${e}
    <input
      type="number"
      .value=${String(t)}
      @change=${(i) => s(Number(i.target.value))}
    />
  </label>`;
}
function m(e, t, s, i, r, n, o) {
  return h`<label class="field">
    <span class="field-head">
      <span>${e}</span>
      <b>${t}${n}</b>
    </span>
    <input
      type="range"
      min=${s}
      max=${i}
      step=${r}
      .value=${String(t)}
      @input=${(l) => o(Number(l.target.value))}
    />
  </label>`;
}
function bt(e, t, s) {
  return h`<label class="field"
    >${e}
    <input
      type="time"
      step="1"
      .value=${t ?? ""}
      @change=${(i) => s(i.target.value || null)}
    />
  </label>`;
}
function Ct(e, t, s) {
  return h`<label class="toggle">
    <input
      type="checkbox"
      .checked=${t}
      @change=${(i) => s(i.target.checked)}
    />
    ${e}
  </label>`;
}
var le = Object.defineProperty, he = Object.getOwnPropertyDescriptor, k = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? he(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && le(t, s, r), r;
};
let A = class extends b {
  constructor() {
    super(...arguments), this.lights = [], this.selected = null, this.previewHour = 12, this.live = !1;
  }
  render() {
    if (!this.timeline)
      return h`<div class="card"><div class="empty">Loading timeline…</div></div>`;
    const e = Math.floor(this.previewHour) % 24;
    return h`<div class="card">
      <div class="scroll">
        <div class="rows">
          ${this._scrubRow()}
          ${this._headerRow(e)}
          ${this._sunRow(e)}
          ${this.lights.map((t) => this._lightRow(t, e))}
        </div>
      </div>
    </div>`;
  }
  _scrubRow() {
    const e = Math.floor(this.previewHour), t = Math.round((this.previewHour - e) * 60), s = `${String(e).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
    return h`<div class="gridrow scrubrow">
      <div class="label">
        <span class="clock">${s}</span>
        <label class="live">
          <input
            type="checkbox"
            .checked=${this.live}
            @change=${(i) => this._emit("live-toggle", i.target.checked)}
          />
          live
        </label>
      </div>
      <div class="track">
        <input
          type="range"
          min="0"
          max="23.5"
          step="0.5"
          .value=${String(this.previewHour)}
          @input=${(i) => this._emit("scrub", Number(i.target.value))}
        />
      </div>
    </div>`;
  }
  _headerRow(e) {
    return h`<div class="gridrow">
      <div class="label"></div>
      ${et.map(
      (t) => h`<div class="hourhead ${t === e ? "now" : ""}">
          ${ae(t)}
        </div>`
    )}
    </div>`;
  }
  _sunRow(e) {
    const t = this.timeline.sun;
    return h`<div class="gridrow sunrow">
      <div class="label">☀️ Sun</div>
      ${et.map(
      (s) => this._cell(t[s], s === e, "readonly", !1, !1)
    )}
    </div>`;
  }
  _lightRow(e, t) {
    const s = this.timeline.lights[e.entity_id] ?? [];
    return h`<div class="gridrow">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", e.entity_id)}
      >
        ${e.name}
      </div>
      ${et.map((i) => {
      const r = s[i], n = this.selected?.entityId === e.entity_id && this.selected?.hour === i;
      return this._cell(
        r,
        i === t,
        "",
        !!r?.explicit,
        n,
        () => this._emit("select-cell", { entityId: e.entity_id, hour: i })
      );
    })}
    </div>`;
  }
  _cell(e, t, s, i, r, n) {
    const o = e ? e.brightness : 0, l = e ? oe(e.color_temp) : "transparent", a = [
      "cell",
      s,
      i ? "explicit" : "",
      r ? "selected" : "",
      t ? "now" : ""
    ].join(" ");
    return h`<div
      class=${a}
      @click=${n}
      title=${e ? `${e.brightness}% · ${e.color_temp} K` : ""}
    >
      <div class="fill" style="height:${o}%;background:${l}"></div>
    </div>`;
  }
  _emit(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
    );
  }
};
A.styles = [
  U,
  B`
      .scroll {
        overflow-x: auto;
        max-width: 100%;
        padding-bottom: 6px;
      }
      .rows {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: max-content;
      }
      .gridrow {
        display: grid;
        grid-template-columns: 140px repeat(24, 30px);
        gap: 2px;
        align-items: center;
      }
      .label {
        position: sticky;
        left: 0;
        z-index: 3;
        background: var(--surface);
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 4px 8px 4px 2px;
        box-shadow: 1px 0 0 var(--border);
      }
      .label.clickable {
        cursor: pointer;
      }
      .sunrow {
        background: var(--accent-soft);
        border-radius: 6px;
        padding: 3px 0;
      }
      .sunrow .label {
        background: var(--accent-soft);
        color: var(--accent-strong);
      }
      .hourhead {
        font-size: 0.7rem;
        text-align: center;
        color: var(--text-soft);
      }
      .hourhead.now {
        color: var(--accent-strong);
        font-weight: 700;
      }
      .scrubrow .track {
        grid-column: 2 / -1;
        display: flex;
        align-items: center;
      }
      .scrubrow input[type="range"] {
        width: 100%;
      }
      .clock {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        color: var(--accent-strong);
      }
      .live {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--text-soft);
        cursor: pointer;
      }
      .cell {
        position: relative;
        height: 42px;
        border-radius: 4px;
        background: var(--surface-alt);
        overflow: hidden;
        cursor: pointer;
        border: 1px solid var(--border);
      }
      .cell.readonly {
        cursor: default;
      }
      .cell .fill {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .cell.explicit {
        border-color: var(--accent-strong);
        box-shadow: inset 0 0 0 1px var(--accent-strong);
      }
      .cell.selected {
        outline: 2px solid var(--accent-strong);
        outline-offset: 1px;
      }
      .cell.now {
        border-bottom: 3px solid var(--accent);
      }
    `
];
k([
  _({ attribute: !1 })
], A.prototype, "lights", 2);
k([
  _({ attribute: !1 })
], A.prototype, "timeline", 2);
k([
  _({ attribute: !1 })
], A.prototype, "selected", 2);
k([
  _({ type: Number })
], A.prototype, "previewHour", 2);
k([
  _({ type: Boolean })
], A.prototype, "live", 2);
A = k([
  H("ha-adapt-timeline-grid")
], A);
var ce = Object.defineProperty, de = Object.getOwnPropertyDescriptor, Pt = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? de(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && ce(t, s, r), r;
};
let Z = class extends b {
  render() {
    const e = this.sun;
    return h`<div class="card">
      <h2>☀️ Sun</h2>
      <p class="muted">
        The sun drives every light's fallback. Empty timeline cells follow it.
      </p>
      <div class="grid">
        ${m(
      "Min brightness",
      e.min_brightness,
      1,
      100,
      1,
      "%",
      (t) => this._patch({ min_brightness: t })
    )}
        ${m(
      "Max brightness",
      e.max_brightness,
      1,
      100,
      1,
      "%",
      (t) => this._patch({ max_brightness: t })
    )}
        ${m(
      "Min color temp",
      e.min_color_temp,
      L,
      I,
      50,
      "K",
      (t) => this._patch({ min_color_temp: t })
    )}
        ${m(
      "Max color temp",
      e.max_color_temp,
      L,
      I,
      50,
      "K",
      (t) => this._patch({ max_color_temp: t })
    )}
        ${bt(
      "Fixed sunrise",
      e.sunrise_time,
      (t) => this._patch({ sunrise_time: t })
    )}
        ${bt(
      "Fixed sunset",
      e.sunset_time,
      (t) => this._patch({ sunset_time: t })
    )}
        ${$(
      "Sunrise offset (s)",
      e.sunrise_offset,
      (t) => this._patch({ sunrise_offset: t })
    )}
        ${$(
      "Sunset offset (s)",
      e.sunset_offset,
      (t) => this._patch({ sunset_offset: t })
    )}
        ${$(
      "Ramp – dark side (s)",
      e.ramp_dark,
      (t) => this._patch({ ramp_dark: t })
    )}
        ${$(
      "Ramp – light side (s)",
      e.ramp_light,
      (t) => this._patch({ ramp_light: t })
    )}
      </div>
    </div>`;
  }
  _patch(e) {
    this.dispatchEvent(
      new CustomEvent("sun-changed", {
        detail: { ...this.sun, ...e },
        bubbles: !0,
        composed: !0
      })
    );
  }
};
Z.styles = U;
Pt([
  _({ attribute: !1 })
], Z.prototype, "sun", 2);
Z = Pt([
  H("ha-adapt-sun-config")
], Z);
var pe = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, f = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ue(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && pe(t, s, r), r;
};
let g = class extends b {
  constructor() {
    super(...arguments), this.lights = [], this.active = !1, this._selectedCell = null, this._selectedLight = null, this._previewHour = 12, this._livePreview = !1, this._delete = () => {
      this.dispatchEvent(
        new CustomEvent("schema-delete", {
          detail: this._draft.id,
          bubbles: !0,
          composed: !0
        })
      );
    };
  }
  willUpdate(e) {
    e.has("schema") && this._draft?.id !== this.schema.id && (this._flushSave(), this._draft = structuredClone(this.schema), this._selectedCell = null, this._selectedLight = null, this._loadTimeline());
  }
  disconnectedCallback() {
    this._flushSave(), super.disconnectedCallback();
  }
  async _loadTimeline() {
    try {
      this._timeline = await this.api.timeline(this._draft.id);
    } catch {
      this._timeline = void 0;
    }
  }
  // --- persistence ---------------------------------------------------------
  /** Coalesce rapid edits: persist once the user pauses. */
  _scheduleSave() {
    window.clearTimeout(this._saveTimer), this._saveTimer = window.setTimeout(() => {
      this._saveTimer = void 0, this._saveAndRefresh();
    }, 400);
  }
  /** Persist any pending edit immediately (on schema switch / teardown). */
  _flushSave() {
    this._saveTimer !== void 0 && (window.clearTimeout(this._saveTimer), this._saveTimer = void 0, this._saveAndRefresh());
  }
  async _saveAndRefresh() {
    try {
      const e = await this.api.saveSchema(this._draft);
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: e,
          bubbles: !0,
          composed: !0
        })
      ), await this._loadTimeline();
    } catch (e) {
      this.dispatchEvent(
        new CustomEvent("panel-error", {
          detail: String(e),
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  _lightCfg(e) {
    return this._draft.lights[e] ?? re();
  }
  _patchLight(e, t) {
    const s = { ...this._lightCfg(e), ...t };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [e]: s }
    }, this._scheduleSave();
  }
  // --- render --------------------------------------------------------------
  render() {
    return h`
      <div class="card">
        <div class="toolbar">
          <input
            type="text"
            style="max-width:260px"
            .value=${this._draft.name}
            @change=${(e) => this._patchSchema({
      name: e.target.value
    })}
          />
          ${this.active ? h`<span class="badge">Active</span>` : h`<button
                class="btn ghost"
                @click=${() => void this._setActive()}
              >
                Set active
              </button>`}
          <span class="grow"></span>
          ${this._draft.id !== "default" ? h`<button class="btn danger" @click=${this._delete}>
                Delete
              </button>` : d}
        </div>
      </div>

      <ha-adapt-sun-config
        .sun=${this._draft.sun}
        @sun-changed=${(e) => this._patchSchema({ sun: e.detail })}
      ></ha-adapt-sun-config>

      <ha-adapt-timeline-grid
        .lights=${this.lights}
        .timeline=${this._timeline}
        .selected=${this._selectedCell}
        .previewHour=${this._previewHour}
        .live=${this._livePreview}
        @select-cell=${(e) => {
      this._selectedCell = e.detail, this._selectedLight = null;
    }}
        @select-light=${(e) => {
      this._selectedLight = e.detail, this._selectedCell = null;
    }}
        @scrub=${(e) => this._onScrub(e.detail)}
        @live-toggle=${(e) => this._onLiveToggle(e.detail)}
      ></ha-adapt-timeline-grid>

      ${this._selectedCell ? this._renderCellEditor() : d}
      ${this._selectedLight ? this._renderLightEditor() : d}
    `;
  }
  _onLiveToggle(e) {
    this._livePreview = e, e ? this._sendPreview() : this.api.apply();
  }
  _renderCellEditor() {
    const e = this._selectedCell, t = this.lights.find((o) => o.entity_id === e.entityId), s = this._lightCfg(e.entityId).hours[e.hour], i = this._timeline?.lights[e.entityId]?.[e.hour], r = s?.brightness ?? i?.brightness ?? 50, n = s?.color_temp ?? i?.color_temp ?? 3e3;
    return h`<div class="card">
      <h2>
        ${t?.name ?? e.entityId} · ${String(e.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${s ? "Explicit override for this hour." : "Currently following the sun — set a value to override."}
      </p>
      <div class="grid">
        ${m(
      "Brightness",
      r,
      1,
      100,
      1,
      "%",
      (o) => this._setCell(e, { brightness: o, color_temp: n })
    )}
        ${m(
      "Color temp",
      n,
      L,
      I,
      50,
      "K",
      (o) => this._setCell(e, { brightness: r, color_temp: o })
    )}
      </div>
      <div class="actions">
        ${s ? h`<button
              class="btn ghost"
              @click=${() => this._setCell(e, null)}
            >
              Use sun (clear)
            </button>` : d}
        <button class="btn ghost" @click=${() => this._selectedCell = null}>
          Close
        </button>
      </div>
    </div>`;
  }
  _renderLightEditor() {
    const e = this._selectedLight, t = this.lights.find((i) => i.entity_id === e), s = this._lightCfg(e);
    return h`<div class="card">
      <h2>${t?.name ?? e} · range</h2>
      <div class="grid">
        ${m(
      "Min brightness",
      s.min_brightness,
      1,
      100,
      1,
      "%",
      (i) => this._patchLight(e, { min_brightness: i })
    )}
        ${m(
      "Max brightness",
      s.max_brightness,
      1,
      100,
      1,
      "%",
      (i) => this._patchLight(e, { max_brightness: i })
    )}
        ${m(
      "Min color temp",
      s.min_color_temp,
      L,
      I,
      50,
      "K",
      (i) => this._patchLight(e, { min_color_temp: i })
    )}
        ${m(
      "Max color temp",
      s.max_color_temp,
      L,
      I,
      50,
      "K",
      (i) => this._patchLight(e, { max_color_temp: i })
    )}
      </div>
      <div class="actions">
        ${Ct(
      "Split commands (IKEA)",
      s.separate_turn_on_commands,
      (i) => this._patchLight(e, { separate_turn_on_commands: i })
    )}
        <span class="grow"></span>
        <button class="btn ghost" @click=${() => this._selectedLight = null}>
          Close
        </button>
      </div>
    </div>`;
  }
  // --- actions -------------------------------------------------------------
  _patchSchema(e) {
    this._draft = { ...this._draft, ...e }, this._scheduleSave();
  }
  _setCell(e, t) {
    const i = [...this._lightCfg(e.entityId).hours];
    i[e.hour] = t, this._patchLight(e.entityId, { hours: i });
  }
  async _setActive() {
    try {
      const e = await this.api.setActiveSchema(this._draft.id);
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: e,
          bubbles: !0,
          composed: !0
        })
      );
    } catch (e) {
      this.dispatchEvent(
        new CustomEvent("panel-error", {
          detail: String(e),
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
  _onScrub(e) {
    this._previewHour = e, this._livePreview && this._sendPreview();
  }
  _sendPreview() {
    window.clearTimeout(this._previewTimer), this._previewTimer = window.setTimeout(() => {
      this.api.preview(this._draft.id, this._previewHour, !0);
    }, 150);
  }
};
g.styles = [
  U,
  B`
      .toolbar {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
    `
];
f([
  _({ attribute: !1 })
], g.prototype, "schema", 2);
f([
  _({ attribute: !1 })
], g.prototype, "lights", 2);
f([
  _({ attribute: !1 })
], g.prototype, "api", 2);
f([
  _({ type: Boolean })
], g.prototype, "active", 2);
f([
  y()
], g.prototype, "_draft", 2);
f([
  y()
], g.prototype, "_timeline", 2);
f([
  y()
], g.prototype, "_selectedCell", 2);
f([
  y()
], g.prototype, "_selectedLight", 2);
f([
  y()
], g.prototype, "_previewHour", 2);
f([
  y()
], g.prototype, "_livePreview", 2);
g = f([
  H("ha-adapt-schema-editor")
], g);
var _e = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, Ot = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ge(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && _e(t, s, r), r;
};
let J = class extends Y {
  get _currentId() {
    return this._selectedId && this.config.schemas[this._selectedId] ? this._selectedId : this.config.active_schema_id;
  }
  render() {
    const e = Object.values(this.config.schemas), t = this._currentId, s = this.config.schemas[t];
    return h`
      <div class="card">
        <h2>Schemas</h2>
        <p class="muted">
          Each schema configures every light. One schema is active at a time.
        </p>
        <div class="row">
          <select
            class="grow"
            @change=${(i) => this._selectedId = i.target.value}
          >
            ${e.map(
      (i) => h`<option
                  value=${i.id}
                  ?selected=${i.id === t}
                >
                  ${i.name}${i.id === this.config.active_schema_id ? " (active)" : ""}
                </option>`
    )}
          </select>
          <button class="btn ghost" @click=${this._new}>+ New</button>
        </div>
      </div>
      ${s ? h`<ha-adapt-schema-editor
            .schema=${s}
            .lights=${this.config.lights}
            .api=${this.api}
            .active=${t === this.config.active_schema_id}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>` : d}
    `;
  }
  async _new() {
    const e = `schema_${Date.now().toString(36)}`;
    this._selectedId = e, await this.run(this.api.saveSchema(ne(e, "New schema")));
  }
  async _onDelete(e) {
    this._selectedId = this.config.active_schema_id, await this.run(this.api.deleteSchema(e.detail));
  }
};
J.styles = U;
Ot([
  y()
], J.prototype, "_selectedId", 2);
J = Ot([
  H("ha-adapt-schemas-tab")
], J);
var fe = Object.getOwnPropertyDescriptor, me = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? fe(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(r) || r);
  return r;
};
let st = class extends Y {
  render() {
    const e = this.config.settings, t = (s) => void this.run(this.api.updateSettings(s));
    return h`<div class="card">
      <h2>Global settings</h2>
      <div class="grid">
        ${$("Interval (s)", e.interval, (s) => t({ interval: s }))}
        ${$(
      "Transition (s)",
      e.transition,
      (s) => t({ transition: s })
    )}
        ${$(
      "Initial transition (s)",
      e.initial_transition,
      (s) => t({ initial_transition: s })
    )}
        ${$(
      "Auto-reset override (s)",
      e.autoreset_control,
      (s) => t({ autoreset_control: s })
    )}
        ${$(
      "Split delay (ms)",
      e.send_split_delay,
      (s) => t({ send_split_delay: s })
    )}
      </div>
      <div class="actions">
        ${Ct(
      "Take over control",
      e.take_over_control,
      (s) => t({ take_over_control: s })
    )}
      </div>
    </div>`;
  }
};
st.styles = U;
st = me([
  H("ha-adapt-settings-tab")
], st);
var ve = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, V = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? $e(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && ve(t, s, r), r;
};
let P = class extends b {
  constructor() {
    super(...arguments), this.narrow = !1, this._loaded = !1;
  }
  updated() {
    this.hass && (this._api ? this._api.setHass(this.hass) : this._api = new te(this.hass), this._loaded || (this._loaded = !0, this._load()));
  }
  async _load() {
    try {
      this._config = await this._api.getConfig(), this._error = void 0;
    } catch (e) {
      this._error = String(e);
    }
  }
  _onConfigChanged(e) {
    this._config = e.detail, this._error = void 0;
  }
  _onError(e) {
    this._error = e.detail;
  }
  render() {
    if (!this._config)
      return h`<div class="wrap">
        <div class="empty">${this._error ?? "Loading…"}</div>
      </div>`;
    const e = this._config;
    return h`<div
      class="wrap"
      @config-changed=${this._onConfigChanged}
      @panel-error=${this._onError}
    >
      <header>
        <h1>Adaptive Lighting</h1>
        <span class="pill ${e.enabled ? "" : "off"}">
          ${e.enabled ? "Active" : "Paused"}
        </span>
        <span class="spacer"></span>
        <button class="btn ghost" @click=${this._applyNow}>Apply now</button>
      </header>

      ${this._error ? h`<div class="card error">${this._error}</div>` : d}

      <ha-adapt-schemas-tab
        .config=${e}
        .api=${this._api}
      ></ha-adapt-schemas-tab>

      <details class="settings-fold">
        <summary>Global settings</summary>
        <ha-adapt-settings-tab
          .config=${e}
          .api=${this._api}
        ></ha-adapt-settings-tab>
      </details>
    </div>`;
  }
  async _applyNow() {
    try {
      this._config = await this._api.apply();
    } catch (e) {
      this._error = String(e);
    }
  }
};
P.styles = [
  ee,
  U,
  B`
      .wrap {
        width: 100%;
        padding: 24px 20px 64px;
        /* Clip (not hidden) so the page never scrolls sideways while the
           timeline keeps its own inner horizontal scroll. */
        overflow-x: clip;
      }
      header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }
      header h1 {
        font-size: 1.5rem;
        font-weight: 650;
        margin: 0;
      }
      .spacer {
        flex: 1;
      }
      .pill {
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
        background: var(--accent-soft);
        color: var(--accent-strong);
      }
      .pill.off {
        background: #ece2d3;
        color: var(--text-soft);
      }
      .error {
        border-color: var(--danger);
        color: var(--danger);
      }
      details.settings-fold {
        margin-top: 18px;
      }
      details.settings-fold > summary {
        cursor: pointer;
        font-weight: 650;
        color: var(--text-soft);
        padding: 6px 2px;
      }
    `
];
V([
  _({ attribute: !1 })
], P.prototype, "hass", 2);
V([
  _({ attribute: !1 })
], P.prototype, "narrow", 2);
V([
  y()
], P.prototype, "_config", 2);
V([
  y()
], P.prototype, "_error", 2);
P = V([
  H("ha-adapt-panel")
], P);
export {
  P as HaAdaptPanel
};
