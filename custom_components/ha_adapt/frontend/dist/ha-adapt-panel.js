/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, et = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), lt = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, i, s) {
    if (this._$cssResult$ = !0, s !== it) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (et && t === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (t = lt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && lt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Pt = (e) => new bt(typeof e == "string" ? e : e + "", void 0, it), H = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new bt(i, e, it);
}, kt = (e, t) => {
  if (et) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const s = document.createElement("style"), r = q.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, e.appendChild(s);
  }
}, ht = et ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const s of t.cssRules) i += s.cssText;
  return Pt(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Tt, getOwnPropertyDescriptor: Ot, getOwnPropertyNames: Ht, getOwnPropertySymbols: Rt, getPrototypeOf: Ut } = Object, J = globalThis, ct = J.trustedTypes, Nt = ct ? ct.emptyScript : "", zt = J.reactiveElementPolyfillSupport, N = (e, t) => e, W = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Nt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, st = (e, t) => !Mt(e, t), dt = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: st };
Symbol.metadata ??= Symbol("metadata"), J.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = dt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, i);
      r !== void 0 && Tt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, i, s) {
    const { get: r, set: n } = Ot(this.prototype, t) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const l = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Ut(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const i = this.properties, s = [...Ht(i), ...Rt(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) i.unshift(ht(r));
    } else t !== void 0 && i.push(ht(t));
    return i;
  }
  static _$Eu(t, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return kt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, i, s) {
    this._$AK(t, s);
  }
  _$ET(t, i) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : W).toAttribute(i, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, i) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : W;
      this._$Em = r;
      const l = o.fromAttribute(i, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, i, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? st)(n, i) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? i ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (i = void 0), this._$AL.set(t, i)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
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
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, l = this[r];
        o !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[N("elementProperties")] = /* @__PURE__ */ new Map(), M[N("finalized")] = /* @__PURE__ */ new Map(), zt?.({ ReactiveElement: M }), (J.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, pt = (e) => e, Z = rt.trustedTypes, ut = Z ? Z.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, wt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + y, It = `<${yt}>`, P = document, L = () => P.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", nt = Array.isArray, Lt = (e) => nt(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _t = /-->/g, gt = />/g, E = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, mt = /"/g, xt = /^(?:script|style|textarea|title)$/i, Dt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), h = Dt(1), T = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), C = P.createTreeWalker(P, 129);
