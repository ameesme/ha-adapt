/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, et = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), lt = /* @__PURE__ */ new WeakMap();
let wt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== st) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (et && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = lt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && lt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const kt = (e) => new wt(typeof e == "string" ? e : e + "", void 0, st), H = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new wt(s, e, st);
}, Tt = (e, t) => {
  if (et) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = q.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, ct = et ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return kt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Ot, getOwnPropertyDescriptor: Ht, getOwnPropertyNames: Rt, getOwnPropertySymbols: Ut, getPrototypeOf: Nt } = Object, Z = globalThis, ht = Z.trustedTypes, zt = ht ? ht.emptyScript : "", It = Z.reactiveElementPolyfillSupport, N = (e, t) => e, W = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? zt : null;
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
} }, it = (e, t) => !Mt(e, t), dt = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ??= Symbol("metadata"), Z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = dt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Ot(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = Ht(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const s = this.properties, i = [...Rt(s), ...Ut(s)];
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
    return Tt(t, this.constructor.elementStyles), t;
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
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : W).toAttribute(s, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : W;
      this._$Em = r;
      const l = o.fromAttribute(s, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? it)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
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
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[N("elementProperties")] = /* @__PURE__ */ new Map(), T[N("finalized")] = /* @__PURE__ */ new Map(), It?.({ ReactiveElement: T }), (Z.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, pt = (e) => e, G = rt.trustedTypes, ut = G ? G.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, xt = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, yt = "?" + x, Lt = `<${yt}>`, P = document, L = () => P.createComment(""), j = (e) => e === null || typeof e != "object" && typeof e != "function", nt = Array.isArray, jt = (e) => nt(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, _t = />/g, E = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, mt = /"/g, At = /^(?:script|style|textarea|title)$/i, Dt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), c = Dt(1), M = Symbol.for("lit-noChange"), h = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), C = P.createTreeWalker(P, 129);
function St(e, t) {
  if (!nt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const Bt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let l = 0; l < s; l++) {
    const a = e[l];
    let p, u, d = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, u = o.exec(a), u !== null); ) m = o.lastIndex, o === U ? u[1] === "!--" ? o = gt : u[1] !== void 0 ? o = _t : u[2] !== void 0 ? (At.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = E) : u[3] !== void 0 && (o = E) : o === E ? u[0] === ">" ? (o = r ?? U, d = -1) : u[1] === void 0 ? d = -2 : (d = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? E : u[3] === '"' ? mt : ft) : o === mt || o === ft ? o = E : o === gt || o === _t ? o = U : (o = E, r = void 0);
    const w = o === E && e[l + 1].startsWith("/>") ? " " : "";
    n += o === U ? a + Lt : d >= 0 ? (i.push(p), a.slice(0, d) + xt + a.slice(d) + x + w) : a + x + (d === -2 ? l : w);
  }
  return [St(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class D {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [p, u] = Bt(t, s);
    if (this.el = D.createElement(p, i), C.currentNode = this.el.content, s === 2 || s === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = C.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(xt)) {
          const m = u[o++], w = r.getAttribute(d).split(x), V = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: n, name: V[2], strings: w, ctor: V[1] === "." ? Kt : V[1] === "?" ? Vt : V[1] === "@" ? qt : X }), r.removeAttribute(d);
        } else d.startsWith(x) && (a.push({ type: 6, index: n }), r.removeAttribute(d));
        if (At.test(r.tagName)) {
          const d = r.textContent.split(x), m = d.length - 1;
          if (m > 0) {
            r.textContent = G ? G.emptyScript : "";
            for (let w = 0; w < m; w++) r.append(d[w], L()), C.nextNode(), a.push({ type: 2, index: ++n });
            r.append(d[m], L());
          }
        }
      } else if (r.nodeType === 8) if (r.data === yt) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(x, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += x.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = P.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(e, t, s = e, i) {
  if (t === M) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = j(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = O(e, r._$AS(e, t.values), r, i)), t;
}
class Ft {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? P).importNode(s, !0);
    C.currentNode = r;
    let n = C.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let p;
        a.type === 2 ? p = new B(n, n.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (p = new Wt(n, this, t)), this._$AV.push(p), a = i[++l];
      }
      o !== a?.index && (n = C.nextNode(), o++);
    }
    return C.currentNode = P, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class B {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = O(this, t, s), j(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && j(this._$AH) ? this._$AA.nextSibling.data = t : this.T(P.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = D.createElement(St(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const n = new Ft(r, this), o = n.u(this.options);
      n.p(s), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = vt.get(t.strings);
    return s === void 0 && vt.set(t.strings, s = new D(t)), s;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new B(this.O(L()), this.O(L()), this, this.options)) : i = s[r], i._$AI(n), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = pt(t).nextSibling;
      pt(t).remove(), t = i;
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
  constructor(t, s, i, r, n) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = O(this, t, s, 0), o = !j(t) || t !== this._$AH && t !== M, o && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = n[0], a = 0; a < n.length - 1; a++) p = O(this, l[i + a], s, a), p === M && (p = this._$AH[a]), o ||= !j(p) || p !== this._$AH[a], p === h ? t = h : t !== h && (t += (p ?? "") + n[a + 1]), this._$AH[a] = p;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Kt extends X {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Vt extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class qt extends X {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = O(this, t, s, 0) ?? h) === M) return;
    const i = this._$AH, r = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== h && (i === h || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Wt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const Gt = rt.litHtmlPolyfillSupport;
Gt?.(D, B), (rt.litHtmlVersions ??= []).push("3.3.3");
const Jt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = r = new B(t.insertBefore(L(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis;
class v extends T {
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
    return M;
  }
}
v._$litElement$ = !0, v.finalized = !0, ot.litElementHydrateSupport?.({ LitElement: v });
const Zt = ot.litElementPolyfillSupport;
Zt?.({ LitElement: v });
(ot.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xt = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: it }, Qt = (e = Xt, t, s) => {
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
function g(e) {
  return (t, s) => typeof s == "object" ? Qt(e, t, s) : ((i, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function S(e) {
  return g({ ...e, state: !0, attribute: !1 });
}
class Yt {
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
  // Pass the (possibly unsaved) draft schema so the timeline/preview reflect
  // edits live, without persisting on every change.
  timeline(t) {
    return this.send("ha_adapt/timeline", { schema: t });
  }
  preview(t, s, i) {
    return this.send("ha_adapt/preview", { schema: t, hour: s, apply: i });
  }
  apply(t) {
    return this.send("ha_adapt/apply", t ? { entity_id: t } : {});
  }
  send(t, s = {}) {
    return this.hass.connection.sendMessagePromise({ type: t, ...s });
  }
}
const te = H`
  :host {
    --bg: #fbf3e9;
    --surface: #fffaf2;
    --surface-alt: #f9f0e4;
    --border: #dec4a1;
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
`, K = H`
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

  /* Sub-heading shown directly under an editor's title (e.g. a light's area). */
  .subtitle {
    margin: -6px 0 10px;
    color: var(--text-soft);
    font-size: 0.82rem;
  }

  /* Inline caution note inside an editor. */
  .warn {
    margin: 10px 0 0;
    padding: 8px 10px;
    font-size: 0.8rem;
    line-height: 1.35;
    color: var(--danger);
    background: var(--accent-soft);
    border-left: 3px solid var(--danger);
    border-radius: 6px;
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
function ee() {
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
function se() {
  return {
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    separate_turn_on_commands: !1,
    limit_mode: "cap",
    hours: Array.from({ length: 24 }, () => null)
  };
}
function ie(e, t) {
  return { id: e, name: t, sun: ee(), lights: {} };
}
function re(e) {
  const t = Math.max(1e3, Math.min(12e3, e)) / 100;
  let s, i, r;
  t <= 66 ? (s = 255, i = 99.47 * Math.log(t) - 161.12) : (s = 329.7 * Math.pow(t - 60, -0.1332), i = 288.12 * Math.pow(t - 60, -0.0755)), t >= 66 ? r = 255 : t <= 19 ? r = 0 : r = 138.52 * Math.log(t - 10) - 305.04;
  const n = (o) => Math.max(0, Math.min(255, Math.round(o)));
  return `rgb(${n(s)}, ${n(i)}, ${n(r)})`;
}
function ne(e) {
  return String(e).padStart(2, "0");
}
function oe(e) {
  return "#" + e.map((t) => Math.max(0, Math.min(255, Math.round(t))).toString(16).padStart(2, "0")).join("");
}
function ae(e) {
  const t = e.replace("#", "");
  return [
    parseInt(t.slice(0, 2), 16) || 0,
    parseInt(t.slice(2, 4), 16) || 0,
    parseInt(t.slice(4, 6), 16) || 0
  ];
}
function le() {
  const e = /* @__PURE__ */ new Date();
  return e.getHours() + e.getMinutes() / 60;
}
function y(e, t, s) {
  return c`<label class="field"
    >${e}
    <input
      type="number"
      .value=${String(t)}
      @change=${(i) => s(Number(i.target.value))}
    />
  </label>`;
}
function $t(e, t, s) {
  return c`<label class="field"
    >${e}
    <input
      type="number"
      step="any"
      placeholder="HA location"
      .value=${t != null ? String(t) : ""}
      @change=${(i) => {
    const r = i.target.value.trim(), n = Number(r);
    s(r === "" || !Number.isFinite(n) ? null : n);
  }}
    />
  </label>`;
}
function f(e, t, s, i, r, n, o) {
  return c`<label class="field">
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
  return c`<label class="field"
    >${e}
    <input
      type="time"
      step="1"
      .value=${t ?? ""}
      @change=${(i) => s(i.target.value || null)}
    />
  </label>`;
}
function Et(e, t, s) {
  return c`<label class="toggle">
    <input
      type="checkbox"
      .checked=${t}
      @change=${(i) => s(i.target.checked)}
    />
    ${e}
  </label>`;
}
function ce(e, t, s, i) {
  return c`<label class="field"
    >${e}
    <select
      @change=${(r) => i(r.target.value)}
    >
      ${s.map(
    (r) => c`<option value=${r.value} ?selected=${r.value === t}>
            ${r.label}
          </option>`
  )}
    </select>
  </label>`;
}
var he = Object.defineProperty, de = Object.getOwnPropertyDescriptor, R = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? de(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && he(t, s, r), r;
};
let A = class extends v {
  constructor() {
    super(...arguments), this.lights = [], this.selected = null, this.selectedRow = null, this.previewHour = 12;
  }
  render() {
    if (!this.timeline)
      return c`<div class="card"><div class="empty">Loading timeline…</div></div>`;
    const e = Math.floor(this.previewHour) % 24;
    return c`<div class="card">
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
      <div class="legend">
        <span class="legend-item"><span class="legend-dot sun-controlled"></span>Sun-controlled</span>
        <span class="legend-item"><span class="legend-dot overridden"></span>Overridden</span>
        <span class="legend-item"><span class="legend-dot selected"></span>Selected</span>
      </div>
    </div>`;
  }
  _scrubRow() {
    const e = Math.floor(this.previewHour), t = Math.round((this.previewHour - e) * 60), s = `${String(e).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
    return c`<div class="gridrow scrubrow">
      <div class="label">
        <span class="clock">${s}</span>
        <button class="now-btn" @click=${this._jumpToNow} title="Jump to now">now</button>
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
  _jumpToNow() {
    const e = /* @__PURE__ */ new Date(), t = e.getHours() + e.getMinutes() / 60;
    this._emit("scrub", t);
  }
  _headerRow(e) {
    return c`<div class="gridrow">
      <div class="label"></div>
      ${Y.map(
      (t) => c`<div class="hourhead ${t === e ? "now" : ""}">
          ${ne(t)}
        </div>`
    )}
    </div>`;
  }
  _sunRow(e) {
    const t = this.timeline.sun, s = this.selectedRow === "sun" ? "rowselected" : "";
    return c`<div class="gridrow sunrow ${s}">
      <div
        class="label clickable"
        title="Edit the sun"
        @click=${() => this._emit("select-sun", null)}
      >
        <span class="text-col">
          <span class="lname">☀️ Sun</span>
        </span>
        ${this._cogIcon()}
      </div>
      ${Y.map(
      (i) => this._cell(t[i], i === e, "readonly", !1, !1)
    )}
    </div>`;
  }
  _lightRow(e, t) {
    const s = this.timeline.lights[e.entity_id] ?? [], i = this.selectedRow === e.entity_id ? "rowselected" : "";
    return c`<div class="gridrow ${i}">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", e.entity_id)}
      >
        <span class="text-col">
          ${e.area_name ? c`<span class="area">${e.area_name}</span>` : ""}
          <span class="lname">${e.name}</span>
        </span>
        ${this._cogIcon()}
      </div>
      ${Y.map((r) => {
      const n = s[r], o = this.selected?.entityId === e.entity_id && this.selected?.hour === r;
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
  _cell(e, t, s, i, r, n) {
    const o = e ? e.brightness : 0, l = e && "rgb_color" in e ? e.rgb_color : null, a = e ? l ? `rgb(${l[0]}, ${l[1]}, ${l[2]})` : re(e.color_temp) : "transparent", p = [
      "cell",
      s,
      i ? "explicit" : "",
      r ? "selected" : "",
      t ? "now" : ""
    ].join(" ");
    return c`<div
      class=${p}
      @click=${n}
      title=${e ? `${e.brightness}% · ${e.color_temp} K` : ""}
    >
      <div class="fill" style="height:${o}%;background:${a}"></div>
    </div>`;
  }
  _cogIcon() {
    return c`<svg class="cog" viewBox="0 0 24 24" aria-hidden="true">
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
  K,
  H`
      :host {
        display: block;
        height: 100%;
      }
      .card {
        box-sizing: border-box;
      }
      .scroll {
        max-width: 100%;
        padding-bottom: 6px;
      }
      .rows {
        display: flex;
        flex-direction: column;
        gap: 1px;
      }
      .gridrow {
        display: grid;
        grid-template-columns: 100px repeat(24, 1fr);
        gap: 1px;
        align-items: center;
      }
      .label {
        z-index: 3;
        align-self: stretch;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        padding-right: 4px;
      }
      .label .text-col {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .label .area {
        font-size: 0.65rem;
        font-weight: 400;
        color: var(--text-soft);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label .lname {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label.clickable {
        cursor: pointer;
      }
      .label .cog {
        width: 12px;
        height: 12px;
        flex: none;
        opacity: 0.4;
      }
      .label.clickable:hover .cog {
        opacity: 0.9;
      }
      .sunrow .label {
        color: var(--accent-strong);
      }
      .gridrow.rowselected .label {
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
      .now-btn {
        background: none;
        border: none;
        padding: 0;
        margin-left: auto;
        font-size: 0.7rem;
        color: var(--text-soft);
        cursor: pointer;
        text-transform: lowercase;
      }
      .now-btn:hover {
        color: var(--accent-strong);
      }
      .cell {
        position: relative;
        height: 42px;
        background: var(--surface-alt);
        overflow: hidden;
        cursor: pointer;
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
        background: var(--border);
      }
      .cell.selected {
        border: 2px var(--accent-strong) solid;
      }
      .legend {
        display: flex;
        justify-content: flex-end;
        gap: 16px;
        padding-top: 10px;
        font-size: 0.75rem;
        color: var(--text-soft);
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      .legend-dot.sun-controlled {
        background: var(--surface-alt);
      }
      .legend-dot.overridden {
        background: var(--border);
      }
      .legend-dot.selected {
        background: var(--surface-alt);
        border: 2px var(--accent-strong) solid;
      }
      @media (max-width: 960px) {
        .card {
          padding: 0;
        }
      }
    `
];
R([
  g({ attribute: !1 })
], A.prototype, "lights", 2);
R([
  g({ attribute: !1 })
], A.prototype, "timeline", 2);
R([
  g({ attribute: !1 })
], A.prototype, "selected", 2);
R([
  g({ attribute: !1 })
], A.prototype, "selectedRow", 2);
R([
  g({ type: Number })
], A.prototype, "previewHour", 2);
A = R([
  F("ha-adapt-timeline-grid")
], A);
var pe = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, Ct = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ue(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && pe(t, s, r), r;
};
let J = class extends v {
  render() {
    const e = this.sun;
    return c`
      <h2>☀️ Sun</h2>
      <p class="muted">
        The sun drives every light's fallback. Empty timeline cells follow it.
      </p>
      <div class="grid">
        ${f(
      "Min brightness",
      e.min_brightness,
      0,
      100,
      1,
      "%",
      (t) => this._patch({ min_brightness: t })
    )}
        ${f(
      "Max brightness",
      e.max_brightness,
      0,
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
        ${y(
      "Sunrise offset (s)",
      e.sunrise_offset,
      (t) => this._patch({ sunrise_offset: t })
    )}
        ${y(
      "Sunset offset (s)",
      e.sunset_offset,
      (t) => this._patch({ sunset_offset: t })
    )}
        ${y(
      "Ramp – dark side (s)",
      e.ramp_dark,
      (t) => this._patch({ ramp_dark: t })
    )}
        ${y(
      "Ramp – light side (s)",
      e.ramp_light,
      (t) => this._patch({ ramp_light: t })
    )}
      </div>
      ${e.min_brightness <= 0 ? c`<p class="warn">
            At 0% lights following the sun can turn off at night, and adaptation
            won't turn them back on automatically.
          </p>` : h}
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
J.styles = [
  K,
  H`
      h2 {
        margin: 0 0 4px;
        font-size: 1.05rem;
        font-weight: 650;
      }
    `
];
Ct([
  g({ attribute: !1 })
], J.prototype, "sun", 2);
J = Ct([
  F("ha-adapt-sun-config")
], J);
var ge = Object.defineProperty, Pt = (e, t, s, i) => {
  for (var r = void 0, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(t, s, r) || r);
  return r && ge(t, s, r), r;
};
class at extends v {
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
Pt([
  g({ attribute: !1 })
], at.prototype, "config");
Pt([
  g({ attribute: !1 })
], at.prototype, "api");
var _e = Object.getOwnPropertyDescriptor, fe = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? _e(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(r) || r);
  return r;
};
let tt = class extends at {
  render() {
    const e = this.config.settings, t = (s) => void this.run(this.api.updateSettings(s));
    return c`
      <div class="grid">
        ${y("Interval (s)", e.interval, (s) => t({ interval: s }))}
        ${y(
      "Transition (s)",
      e.transition,
      (s) => t({ transition: s })
    )}
        ${y(
      "Turn-on transition (s)",
      e.initial_transition,
      (s) => t({ initial_transition: s })
    )}
        ${y(
      "Auto-reset override (s)",
      e.autoreset_control,
      (s) => t({ autoreset_control: s })
    )}
        ${$t(
      "Sun latitude",
      e.sun_latitude,
      (s) => t({ sun_latitude: s })
    )}
        ${$t(
      "Sun longitude",
      e.sun_longitude,
      (s) => t({ sun_longitude: s })
    )}
      </div>
      <p class="muted">
        Leave the coordinates blank to use Home Assistant's own location for sun
        calculation.
      </p>
      <div class="actions">
        ${Et(
      "Take over control",
      e.take_over_control,
      (s) => t({ take_over_control: s })
    )}
      </div>
    `;
  }
};
tt.styles = K;
tt = fe([
  F("ha-adapt-settings-tab")
], tt);
var me = Object.defineProperty, ve = Object.getOwnPropertyDescriptor, b = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ve(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && me(t, s, r), r;
};
let _ = class extends v {
  constructor() {
    super(...arguments), this.preview = !1, this._sel = null, this._previewHour = le(), this._setActive = () => {
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
    return this._draft.lights[e] ?? se();
  }
  _patchSchema(e) {
    this._draft = { ...this._draft, ...e }, this._afterEdit();
  }
  _patchLight(e, t) {
    const s = { ...this._lightCfg(e), ...t };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [e]: s }
    }, this._afterEdit();
  }
  _setCell(e, t) {
    const i = [...this._lightCfg(e.entityId).hours];
    i[e.hour] = t, this._patchLight(e.entityId, { hours: i });
  }
  // --- render --------------------------------------------------------------
  render() {
    return c`
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
      (e) => c`<option
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
        ${this._active ? h : c`<button class="btn ghost" @click=${this._setActive}>
              Set active
            </button>`}
        ${this._draft.id !== "default" ? c`<button class="btn danger" @click=${this._delete}>Delete</button>` : h}
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
          ${this._sel ? c`<button
                class="close"
                title="Close"
                @click=${() => this._sel = null}
              >
                ✕
              </button>` : h}
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
    return e?.kind === "sun" ? c`<ha-adapt-sun-config
        .sun=${this._draft.sun}
        @sun-changed=${(t) => this._patchSchema({ sun: t.detail })}
      ></ha-adapt-sun-config>` : e?.kind === "light" ? this._renderLightEditor(e.entityId) : e?.kind === "cell" ? this._renderCellEditor(e.ref) : c`<h2>Global settings</h2>
      <ha-adapt-settings-tab
        .config=${this.config}
        .api=${this.api}
      ></ha-adapt-settings-tab>`;
  }
  _renderCellEditor(e) {
    const t = this.config.lights.find((a) => a.entity_id === e.entityId), s = this._lightCfg(e.entityId).hours[e.hour], i = this._timeline?.lights[e.entityId]?.[e.hour], r = s?.brightness ?? i?.brightness ?? 50, n = s?.color_temp ?? i?.color_temp ?? 3e3, o = s?.rgb_color ?? null, l = (a) => this._setCell(e, {
      brightness: r,
      color_temp: n,
      rgb_color: o,
      ...a
    });
    return c`
      <h2>
        ${t?.name ?? e.entityId} · ${String(e.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${s ? "Explicit override for this hour." : "Following the sun — set a value to override."}
      </p>
      ${f(
      "Brightness",
      r,
      0,
      100,
      1,
      "%",
      (a) => l({ brightness: a })
    )}
      ${r <= 0 ? c`<p class="warn">
            At 0% this light turns off at this hour, and adaptation won't turn it
            back on automatically.
          </p>` : h}
      ${f(
      "Color temp",
      n,
      z,
      I,
      50,
      "K",
      (a) => l({ color_temp: a })
    )}
      ${t?.supports_rgb ? c`<label class="toggle">
              <input
                type="checkbox"
                .checked=${o !== null}
                @change=${(a) => l({
      rgb_color: a.target.checked ? o ?? [255, 255, 255] : null
    })}
              />
              RGB colour (overrides temp)
            </label>
            ${o !== null ? c`<input
                  type="color"
                  .value=${oe(o)}
                  @input=${(a) => l({
      rgb_color: ae(a.target.value)
    })}
                />` : h}` : h}
      ${s ? c`<div class="actions">
            <button class="btn ghost" @click=${() => this._setCell(e, null)}>
              Use sun (clear)
            </button>
          </div>` : h}
    `;
  }
  _renderLightEditor(e) {
    const t = this.config.lights.find((i) => i.entity_id === e), s = this._lightCfg(e);
    return c`
      <h2>${t?.name ?? e}</h2>
      ${t?.area_name ? c`<p class="subtitle">${t.area_name}</p>` : h}
      ${f(
      "Min brightness",
      s.min_brightness,
      0,
      100,
      1,
      "%",
      (i) => this._patchLight(e, { min_brightness: i })
    )}
      ${s.min_brightness <= 0 ? c`<p class="warn">
            At 0% this light can turn off during the day, and adaptation won't
            turn it back on automatically.
          </p>` : h}
      ${f(
      "Max brightness",
      s.max_brightness,
      0,
      100,
      1,
      "%",
      (i) => this._patchLight(e, { max_brightness: i })
    )}
      ${f(
      "Min color temp",
      s.min_color_temp,
      z,
      I,
      50,
      "K",
      (i) => this._patchLight(e, { min_color_temp: i })
    )}
      ${f(
      "Max color temp",
      s.max_color_temp,
      z,
      I,
      50,
      "K",
      (i) => this._patchLight(e, { max_color_temp: i })
    )}
      ${ce(
      "Limits",
      s.limit_mode,
      [
        { value: "cap", label: "Cap (clamp to range)" },
        { value: "scale", label: "Scale (map onto range)" }
      ],
      (i) => this._patchLight(e, { limit_mode: i })
    )}
      <p class="muted">
        Cap tracks the sun and clamps to this range; Scale sweeps the whole range
        across the day.
      </p>
      <div class="actions">
        ${Et(
      "Split commands",
      s.separate_turn_on_commands,
      (i) => this._patchLight(e, { separate_turn_on_commands: i })
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
_.styles = [
  K,
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
      input[type="color"] {
        width: 52px;
        height: 34px;
        padding: 2px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: var(--surface);
        cursor: pointer;
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
  g({ attribute: !1 })
], _.prototype, "schema", 2);
b([
  g({ attribute: !1 })
], _.prototype, "config", 2);
b([
  g({ attribute: !1 })
], _.prototype, "api", 2);
b([
  g({ type: Boolean })
], _.prototype, "preview", 2);
b([
  S()
], _.prototype, "_draft", 2);
b([
  S()
], _.prototype, "_timeline", 2);
b([
  S()
], _.prototype, "_sel", 2);
b([
  S()
], _.prototype, "_previewHour", 2);
_ = b([
  F("ha-adapt-schema-editor")
], _);
var $e = Object.defineProperty, be = Object.getOwnPropertyDescriptor, k = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? be(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && $e(t, s, r), r;
};
let $ = class extends v {
  constructor() {
    super(...arguments), this.narrow = !1, this._preview = !1, this._loaded = !1;
  }
  updated() {
    this.hass && (this._api ? this._api.setHass(this.hass) : this._api = new Yt(this.hass), this._loaded || (this._loaded = !0, this._load()));
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
      return c`<div class="wrap">
        <div class="empty">${this._error ?? "Loading…"}</div>
      </div>`;
    const e = this._config, t = this._currentId, s = e.schemas[t];
    return c`<div
      class="wrap"
      @config-changed=${this._onConfigChanged}
      @panel-error=${this._onError}
      @preview-toggle=${(i) => this._preview = i.detail}
      @schema-select=${(i) => this._selectedId = i.detail}
      @schema-new=${() => void this._new()}
    >
      ${this._error ? c`<div class="card error">${this._error}</div>` : h}

      ${s ? c`<ha-adapt-schema-editor
            .schema=${s}
            .config=${e}
            .api=${this._api}
            .preview=${this._preview}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>` : h}
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
  te,
  K,
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
  g({ attribute: !1 })
], $.prototype, "hass", 2);
k([
  g({ attribute: !1 })
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
  F("ha-adapt-panel")
], $);
export {
  $ as HaAdaptPanel
};
