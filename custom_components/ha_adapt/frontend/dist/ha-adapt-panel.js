/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, Q = z.ShadowRoot && (z.ShadyCSS === void 0 || z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, X = Symbol(), nt = /* @__PURE__ */ new WeakMap();
let yt = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== X) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (Q && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = nt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && nt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ct = (s) => new yt(typeof s == "string" ? s : s + "", void 0, X), F = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, r, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[n + 1], s[0]);
  return new yt(e, s, X);
}, Pt = (s, t) => {
  if (Q) s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), r = z.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, at = Q ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return Ct(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ot, defineProperty: Mt, getOwnPropertyDescriptor: kt, getOwnPropertyNames: Tt, getOwnPropertySymbols: Ut, getPrototypeOf: Ht } = Object, V = globalThis, ot = V.trustedTypes, Nt = ot ? ot.emptyScript : "", Rt = V.reactiveElementPolyfillSupport, M = (s, t) => s, K = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Nt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, Y = (s, t) => !Ot(s, t), ht = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: Y };
Symbol.metadata ??= Symbol("metadata"), V.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = ht) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Mt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: n } = kt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: r, set(a) {
      const l = r?.call(this);
      n?.call(this, a), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ht;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const t = Ht(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const e = this.properties, i = [...Tt(e), ...Ut(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(at(r));
    } else t !== void 0 && e.push(at(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
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
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : K).toAttribute(e, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : K;
      this._$Em = r;
      const l = a.fromAttribute(e, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, r = !1, n) {
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), i ??= a.getPropertyOptions(t), !((i.hasChanged ?? Y)(n, e) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: n }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
        const { wrapped: a } = n, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[M("elementProperties")] = /* @__PURE__ */ new Map(), A[M("finalized")] = /* @__PURE__ */ new Map(), Rt?.({ ReactiveElement: A }), (V.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt = globalThis, lt = (s) => s, q = tt.trustedTypes, ct = q ? q.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, xt = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + g, Dt = `<${At}>`, x = document, k = () => x.createComment(""), T = (s) => s === null || typeof s != "object" && typeof s != "function", et = Array.isArray, jt = (s) => et(s) || typeof s?.[Symbol.iterator] == "function", Z = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, dt = /-->/g, pt = />/g, v = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ut = /'/g, _t = /"/g, wt = /^(?:script|style|textarea|title)$/i, It = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), h = It(1), w = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ft = /* @__PURE__ */ new WeakMap(), b = x.createTreeWalker(x, 129);
function St(s, t) {
  if (!et(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Lt = (s, t) => {
  const e = s.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = O;
  for (let l = 0; l < e; l++) {
    const o = s[l];
    let u, _, d = -1, f = 0;
    for (; f < o.length && (a.lastIndex = f, _ = a.exec(o), _ !== null); ) f = a.lastIndex, a === O ? _[1] === "!--" ? a = dt : _[1] !== void 0 ? a = pt : _[2] !== void 0 ? (wt.test(_[2]) && (r = RegExp("</" + _[2], "g")), a = v) : _[3] !== void 0 && (a = v) : a === v ? _[0] === ">" ? (a = r ?? O, d = -1) : _[1] === void 0 ? d = -2 : (d = a.lastIndex - _[2].length, u = _[1], a = _[3] === void 0 ? v : _[3] === '"' ? _t : ut) : a === _t || a === ut ? a = v : a === dt || a === pt ? a = O : (a = v, r = void 0);
    const m = a === v && s[l + 1].startsWith("/>") ? " " : "";
    n += a === O ? o + Dt : d >= 0 ? (i.push(u), o.slice(0, d) + xt + o.slice(d) + g + m) : o + g + (d === -2 ? l : m);
  }
  return [St(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const l = t.length - 1, o = this.parts, [u, _] = Lt(t, e);
    if (this.el = U.createElement(u, i), b.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = b.nextNode()) !== null && o.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(xt)) {
          const f = _[a++], m = r.getAttribute(d).split(g), L = /([.?@])?(.*)/.exec(f);
          o.push({ type: 1, index: n, name: L[2], strings: m, ctor: L[1] === "." ? Bt : L[1] === "?" ? Kt : L[1] === "@" ? qt : W }), r.removeAttribute(d);
        } else d.startsWith(g) && (o.push({ type: 6, index: n }), r.removeAttribute(d));
        if (wt.test(r.tagName)) {
          const d = r.textContent.split(g), f = d.length - 1;
          if (f > 0) {
            r.textContent = q ? q.emptyScript : "";
            for (let m = 0; m < f; m++) r.append(d[m], k()), b.nextNode(), o.push({ type: 2, index: ++n });
            r.append(d[f], k());
          }
        }
      } else if (r.nodeType === 8) if (r.data === At) o.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(g, d + 1)) !== -1; ) o.push({ type: 7, index: n }), d += g.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const i = x.createElement("template");
    return i.innerHTML = t, i;
  }
}
function S(s, t, e = s, i) {
  if (t === w) return t;
  let r = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const n = T(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = r : e._$Cl = r), r !== void 0 && (t = S(s, r._$AS(s, t.values), r, i)), t;
}
class zt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, r = (t?.creationScope ?? x).importNode(e, !0);
    b.currentNode = r;
    let n = b.nextNode(), a = 0, l = 0, o = i[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let u;
        o.type === 2 ? u = new R(n, n.nextSibling, this, t) : o.type === 1 ? u = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (u = new Ft(n, this, t)), this._$AV.push(u), o = i[++l];
      }
      a !== o?.index && (n = b.nextNode(), a++);
    }
    return b.currentNode = x, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = S(this, t, e), T(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== w && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && T(this._$AH) ? this._$AA.nextSibling.data = t : this.T(x.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(St(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new zt(r, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ft.get(t.strings);
    return e === void 0 && ft.set(t.strings, e = new U(t)), e;
  }
  k(t) {
    et(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const n of t) r === e.length ? e.push(i = new R(this.O(k()), this.O(k()), this, this.options)) : i = e[r], i._$AI(n), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = lt(t).nextSibling;
      lt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, e = this, i, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = S(this, t, e, 0), a = !T(t) || t !== this._$AH && t !== w, a && (this._$AH = t);
    else {
      const l = t;
      let o, u;
      for (t = n[0], o = 0; o < n.length - 1; o++) u = S(this, l[i + o], e, o), u === w && (u = this._$AH[o]), a ||= !T(u) || u !== this._$AH[o], u === c ? t = c : t !== c && (t += (u ?? "") + n[o + 1]), this._$AH[o] = u;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Bt extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Kt extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class qt extends W {
  constructor(t, e, i, r, n) {
    super(t, e, i, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = S(this, t, e, 0) ?? c) === w) return;
    const i = this._$AH, r = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ft {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    S(this, t);
  }
}
const Vt = tt.litHtmlPolyfillSupport;
Vt?.(U, R), (tt.litHtmlVersions ??= []).push("3.3.3");
const Wt = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    i._$litPart$ = r = new R(t.insertBefore(k(), n), n, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis;
class y extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Wt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
y._$litElement$ = !0, y.finalized = !0, st.litElementHydrateSupport?.({ LitElement: y });
const Zt = st.litElementPolyfillSupport;
Zt?.({ LitElement: y });
(st.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gt = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: Y }, Jt = (s = Gt, t, e) => {
  const { kind: i, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), n.set(e.name, s), i === "accessor") {
    const { name: a } = e;
    return { set(l) {
      const o = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, o, s, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: a } = e;
    return function(l) {
      const o = this[a];
      t.call(this, l), this.requestUpdate(a, o, s, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function E(s) {
  return (t, e) => typeof e == "object" ? Jt(s, t, e) : ((i, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(s) {
  return E({ ...s, state: !0, attribute: !1 });
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
    return this.send("ha_adapt/delete_schema", {
      schema_id: t
    });
  }
  assignLight(t, e) {
    return this.send("ha_adapt/assign_light", {
      entity_id: t,
      schema_id: e
    });
  }
  setManualControl(t, e) {
    return this.send("ha_adapt/set_manual_control", {
      entity_id: t,
      manual_control: e
    });
  }
  apply(t) {
    return this.send(
      "ha_adapt/apply",
      t ? { entity_id: t } : {}
    );
  }
  export() {
    return this.send("ha_adapt/export");
  }
  import(t) {
    return this.send("ha_adapt/import", { data: t });
  }
  send(t, e = {}) {
    return this.hass.connection.sendMessagePromise({ type: t, ...e });
  }
}
const Xt = F`
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
`, j = F`
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
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
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
var Yt = Object.defineProperty, Et = (s, t, e, i) => {
  for (var r = void 0, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = a(t, e, r) || r);
  return r && Yt(t, e, r), r;
};
class I extends y {
  /** Run an API mutation and bubble the resulting config (or error) up. */
  async run(t) {
    try {
      const e = await t;
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
}
Et([
  E({ attribute: !1 })
], I.prototype, "config");
Et([
  E({ attribute: !1 })
], I.prototype, "api");
const mt = {
  sun: "Sun (automatic)",
  hourly: "By hour",
  sensor: "Sensor input"
}, gt = {
  default: "Default",
  linear: "Linear ramp",
  tanh: "Tanh (smooth)"
};
function te(s, t) {
  return {
    id: s,
    name: t,
    mode: "sun",
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    transition: null,
    adapt_brightness: !0,
    adapt_color: !0,
    separate_turn_on_commands: !1,
    brightness_mode: "default",
    brightness_mode_time_dark: 900,
    brightness_mode_time_light: 3600,
    sunrise_time: null,
    sunset_time: null,
    sunrise_offset: 0,
    sunset_offset: 0,
    min_sunrise_time: null,
    max_sunrise_time: null,
    min_sunset_time: null,
    max_sunset_time: null,
    hourly_keyframes: [],
    sensor_entity_id: null,
    sensor_min: 0,
    sensor_max: 100
  };
}
function ee(s) {
  if (s == null) return "transparent";
  const t = Math.max(1e3, Math.min(12e3, s)) / 100;
  let e, i, r;
  t <= 66 ? (e = 255, i = 99.47 * Math.log(t) - 161.12) : (e = 329.7 * Math.pow(t - 60, -0.1332), i = 288.12 * Math.pow(t - 60, -0.0755)), t >= 66 ? r = 255 : t <= 19 ? r = 0 : r = 138.52 * Math.log(t - 10) - 305.04;
  const n = (a) => Math.max(0, Math.min(255, Math.round(a)));
  return `rgb(${n(e)}, ${n(i)}, ${n(r)})`;
}
var se = Object.getOwnPropertyDescriptor, ie = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? se(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = a(r) || r);
  return r;
};
let G = class extends I {
  render() {
    return this.config.lights.length === 0 ? h`<div class="card">
        <div class="empty">
          No lights are configured. Add light entities in the integration's
          options, then assign schemas here.
        </div>
      </div>` : h`<div class="card">
      <h2>Controlled lights</h2>
      ${this.config.lights.map((s) => this._renderRow(s))}
    </div>`;
  }
  _renderRow(s) {
    const t = Object.values(this.config.schemas), { brightness_pct: e, color_temp_kelvin: i } = s.target;
    return h`<div class="row">
      <div
        class="swatch"
        style="background:${ee(i)}"
        title="Preview color"
      ></div>
      <div class="grow">
        <div>${s.name}</div>
        <div class="muted">
          ${s.state === "on" ? h`${e ?? "–"}% · ${i ?? "–"} K` : h`${s.state}`}
        </div>
      </div>
      ${s.manual_control ? h`<span class="badge manual">Manual</span>
            <button
              class="btn ghost"
              @click=${() => void this.run(
      this.api.setManualControl(s.entity_id, !1)
    )}
            >
              Reset
            </button>` : c}
      <select
        @change=${(r) => void this.run(
      this.api.assignLight(
        s.entity_id,
        r.target.value
      )
    )}
      >
        ${t.map(
      (r) => h`<option
              value=${r.id}
              ?selected=${r.id === s.schema_id}
            >
              ${r.name}
            </option>`
    )}
      </select>
    </div>`;
  }
};
G.styles = j;
G = ie([
  D("ha-adapt-lights-tab")
], G);
function p(s, t, e) {
  return h`<label class="field"
    >${s}
    <input
      type="number"
      .value=${String(t)}
      @change=${(i) => e(Number(i.target.value))}
    />
  </label>`;
}
function $t(s, t, e, i) {
  return h`<label class="field"
    >${s}
    <input
      type="text"
      placeholder=${e}
      .value=${t}
      @input=${(r) => i(r.target.value)}
    />
  </label>`;
}
function vt(s, t, e) {
  return h`<label class="field"
    >${s}
    <input
      type="time"
      step="1"
      .value=${t ?? ""}
      @change=${(i) => e(i.target.value || null)}
    />
  </label>`;
}
function B(s, t, e) {
  return h`<label class="toggle">
    <input
      type="checkbox"
      .checked=${t}
      @change=${(i) => e(i.target.checked)}
    />
    ${s}
  </label>`;
}
function bt(s, t, e, i) {
  return h`<label class="field"
    >${s}
    <select
      @change=${(r) => i(r.target.value)}
    >
      ${e.map(
    (r) => h`<option value=${r.value} ?selected=${r.value === t}>
            ${r.label}
          </option>`
  )}
    </select>
  </label>`;
}
var re = Object.defineProperty, ne = Object.getOwnPropertyDescriptor, it = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? ne(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = (i ? a(t, e, r) : a(r)) || r);
  return i && r && re(t, e, r), r;
};
let H = class extends y {
  constructor() {
    super(...arguments), this._addKeyframe = () => {
      this._draft = {
        ...this._draft,
        hourly_keyframes: [
          ...this._draft.hourly_keyframes,
          { hour: 12, brightness: 80, color_temp: 4e3 }
        ]
      };
    }, this._save = () => {
      this.dispatchEvent(
        new CustomEvent("schema-save", {
          detail: this._draft,
          bubbles: !0,
          composed: !0
        })
      );
    }, this._delete = () => {
      this.dispatchEvent(
        new CustomEvent("schema-delete", {
          detail: this._draft.id,
          bubbles: !0,
          composed: !0
        })
      );
    };
  }
  willUpdate(s) {
    s.has("schema") && this._draft?.id !== this.schema.id && (this._draft = { ...this.schema });
  }
  render() {
    const s = this._draft;
    return h`<div class="card">
      <div class="grid">
        ${$t("Name", s.name, "", (t) => this._patch({ name: t }))}
        ${bt(
      "Mode",
      s.mode,
      Object.keys(mt).map((t) => ({
        value: t,
        label: mt[t]
      })),
      (t) => this._patch({ mode: t })
    )}
      </div>

      <div class="grid" style="margin-top:14px">
        ${p(
      "Min brightness %",
      s.min_brightness,
      (t) => this._patch({ min_brightness: t })
    )}
        ${p(
      "Max brightness %",
      s.max_brightness,
      (t) => this._patch({ max_brightness: t })
    )}
        ${p(
      "Min color temp K",
      s.min_color_temp,
      (t) => this._patch({ min_color_temp: t })
    )}
        ${p(
      "Max color temp K",
      s.max_color_temp,
      (t) => this._patch({ max_color_temp: t })
    )}
      </div>

      <div class="actions">
        ${B(
      "Adapt brightness",
      s.adapt_brightness,
      (t) => this._patch({ adapt_brightness: t })
    )}
        ${B(
      "Adapt color",
      s.adapt_color,
      (t) => this._patch({ adapt_color: t })
    )}
        ${B(
      "Split commands (IKEA)",
      s.separate_turn_on_commands,
      (t) => this._patch({ separate_turn_on_commands: t })
    )}
      </div>

      ${s.mode === "sun" ? this._renderSun(s) : c}
      ${s.mode === "hourly" ? this._renderHourly(s) : c}
      ${s.mode === "sensor" ? this._renderSensor(s) : c}

      <div class="actions">
        <button class="btn" @click=${this._save}>Save schema</button>
        ${s.id !== "default" ? h`<button class="btn danger" @click=${this._delete}>
              Delete
            </button>` : c}
      </div>
    </div>`;
  }
  _renderSun(s) {
    return h`<h2 style="margin-top:18px">Sun settings</h2>
      <div class="grid">
        ${bt(
      "Brightness curve",
      s.brightness_mode,
      Object.keys(gt).map((t) => ({
        value: t,
        label: gt[t]
      })),
      (t) => this._patch({ brightness_mode: t })
    )}
        ${vt(
      "Fixed sunrise",
      s.sunrise_time,
      (t) => this._patch({ sunrise_time: t })
    )}
        ${vt(
      "Fixed sunset",
      s.sunset_time,
      (t) => this._patch({ sunset_time: t })
    )}
        ${p(
      "Sunrise offset (s)",
      s.sunrise_offset,
      (t) => this._patch({ sunrise_offset: t })
    )}
        ${p(
      "Sunset offset (s)",
      s.sunset_offset,
      (t) => this._patch({ sunset_offset: t })
    )}
        ${p(
      "Ramp – dark side (s)",
      s.brightness_mode_time_dark,
      (t) => this._patch({ brightness_mode_time_dark: t })
    )}
        ${p(
      "Ramp – light side (s)",
      s.brightness_mode_time_light,
      (t) => this._patch({ brightness_mode_time_light: t })
    )}
      </div>`;
  }
  _renderHourly(s) {
    return h`<h2 style="margin-top:18px">Hourly keyframes</h2>
      <p class="muted">
        Brightness and color temperature are interpolated between these points
        across the day.
      </p>
      ${s.hourly_keyframes.map(
      (t, e) => h`<div class="keyframe">
          ${p(
        "Hour",
        t.hour,
        (i) => this._patchKeyframe(e, { hour: i })
      )}
          ${p(
        "Brightness %",
        t.brightness,
        (i) => this._patchKeyframe(e, { brightness: i })
      )}
          ${p(
        "Color temp K",
        t.color_temp,
        (i) => this._patchKeyframe(e, { color_temp: i })
      )}
          <button class="btn danger" @click=${() => this._removeKeyframe(e)}>
            ✕
          </button>
        </div>`
    )}
      <button class="btn ghost" @click=${this._addKeyframe}>
        + Add keyframe
      </button>`;
  }
  _renderSensor(s) {
    return h`<h2 style="margin-top:18px">Sensor input</h2>
      <p class="muted">
        Drive brightness and color from a sensor. The sun is the built-in
        default source — this lets a real sensor take over.
      </p>
      <div class="grid">
        ${$t(
      "Sensor entity id",
      s.sensor_entity_id ?? "",
      "sensor.illuminance",
      (t) => this._patch({ sensor_entity_id: t || null })
    )}
        ${p(
      "Sensor min",
      s.sensor_min,
      (t) => this._patch({ sensor_min: t })
    )}
        ${p(
      "Sensor max",
      s.sensor_max,
      (t) => this._patch({ sensor_max: t })
    )}
      </div>`;
  }
  _patch(s) {
    this._draft = { ...this._draft, ...s };
  }
  _patchKeyframe(s, t) {
    const e = this._draft.hourly_keyframes.map(
      (i, r) => r === s ? { ...i, ...t } : i
    );
    this._draft = { ...this._draft, hourly_keyframes: e };
  }
  _removeKeyframe(s) {
    this._draft = {
      ...this._draft,
      hourly_keyframes: this._draft.hourly_keyframes.filter(
        (t, e) => e !== s
      )
    };
  }
};
H.styles = [
  j,
  F`
      .keyframe {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr auto;
        gap: 8px;
        align-items: end;
        margin-bottom: 8px;
      }
    `
];
it([
  E({ attribute: !1 })
], H.prototype, "schema", 2);
it([
  C()
], H.prototype, "_draft", 2);
H = it([
  D("ha-adapt-schema-editor")
], H);
var ae = Object.defineProperty, oe = Object.getOwnPropertyDescriptor, rt = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? oe(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = (i ? a(t, e, r) : a(r)) || r);
  return i && r && ae(t, e, r), r;
};
let N = class extends I {
  constructor() {
    super(...arguments), this._selectedId = "default";
  }
  get _selected() {
    return this._newSchema && this._newSchema.id === this._selectedId ? this._newSchema : this.config.schemas[this._selectedId] ?? this.config.schemas.default;
  }
  render() {
    const s = Object.values(this.config.schemas), t = this._selected;
    return h`
      <div class="card">
        <h2>Schemas</h2>
        <div class="row">
          <select
            class="grow"
            @change=${(e) => this._select(e.target.value)}
          >
            ${s.map(
      (e) => h`<option
                  value=${e.id}
                  ?selected=${e.id === this._selectedId}
                >
                  ${e.name}
                </option>`
    )}
            ${this._newSchema ? h`<option value=${this._newSchema.id} selected>
                  ${this._newSchema.name} (unsaved)
                </option>` : c}
          </select>
          <button class="btn ghost" @click=${this._new}>+ New</button>
        </div>
      </div>
      ${t ? h`<ha-adapt-schema-editor
            .schema=${t}
            @schema-save=${this._onSave}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>` : c}
    `;
  }
  _select(s) {
    this._selectedId = s;
  }
  _new() {
    const s = `schema_${Date.now().toString(36)}`;
    this._newSchema = te(s, "New schema"), this._selectedId = s;
  }
  async _onSave(s) {
    this._newSchema = void 0, this._selectedId = s.detail.id, await this.run(this.api.saveSchema(s.detail));
  }
  async _onDelete(s) {
    this._newSchema = void 0, this._selectedId = "default", await this.run(this.api.deleteSchema(s.detail));
  }
};
N.styles = j;
rt([
  C()
], N.prototype, "_selectedId", 2);
rt([
  C()
], N.prototype, "_newSchema", 2);
N = rt([
  D("ha-adapt-schemas-tab")
], N);
var he = Object.getOwnPropertyDescriptor, le = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? he(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = a(r) || r);
  return r;
};
let J = class extends I {
  render() {
    const s = this.config.settings, t = (e) => void this.run(this.api.updateSettings(e));
    return h`<div class="card">
      <h2>Global settings</h2>
      <div class="grid">
        ${p("Interval (s)", s.interval, (e) => t({ interval: e }))}
        ${p(
      "Transition (s)",
      s.transition,
      (e) => t({ transition: e })
    )}
        ${p(
      "Initial transition (s)",
      s.initial_transition,
      (e) => t({ initial_transition: e })
    )}
        ${p(
      "Auto-reset override (s)",
      s.autoreset_control,
      (e) => t({ autoreset_control: e })
    )}
        ${p(
      "Split delay (ms)",
      s.send_split_delay,
      (e) => t({ send_split_delay: e })
    )}
        ${p(
      "Sleep brightness %",
      s.sleep_brightness,
      (e) => t({ sleep_brightness: e })
    )}
        ${p(
      "Sleep color temp K",
      s.sleep_color_temp,
      (e) => t({ sleep_color_temp: e })
    )}
      </div>
      <div class="actions">
        ${B(
      "Take over control",
      s.take_over_control,
      (e) => t({ take_over_control: e })
    )}
      </div>
    </div>`;
  }
};
J.styles = j;
J = le([
  D("ha-adapt-settings-tab")
], J);
var ce = Object.defineProperty, de = Object.getOwnPropertyDescriptor, P = (s, t, e, i) => {
  for (var r = i > 1 ? void 0 : i ? de(t, e) : t, n = s.length - 1, a; n >= 0; n--)
    (a = s[n]) && (r = (i ? a(t, e, r) : a(r)) || r);
  return i && r && ce(t, e, r), r;
};
const pe = [
  { id: "lights", label: "Lights" },
  { id: "schemas", label: "Schemas" },
  { id: "settings", label: "Settings" }
];
let $ = class extends y {
  constructor() {
    super(...arguments), this.narrow = !1, this._tab = "lights", this._loaded = !1;
  }
  updated() {
    this.hass && (this._api ? this._api.setHass(this.hass) : this._api = new Qt(this.hass), this._loaded || (this._loaded = !0, this._load()));
  }
  async _load() {
    try {
      this._config = await this._api.getConfig(), this._error = void 0;
    } catch (s) {
      this._error = String(s);
    }
  }
  _onConfigChanged(s) {
    this._config = s.detail, this._error = void 0;
  }
  _onError(s) {
    this._error = s.detail;
  }
  render() {
    if (!this._config)
      return h`<div class="wrap">
        <div class="empty">${this._error ?? "Loading…"}</div>
      </div>`;
    const s = this._config;
    return h`<div
      class="wrap"
      @config-changed=${this._onConfigChanged}
      @panel-error=${this._onError}
    >
      <header>
        <h1>Adaptive Lighting</h1>
        <span class="pill ${s.enabled ? "" : "off"}">
          ${s.enabled ? "Active" : "Paused"}
        </span>
        ${s.sleep ? h`<span class="pill">Sleep</span>` : c}
        <span class="spacer"></span>
        <button class="btn ghost" @click=${this._applyNow}>Apply now</button>
      </header>

      ${this._error ? h`<div class="card error">${this._error}</div>` : c}

      <nav class="tabs">
        ${pe.map(
      (t) => h`<button
            class=${this._tab === t.id ? "active" : ""}
            @click=${() => this._tab = t.id}
          >
            ${t.label}
          </button>`
    )}
      </nav>

      ${this._renderTab(s)}
    </div>`;
  }
  _renderTab(s) {
    switch (this._tab) {
      case "schemas":
        return h`<ha-adapt-schemas-tab
          .config=${s}
          .api=${this._api}
        ></ha-adapt-schemas-tab>`;
      case "settings":
        return h`<ha-adapt-settings-tab
          .config=${s}
          .api=${this._api}
        ></ha-adapt-settings-tab>`;
      default:
        return h`<ha-adapt-lights-tab
          .config=${s}
          .api=${this._api}
        ></ha-adapt-lights-tab>`;
    }
  }
  async _applyNow() {
    try {
      this._config = await this._api.apply();
    } catch (s) {
      this._error = String(s);
    }
  }
};
$.styles = [
  Xt,
  j,
  F`
      .wrap {
        max-width: 920px;
        margin: 0 auto;
        padding: 24px 20px 64px;
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
      nav.tabs {
        display: flex;
        gap: 6px;
        margin-bottom: 22px;
        border-bottom: 2px solid var(--border);
      }
      nav.tabs button {
        border: none;
        background: none;
        padding: 10px 16px;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--text-soft);
        cursor: pointer;
        border-bottom: 3px solid transparent;
        margin-bottom: -2px;
      }
      nav.tabs button.active {
        color: var(--accent-strong);
        border-bottom-color: var(--accent);
      }
      .error {
        border-color: var(--danger);
        color: var(--danger);
      }
    `
];
P([
  E({ attribute: !1 })
], $.prototype, "hass", 2);
P([
  E({ attribute: !1 })
], $.prototype, "narrow", 2);
P([
  C()
], $.prototype, "_config", 2);
P([
  C()
], $.prototype, "_tab", 2);
P([
  C()
], $.prototype, "_error", 2);
$ = P([
  D("ha-adapt-panel")
], $);
export {
  $ as HaAdaptPanel
};