function At(e, t) {
  if (!nt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const jt = (e, t) => {
  const i = e.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let l = 0; l < i; l++) {
    const a = e[l];
    let p, u, c = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, u = o.exec(a), u !== null); ) m = o.lastIndex, o === U ? u[1] === "!--" ? o = _t : u[1] !== void 0 ? o = gt : u[2] !== void 0 ? (xt.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = E) : u[3] !== void 0 && (o = E) : o === E ? u[0] === ">" ? (o = r ?? U, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? E : u[3] === '"' ? mt : ft) : o === mt || o === ft ? o = E : o === _t || o === gt ? o = U : (o = E, r = void 0);
    const w = o === E && e[l + 1].startsWith("/>") ? " " : "";
    n += o === U ? a + It : c >= 0 ? (s.push(p), a.slice(0, c) + wt + a.slice(c) + y + w) : a + y + (c === -2 ? l : w);
  }
  return [At(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class j {
  constructor({ strings: t, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [p, u] = jt(t, i);
    if (this.el = j.createElement(p, s), C.currentNode = this.el.content, i === 2 || i === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = C.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(wt)) {
          const m = u[o++], w = r.getAttribute(c).split(y), V = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: n, name: V[2], strings: w, ctor: V[1] === "." ? Kt : V[1] === "?" ? Ft : V[1] === "@" ? Vt : X }), r.removeAttribute(c);
        } else c.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(c));
        if (xt.test(r.tagName)) {
          const c = r.textContent.split(y), m = c.length - 1;
          if (m > 0) {
            r.textContent = Z ? Z.emptyScript : "";
            for (let w = 0; w < m; w++) r.append(c[w], L()), C.nextNode(), a.push({ type: 2, index: ++n });
            r.append(c[m], L());
          }
        }
      } else if (r.nodeType === 8) if (r.data === yt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(y, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const s = P.createElement("template");
    return s.innerHTML = t, s;
  }
}
function O(e, t, i = e, s) {
  if (t === T) return t;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const n = D(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (t = O(e, r._$AS(e, t.values), r, s)), t;
}
class Bt {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: s } = this._$AD, r = (t?.creationScope ?? P).importNode(i, !0);
    C.currentNode = r;
    let n = C.nextNode(), o = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let p;
        a.type === 2 ? p = new B(n, n.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (p = new qt(n, this, t)), this._$AV.push(p), a = s[++l];
      }
      o !== a?.index && (n = C.nextNode(), o++);
    }
    return C.currentNode = P, r;
  }
  p(t) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, i), i += s.strings.length - 2) : s._$AI(t[i])), i++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, i, s, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && t?.nodeType === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = O(this, t, i), D(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Lt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: i, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = j.createElement(At(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const n = new Bt(r, this), o = n.u(this.options);
      n.p(i), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let i = vt.get(t.strings);
    return i === void 0 && vt.set(t.strings, i = new j(t)), i;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of t) r === i.length ? i.push(s = new B(this.O(L()), this.O(L()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); t !== this._$AB; ) {
      const s = pt(t).nextSibling;
      pt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class X {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, s, r, n) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, i = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = O(this, t, i, 0), o = !D(t) || t !== this._$AH && t !== T, o && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = n[0], a = 0; a < n.length - 1; a++) p = O(this, l[s + a], i, a), p === T && (p = this._$AH[a]), o ||= !D(p) || p !== this._$AH[a], p === d ? t = d : t !== d && (t += (p ?? "") + n[a + 1]), this._$AH[a] = p;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Kt extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Ft extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Vt extends X {
  constructor(t, i, s, r, n) {
    super(t, i, s, r, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = O(this, t, i, 0) ?? d) === T) return;
    const s = this._$AH, r = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== d && (s === d || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class qt {
  constructor(t, i, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const Wt = rt.litHtmlPolyfillSupport;
Wt?.(j, B), (rt.litHtmlVersions ??= []).push("3.3.3");
const Zt = (e, t, i) => {
  const s = i?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = i?.renderBefore ?? null;
    s._$litPart$ = r = new B(t.insertBefore(L(), n), n, void 0, i ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis;
class v extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Zt(i, this.renderRoot, this.renderOptions);
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
v._$litElement$ = !0, v.finalized = !0, ot.litElementHydrateSupport?.({ LitElement: v });
const Gt = ot.litElementPolyfillSupport;
Gt?.({ LitElement: v });
(ot.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: st }, Xt = (e = Jt, t, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), s === "accessor") {
    const { name: o } = i;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, e, l), l;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function _(e) {
  return (t, i) => typeof i == "object" ? Xt(e, t, i) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function S(e) {
  return _({ ...e, state: !0, attribute: !1 });
}
class Qt {
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
  setManualControl(t, i) {
    return this.send("ha_adapt/set_manual_control", {
      entity_id: t,
      manual_control: i
    });
  }
  // Pass the (possibly unsaved) draft schema so the timeline/preview reflect
  // edits live, without persisting on every change.
  timeline(t) {
    return this.send("ha_adapt/timeline", { schema: t });
  }
  preview(t, i, s) {
    return this.send("ha_adapt/preview", { schema: t, hour: i, apply: s });
  }
  apply(t) {
    return this.send("ha_adapt/apply", t ? { entity_id: t } : {});
  }
  send(t, i = {}) {
    return this.hass.connection.sendMessagePromise({ type: t, ...i });
  }
}
const Yt = H`
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
`, F = H`
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

  @media (max-width: 960px) {
    .grid {
      grid-template-columns: minmax(0, 1fr);
    }
    /* Flatten cards on mobile so they don't add a second horizontal padding
       inside the panel's own padding. */
    .card {
      padding-left: 0;
      padding-right: 0;
      border: none;
      border-radius: 0;
      box-shadow: none;
      background: transparent;
    }
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
    min-width: 0;
    box-sizing: border-box;
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
`, Y = Array.from({ length: 24 }, (e, t) => t), z = 1500, I = 6500;
function te() {
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
function ee() {
  return {
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    separate_turn_on_commands: !1,
    hours: Array.from({ length: 24 }, () => null)
  };
}
function ie(e, t) {
  return { id: e, name: t, sun: te(), lights: {} };
}
function se(e) {
  const t = Math.max(1e3, Math.min(12e3, e)) / 100;
  let i, s, r;
  t <= 66 ? (i = 255, s = 99.47 * Math.log(t) - 161.12) : (i = 329.7 * Math.pow(t - 60, -0.1332), s = 288.12 * Math.pow(t - 60, -0.0755)), t >= 66 ? r = 255 : t <= 19 ? r = 0 : r = 138.52 * Math.log(t - 10) - 305.04;
  const n = (o) => Math.max(0, Math.min(255, Math.round(o)));
  return `rgb(${n(i)}, ${n(s)}, ${n(r)})`;
}
function re(e) {
  return String(e).padStart(2, "0");
}
function ne() {
  const e = /* @__PURE__ */ new Date();
  return e.getHours() + e.getMinutes() / 60;
}
function x(e, t, i) {
  return h`<label class="field"
    >${e}
    <input
      type="number"
      .value=${String(t)}
      @change=${(s) => i(Number(s.target.value))}
    />
  </label>`;
}
function f(e, t, i, s, r, n, o) {
  return h`<label class="field">
    <span class="field-head">
      <span>${e}</span>
      <b>${t}${n}</b>
    </span>
    <input
      type="range"
      min=${i}
      max=${s}
      step=${r}
      .value=${String(t)}
      @input=${(l) => o(Number(l.target.value))}
    />
  </label>`;
}
function $t(e, t, i) {
  return h`<label class="field"
    >${e}
    <input
      type="time"
      step="1"
      .value=${t ?? ""}
      @change=${(s) => i(s.target.value || null)}
    />
  </label>`;
}
function St(e, t, i) {
  return h`<label class="toggle">
    <input
      type="checkbox"
      .checked=${t}
      @change=${(s) => i(s.target.checked)}
    />
    ${e}
  </label>`;
}
var oe = Object.defineProperty, ae = Object.getOwnPropertyDescriptor, R = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ae(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && oe(t, i, r), r;
};
let A = class extends v {
  constructor() {
    super(...arguments), this.lights = [], this.selected = null, this.selectedRow = null, this.previewHour = 12;
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
          <div class="gridrow">
            <div class="label section-label">Lights</div>
          </div>
          ${this.lights.map((t) => this._lightRow(t, e))}
        </div>
      </div>
    </div>`;
  }
  _scrubRow() {
    const e = Math.floor(this.previewHour), t = Math.round((this.previewHour - e) * 60), i = `${String(e).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
    return h`<div class="gridrow scrubrow">
      <div class="label">
        <span class="clock">${i}</span>
      </div>
      <div class="track">
        <input
          type="range"
          min="0"
          max="23.5"
          step="0.5"
          .value=${String(this.previewHour)}
          @input=${(s) => this._emit("scrub", Number(s.target.value))}
        />
      </div>
    </div>`;
  }
  _headerRow(e) {
    return h`<div class="gridrow">
      <div class="label"></div>
      ${Y.map(
      (t) => h`<div class="hourhead ${t === e ? "now" : ""}">
          ${re(t)}
        </div>`
    )}
    </div>`;
  }
  _sunRow(e) {
    const t = this.timeline.sun, i = this.selectedRow === "sun" ? "rowselected" : "";
    return h`<div class="gridrow sunrow ${i}">
      <div
        class="label clickable"
        title="Edit the sun"
        @click=${() => this._emit("select-sun", null)}
      >
        <span class="lname">☀️ Sun</span>
        ${this._cogIcon()}
      </div>
      ${Y.map(
      (s) => this._cell(t[s], s === e, "readonly", !1, !1)
    )}
    </div>`;
  }
  _lightRow(e, t) {
    const i = this.timeline.lights[e.entity_id] ?? [], s = this.selectedRow === e.entity_id ? "rowselected" : "";
    return h`<div class="gridrow ${s}">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", e.entity_id)}
      >
        <span class="lname">${e.name}</span>
        ${this._cogIcon()}
      </div>
      ${Y.map((r) => {
      const n = i[r], o = this.selected?.entityId === e.entity_id && this.selected?.hour === r;
      return this._cell(
        n,
        r === t,
        "",
        !!n?.explicit,
        o,
        () => this._emit("select-cell", { entityId: e.entity_id, hour: r })
      );
    })}
    </div>`;
  }
  _cell(e, t, i, s, r, n) {
    const o = e ? e.brightness : 0, l = e ? se(e.color_temp) : "transparent", a = [
      "cell",
      i,
      s ? "explicit" : "",
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
  _cogIcon() {
    return h`<svg class="cog" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7 7 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.31 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96a7 7 0 0 0 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7 7 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z"
      />
    </svg>`;
  }
  _emit(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
    );
  }
};
A.styles = [
  F,
  H`
      :host {
        display: block;
        height: 100%;
      }
      .card {
        height: 100%;
        box-sizing: border-box;
      }
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
        align-self: stretch;
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        padding: 0 12px;
        box-shadow: 1px 0 0 var(--border);
      }
      .label.clickable {
        cursor: pointer;
      }
      .label .lname {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label .cog {
        width: 14px;
        height: 14px;
        flex: none;
        margin-left: auto;
        opacity: 0.4;
      }
      .label.clickable:hover .cog {
        opacity: 0.9;
      }
      .sunrow .label {
        color: var(--accent-strong);
      }
      .gridrow.rowselected .label {
        background: var(--accent-soft);
        color: var(--accent-strong);
      }
      .label.section-label {
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-size: 0.68rem;
        font-weight: 700;
        color: var(--text-soft);
        padding-top: 8px;
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
      @media (max-width: 960px) {
        .card {
          padding: 0;
        }
        /* Match the page background (the card is flat on mobile) so the sticky
           labels and the right-side scroll cutoff blend in. */
        .label {
          background: var(--bg);
          padding: 0 6px;
        }
      }
    `
];
R([
  _({ attribute: !1 })
], A.prototype, "lights", 2);
R([
  _({ attribute: !1 })
], A.prototype, "timeline", 2);
R([
  _({ attribute: !1 })
], A.prototype, "selected", 2);
R([
  _({ attribute: !1 })
], A.prototype, "selectedRow", 2);
R([
  _({ type: Number })
], A.prototype, "previewHour", 2);
A = R([
  K("ha-adapt-timeline-grid")
], A);
var le = Object.defineProperty, he = Object.getOwnPropertyDescriptor, Et = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? he(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && le(t, i, r), r;
};
let G = class extends v {
  render() {
    const e = this.sun;
    return h`
      <h2>☀️ Sun</h2>
      <p class="muted">
        The sun drives every light's fallback. Empty timeline cells follow it.
      </p>
      <div class="grid">
        ${f(
      "Min brightness",
      e.min_brightness,
      1,
      100,
      1,
      "%",
      (t) => this._patch({ min_brightness: t })
    )}
        ${f(
      "Max brightness",
      e.max_brightness,
      1,
      100,
      1,
      "%",
      (t) => this._patch({ max_brightness: t })
    )}
        ${f(
      "Min color temp",
      e.min_color_temp,
      z,
      I,
      50,
      "K",
      (t) => this._patch({ min_color_temp: t })
    )}
        ${f(
      "Max color temp",
      e.max_color_temp,
      z,
      I,
      50,
      "K",
      (t) => this._patch({ max_color_temp: t })
    )}
        ${$t(
      "Fixed sunrise",
      e.sunrise_time,
      (t) => this._patch({ sunrise_time: t })
    )}
        ${$t(
      "Fixed sunset",
      e.sunset_time,
      (t) => this._patch({ sunset_time: t })
    )}
        ${x(
      "Sunrise offset (s)",
      e.sunrise_offset,
      (t) => this._patch({ sunrise_offset: t })
    )}
        ${x(
      "Sunset offset (s)",
      e.sunset_offset,
      (t) => this._patch({ sunset_offset: t })
    )}
        ${x(
      "Ramp – dark side (s)",
      e.ramp_dark,
      (t) => this._patch({ ramp_dark: t })
    )}
        ${x(
      "Ramp – light side (s)",
      e.ramp_light,
      (t) => this._patch({ ramp_light: t })
    )}
      </div>
    `;
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
G.styles = [
  F,
  H`
      h2 {
        margin: 0 0 4px;
        font-size: 1.05rem;
        font-weight: 650;
      }
    `
];
Et([
  _({ attribute: !1 })
], G.prototype, "sun", 2);
G = Et([
  K("ha-adapt-sun-config")
], G);
var ce = Object.defineProperty, Ct = (e, t, i, s) => {
  for (var r = void 0, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(t, i, r) || r);
  return r && ce(t, i, r), r;
};
class at extends v {
  /** Run an API mutation and bubble the resulting config (or error) up. */
  async run(t) {
    try {
      const i = await t;
      this.dispatchEvent(
        new CustomEvent("config-changed", {
          detail: i,
          bubbles: !0,
          composed: !0
        })
      );
    } catch (i) {
      this.dispatchEvent(
        new CustomEvent("panel-error", {
          detail: String(i),
          bubbles: !0,
          composed: !0
        })
      );
    }
  }
}
Ct([
  _({ attribute: !1 })
], at.prototype, "config");
Ct([
  _({ attribute: !1 })
], at.prototype, "api");
var de = Object.getOwnPropertyDescriptor, pe = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? de(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(r) || r);
  return r;
};
let tt = class extends at {
  render() {
    const e = this.config.settings, t = (i) => void this.run(this.api.updateSettings(i));
    return h`
      <div class="grid">
        ${x("Interval (s)", e.interval, (i) => t({ interval: i }))}
        ${x(
      "Transition (s)",
      e.transition,
      (i) => t({ transition: i })
    )}
        ${x(
      "Turn-on transition (s)",
      e.initial_transition,
      (i) => t({ initial_transition: i })
    )}
        ${x(
      "Auto-reset override (s)",
      e.autoreset_control,
      (i) => t({ autoreset_control: i })
    )}
      </div>
      <div class="actions">
        ${St(
      "Take over control",
      e.take_over_control,
      (i) => t({ take_over_control: i })
    )}
      </div>
    `;
  }
};
tt.styles = F;
tt = pe([
  K("ha-adapt-settings-tab")
], tt);
var ue = Object.defineProperty, _e = Object.getOwnPropertyDescriptor, b = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? _e(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ue(t, i, r), r;
};
let g = class extends v {
  constructor() {
    super(...arguments), this.preview = !1, this._sel = null, this._previewHour = ne(), this._setActive = () => {
      this.api.setActiveSchema(this._draft.id).then((e) => this._emit("config-changed", e)).catch((e) => this._emit("panel-error", String(e)));
    }, this._delete = () => {
      this._emit("schema-delete", this._draft.id);
    };
  }
  get _active() {
    return this.schema.id === this.config.active_schema_id;
  }
  willUpdate(e) {
    e.has("schema") && this._draft?.id !== this.schema.id && (this._flushSave(), this._draft = structuredClone(this.schema), this._sel = null, this._loadTimeline()), e.has("preview") && e.get("preview") !== void 0 && (this.preview ? this._sendPreview() : this.api.apply());
  }
  disconnectedCallback() {
    this._flushSave(), super.disconnectedCallback();
  }
  // Render/preview the *draft* (unsaved) schema so edits are visible live.
  async _loadTimeline() {
    try {
      this._timeline = await this.api.timeline(this._draft);
    } catch {
      this._timeline = void 0;
    }
  }
  // Called after every edit: fast visual refresh + live preview, with a
  // slower debounce for the actual save.
  _afterEdit() {
    this._scheduleSave(), this._scheduleTimeline(), this.preview && this._sendPreview();
  }
  _scheduleTimeline() {
    window.clearTimeout(this._timelineTimer), this._timelineTimer = window.setTimeout(() => void this._loadTimeline(), 120);
  }
  // --- persistence ---------------------------------------------------------
  _scheduleSave() {
    window.clearTimeout(this._saveTimer), this._saveTimer = window.setTimeout(() => {
      this._saveTimer = void 0, this._saveAndRefresh();
    }, 400);
  }
  _flushSave() {
    this._saveTimer !== void 0 && (window.clearTimeout(this._saveTimer), this._saveTimer = void 0, this._saveAndRefresh());
  }
  async _saveAndRefresh() {
    try {
      const e = await this.api.saveSchema(this._draft);
      this._emit("config-changed", e);
    } catch (e) {
      this._emit("panel-error", String(e));
    }
  }
  _lightCfg(e) {
    return this._draft.lights[e] ?? ee();
  }
  _patchSchema(e) {
    this._draft = { ...this._draft, ...e }, this._afterEdit();
  }
  _patchLight(e, t) {
    const i = { ...this._lightCfg(e), ...t };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [e]: i }
    }, this._afterEdit();
  }
  _setCell(e, t) {
    const s = [...this._lightCfg(e.entityId).hours];
    s[e.hour] = t, this._patchLight(e.entityId, { hours: s });
  }
  // --- render --------------------------------------------------------------
  render() {
    return h`
      <div class="head">
        <h1 class="app-title">Adaptive Lighting</h1>
        <input
          class="name"
          .value=${this._draft.name}
          @input=${(e) => this._patchSchema({ name: e.target.value })}
        />
        <div class="switcher" title="Switch schema">
          <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M8 10l4-4 4 4M8 14l4 4 4-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <select
            @change=${(e) => this._emit("schema-select", e.target.value)}
          >
            ${Object.values(this.config.schemas).map(
      (e) => h`<option
                value=${e.id}
                ?selected=${e.id === this.schema.id}
              >
                ${e.name}${e.id === this.config.active_schema_id ? " (active)" : ""}
              </option>`
    )}
          </select>
        </div>
        <span class="grow"></span>
        <button class="btn ghost" @click=${() => this._emit("schema-new", null)}>
          + New
        </button>
        <button
          class="btn ${this.preview ? "" : "ghost"}"
          @click=${() => this._emit("preview-toggle", !this.preview)}
        >
          Preview
        </button>
        ${this._active ? d : h`<button class="btn ghost" @click=${this._setActive}>
              Set active
            </button>`}
        ${this._draft.id !== "default" ? h`<button class="btn danger" @click=${this._delete}>Delete</button>` : d}
      </div>

      <div class="layout">
        <div class="main">
          <ha-adapt-timeline-grid
            .lights=${this.config.lights}
            .timeline=${this._timeline}
            .selected=${this._sel?.kind === "cell" ? this._sel.ref : null}
            .selectedRow=${this._selectedRow}
            .previewHour=${this._previewHour}
            @select-cell=${(e) => this._onSelectCell(e.detail)}
            @select-light=${(e) => this._sel = { kind: "light", entityId: e.detail }}
            @select-sun=${() => this._sel = { kind: "sun" }}
            @scrub=${(e) => this._onScrub(e.detail)}
          ></ha-adapt-timeline-grid>
        </div>

        <div class="side ${this._sel ? "editing" : ""}">
          ${this._sel ? h`<button
                class="close"
                title="Close"
                @click=${() => this._sel = null}
              >
                ✕
              </button>` : d}
          ${this._renderContext()}
        </div>
      </div>
    `;
  }
  get _selectedRow() {
    const e = this._sel;
    return e ? e.kind === "sun" ? "sun" : e.kind === "light" ? e.entityId : e.ref.entityId : null;
  }
  _renderContext() {
    const e = this._sel;
    return e?.kind === "sun" ? h`<ha-adapt-sun-config
        .sun=${this._draft.sun}
        @sun-changed=${(t) => this._patchSchema({ sun: t.detail })}
      ></ha-adapt-sun-config>` : e?.kind === "light" ? this._renderLightEditor(e.entityId) : e?.kind === "cell" ? this._renderCellEditor(e.ref) : h`<h2>Global settings</h2>
      <ha-adapt-settings-tab
        .config=${this.config}
        .api=${this.api}
      ></ha-adapt-settings-tab>`;
  }
  _renderCellEditor(e) {
    const t = this.config.lights.find((o) => o.entity_id === e.entityId), i = this._lightCfg(e.entityId).hours[e.hour], s = this._timeline?.lights[e.entityId]?.[e.hour], r = i?.brightness ?? s?.brightness ?? 50, n = i?.color_temp ?? s?.color_temp ?? 3e3;
    return h`
      <h2>
        ${t?.name ?? e.entityId} · ${String(e.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${i ? "Explicit override for this hour." : "Following the sun — set a value to override."}
      </p>
      ${f(
      "Brightness",
      r,
      1,
      100,
      1,
      "%",
      (o) => this._setCell(e, { brightness: o, color_temp: n })
    )}
      ${f(
      "Color temp",
      n,
      z,
      I,
      50,
      "K",
      (o) => this._setCell(e, { brightness: r, color_temp: o })
    )}
      ${i ? h`<div class="actions">
            <button class="btn ghost" @click=${() => this._setCell(e, null)}>
              Use sun (clear)
            </button>
          </div>` : d}
    `;
  }
  _renderLightEditor(e) {
    const t = this.config.lights.find((s) => s.entity_id === e), i = this._lightCfg(e);
    return h`
      <h2>${t?.name ?? e}</h2>
      ${f(
      "Min brightness",
      i.min_brightness,
      1,
      100,
      1,
      "%",
      (s) => this._patchLight(e, { min_brightness: s })
    )}
      ${f(
      "Max brightness",
      i.max_brightness,
      1,
      100,
      1,
      "%",
      (s) => this._patchLight(e, { max_brightness: s })
    )}
      ${f(
      "Min color temp",
      i.min_color_temp,
      z,
      I,
      50,
      "K",
      (s) => this._patchLight(e, { min_color_temp: s })
    )}
      ${f(
      "Max color temp",
      i.max_color_temp,
      z,
      I,
      50,
      "K",
      (s) => this._patchLight(e, { max_color_temp: s })
    )}
      <div class="actions">
        ${St(
      "Split commands (IKEA)",
      i.separate_turn_on_commands,
      (s) => this._patchLight(e, { separate_turn_on_commands: s })
    )}
      </div>
    `;
  }
  _onScrub(e) {
    this._previewHour = e, this.preview && this._sendPreview();
  }
  // Selecting an hour cell opens its editor and moves the playhead/preview to
  // that hour.
  _onSelectCell(e) {
    this._sel = { kind: "cell", ref: e }, this._previewHour = e.hour, this.preview && this._sendPreview();
  }
  _sendPreview() {
    window.clearTimeout(this._previewTimer), this._previewTimer = window.setTimeout(() => {
      this.api.preview(this._draft, this._previewHour, !0);
    }, 150);
  }
  _emit(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
    );
  }
};
g.styles = [
  F,
  H`
      .head {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .app-title {
        font-size: 1.15rem;
        font-weight: 700;
        margin: 0;
      }
      input.name {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--text);
        border: none;
        border-bottom: 2px solid var(--border);
        background: transparent;
        border-radius: 0;
        padding: 4px 2px;
        min-width: 0;
        flex: 0 1 260px;
      }
      input.name:focus {
        outline: none;
        border-bottom-color: var(--accent);
      }
      .switcher {
        position: relative;
        display: inline-flex;
        align-items: center;
        color: var(--text-soft);
      }
      .switcher .chev {
        width: 18px;
        height: 18px;
        pointer-events: none;
      }
      .switcher select {
        position: absolute;
        inset: 0;
        width: 100%;
        opacity: 0;
        cursor: pointer;
      }
      .grow {
        flex: 1;
      }
      @media (max-width: 960px) {
        .app-title {
          display: none;
        }
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 16px;
        align-items: stretch;
      }
      /* Let both columns shrink below their content so the timeline scrolls
         internally instead of overflowing the viewport. */
      .main,
      .side {
        min-width: 0;
      }
      /* The side holds global settings flat by default; when something is
         selected it becomes a temporary editing card. */
      .side {
        position: relative;
        align-self: stretch;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .side.editing {
        background: var(--surface);
        border: 1px solid var(--accent);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: 18px;
      }
      .side h2 {
        margin: 0 0 4px;
        font-size: 1.05rem;
        font-weight: 650;
        padding-right: 28px;
      }
      .close {
        position: absolute;
        top: 12px;
        right: 12px;
        border: none;
        background: transparent;
        color: var(--text-soft);
        font-size: 1.1rem;
        line-height: 1;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
      }
      .close:hover {
        color: var(--accent-strong);
        background: var(--accent-soft);
      }
      @media (max-width: 960px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
        /* Flatten the editing card on mobile (no second horizontal padding). */
        .side.editing {
          padding-left: 0;
          padding-right: 0;
          border: none;
          border-radius: 0;
          box-shadow: none;
          background: transparent;
        }
      }
    `
];
b([
  _({ attribute: !1 })
], g.prototype, "schema", 2);
b([
  _({ attribute: !1 })
], g.prototype, "config", 2);
b([
  _({ attribute: !1 })
], g.prototype, "api", 2);
b([
  _({ type: Boolean })
], g.prototype, "preview", 2);
b([
  S()
], g.prototype, "_draft", 2);
b([
  S()
], g.prototype, "_timeline", 2);
b([
  S()
], g.prototype, "_sel", 2);
b([
  S()
], g.prototype, "_previewHour", 2);
g = b([
  K("ha-adapt-schema-editor")
], g);
var ge = Object.defineProperty, fe = Object.getOwnPropertyDescriptor, k = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? fe(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && ge(t, i, r), r;
};
let $ = class extends v {
  constructor() {
    super(...arguments), this.narrow = !1, this._preview = !1, this._loaded = !1;
  }
  updated() {
    this.hass && (this._api ? this._api.setHass(this.hass) : this._api = new Qt(this.hass), this._loaded || (this._loaded = !0, this._load()));
  }
  async _load() {
    try {
      this._config = await this._api.getConfig(), this._error = void 0;
    } catch (e) {
      this._error = String(e);
    }
  }
  get _currentId() {
    const e = this._config;
    return this._selectedId && e.schemas[this._selectedId] ? this._selectedId : e.active_schema_id;
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
    const e = this._config, t = this._currentId, i = e.schemas[t];
    return h`<div
      class="wrap"
      @config-changed=${this._onConfigChanged}
      @panel-error=${this._onError}
      @preview-toggle=${(s) => this._preview = s.detail}
      @schema-select=${(s) => this._selectedId = s.detail}
      @schema-new=${() => void this._new()}
    >
      ${this._error ? h`<div class="card error">${this._error}</div>` : d}

      ${i ? h`<ha-adapt-schema-editor
            .schema=${i}
            .config=${e}
            .api=${this._api}
            .preview=${this._preview}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>` : d}
    </div>`;
  }
  async _new() {
    const e = `schema_${Date.now().toString(36)}`;
    this._selectedId = e, await this._run(this._api.saveSchema(ie(e, "New schema")));
  }
  async _onDelete(e) {
    this._selectedId = this._config.active_schema_id, await this._run(this._api.deleteSchema(e.detail));
  }
  async _run(e) {
    try {
      this._config = await e, this._error = void 0;
    } catch (t) {
      this._error = String(t);
    }
  }
};
$.styles = [
  Yt,
  F,
  H`
      .wrap {
        width: 100%;
        padding: 18px 20px 64px;
        overflow-x: clip;
      }
      .error {
        border-color: var(--danger);
        color: var(--danger);
      }
      @media (max-width: 960px) {
        .wrap {
          padding-left: 12px;
          padding-right: 12px;
        }
      }
    `
];
k([
  _({ attribute: !1 })
], $.prototype, "hass", 2);
k([
  _({ attribute: !1 })
], $.prototype, "narrow", 2);
k([
  S()
], $.prototype, "_config", 2);
k([
  S()
], $.prototype, "_error", 2);
k([
  S()
], $.prototype, "_selectedId", 2);
k([
  S()
], $.prototype, "_preview", 2);
$ = k([
  K("ha-adapt-panel")
], $);
export {
  $ as HaAdaptPanel
};
