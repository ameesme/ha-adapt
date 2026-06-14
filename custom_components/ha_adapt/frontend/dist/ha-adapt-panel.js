/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, st = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, it = Symbol(), lt = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== it) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (st && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = lt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && lt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ot = (e) => new bt(typeof e == "string" ? e : e + "", void 0, it), I = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new bt(s, e, it);
}, Mt = (e, t) => {
  if (st) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = W.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, ht = st ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Ot(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Ht, getOwnPropertyDescriptor: Ut, getOwnPropertyNames: Rt, getOwnPropertySymbols: Lt, getPrototypeOf: Nt } = Object, G = globalThis, ct = G.trustedTypes, kt = ct ? ct.emptyScript : "", Dt = G.reactiveElementPolyfillSupport, L = (e, t) => e, q = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? kt : null;
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
} }, rt = (e, t) => !Tt(e, t), dt = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ??= Symbol("metadata"), G.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let M = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = dt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Ht(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = Ut(this.prototype, t) ?? { get() {
      return this[s];
    }, set(a) {
      this[s] = a;
    } };
    return { get: r, set(a) {
      const h = r?.call(this);
      n?.call(this, a), this.requestUpdate(t, h, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const t = Nt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const s = this.properties, i = [...Rt(s), ...Lt(s)];
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
      for (const r of i) s.unshift(ht(r));
    } else t !== void 0 && s.push(ht(t));
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
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : q).toAttribute(s, i.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = i.getPropertyOptions(r), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : q;
      this._$Em = r;
      const h = a.fromAttribute(s, n.type);
      this[r] = h ?? this._$Ej?.get(r) ?? h, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, n) {
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), i ??= a.getPropertyOptions(t), !((i.hasChanged ?? rt)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: n }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? s ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: a } = n, h = this[r];
        a !== !0 || this._$AL.has(r) || h === void 0 || this.C(r, void 0, n, h);
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
M.elementStyles = [], M.shadowRootOptions = { mode: "open" }, M[L("elementProperties")] = /* @__PURE__ */ new Map(), M[L("finalized")] = /* @__PURE__ */ new Map(), Dt?.({ ReactiveElement: M }), (G.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt = globalThis, pt = (e) => e, V = nt.trustedTypes, ut = V ? V.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, yt = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, wt = "?" + w, It = `<${wt}>`, E = document, N = () => E.createComment(""), k = (e) => e === null || typeof e != "object" && typeof e != "function", at = Array.isArray, jt = (e) => at(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, R = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _t = /-->/g, gt = />/g, A = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, mt = /"/g, xt = /^(?:script|style|textarea|title)$/i, zt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), l = zt(1), T = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), S = E.createTreeWalker(E, 129);
function At(e, t) {
  if (!at(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const Bt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = R;
  for (let h = 0; h < s; h++) {
    const o = e[h];
    let u, _, d = -1, $ = 0;
    for (; $ < o.length && (a.lastIndex = $, _ = a.exec(o), _ !== null); ) $ = a.lastIndex, a === R ? _[1] === "!--" ? a = _t : _[1] !== void 0 ? a = gt : _[2] !== void 0 ? (xt.test(_[2]) && (r = RegExp("</" + _[2], "g")), a = A) : _[3] !== void 0 && (a = A) : a === A ? _[0] === ">" ? (a = r ?? R, d = -1) : _[1] === void 0 ? d = -2 : (d = a.lastIndex - _[2].length, u = _[1], a = _[3] === void 0 ? A : _[3] === '"' ? mt : ft) : a === mt || a === ft ? a = A : a === _t || a === gt ? a = R : (a = A, r = void 0);
    const y = a === A && e[h + 1].startsWith("/>") ? " " : "";
    n += a === R ? o + It : d >= 0 ? (i.push(u), o.slice(0, d) + yt + o.slice(d) + w + y) : o + w + (d === -2 ? h : y);
  }
  return [At(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class D {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const h = t.length - 1, o = this.parts, [u, _] = Bt(t, s);
    if (this.el = D.createElement(u, i), S.currentNode = this.el.content, s === 2 || s === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = S.nextNode()) !== null && o.length < h; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(yt)) {
          const $ = _[a++], y = r.getAttribute(d).split(w), K = /([.?@])?(.*)/.exec($);
          o.push({ type: 1, index: n, name: K[2], strings: y, ctor: K[1] === "." ? Wt : K[1] === "?" ? qt : K[1] === "@" ? Vt : J }), r.removeAttribute(d);
        } else d.startsWith(w) && (o.push({ type: 6, index: n }), r.removeAttribute(d));
        if (xt.test(r.tagName)) {
          const d = r.textContent.split(w), $ = d.length - 1;
          if ($ > 0) {
            r.textContent = V ? V.emptyScript : "";
            for (let y = 0; y < $; y++) r.append(d[y], N()), S.nextNode(), o.push({ type: 2, index: ++n });
            r.append(d[$], N());
          }
        }
      } else if (r.nodeType === 8) if (r.data === wt) o.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(w, d + 1)) !== -1; ) o.push({ type: 7, index: n }), d += w.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = E.createElement("template");
    return i.innerHTML = t, i;
  }
}
function H(e, t, s = e, i) {
  if (t === T) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = k(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = H(e, r._$AS(e, t.values), r, i)), t;
}
class Kt {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? E).importNode(s, !0);
    S.currentNode = r;
    let n = S.nextNode(), a = 0, h = 0, o = i[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let u;
        o.type === 2 ? u = new j(n, n.nextSibling, this, t) : o.type === 1 ? u = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (u = new Ft(n, this, t)), this._$AV.push(u), o = i[++h];
      }
      a !== o?.index && (n = S.nextNode(), a++);
    }
    return S.currentNode = E, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class j {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = H(this, t, s), k(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== T && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && k(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = D.createElement(At(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const n = new Kt(r, this), a = n.u(this.options);
      n.p(s), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = vt.get(t.strings);
    return s === void 0 && vt.set(t.strings, s = new D(t)), s;
  }
  k(t) {
    at(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new j(this.O(N()), this.O(N()), this, this.options)) : i = s[r], i._$AI(n), r++;
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
class J {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = H(this, t, s, 0), a = !k(t) || t !== this._$AH && t !== T, a && (this._$AH = t);
    else {
      const h = t;
      let o, u;
      for (t = n[0], o = 0; o < n.length - 1; o++) u = H(this, h[i + o], s, o), u === T && (u = this._$AH[o]), a ||= !k(u) || u !== this._$AH[o], u === c ? t = c : t !== c && (t += (u ?? "") + n[o + 1]), this._$AH[o] = u;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends J {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class qt extends J {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Vt extends J {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = H(this, t, s, 0) ?? c) === T) return;
    const i = this._$AH, r = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ft {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    H(this, t);
  }
}
const Zt = nt.litHtmlPolyfillSupport;
Zt?.(D, j), (nt.litHtmlVersions ??= []).push("3.3.3");
const Gt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = r = new j(t.insertBefore(N(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis;
class b extends M {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Gt(s, this.renderRoot, this.renderOptions);
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
b._$litElement$ = !0, b.finalized = !0, ot.litElementHydrateSupport?.({ LitElement: b });
const Jt = ot.litElementPolyfillSupport;
Jt?.({ LitElement: b });
(ot.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const P = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: q, reflect: !1, hasChanged: rt }, Xt = (e = Qt, t, s) => {
  const { kind: i, metadata: r } = s;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), i === "accessor") {
    const { name: a } = s;
    return { set(h) {
      const o = t.get.call(this);
      t.set.call(this, h), this.requestUpdate(a, o, e, !0, h);
    }, init(h) {
      return h !== void 0 && this.C(a, void 0, e, h), h;
    } };
  }
  if (i === "setter") {
    const { name: a } = s;
    return function(h) {
      const o = this[a];
      t.call(this, h), this.requestUpdate(a, o, e, !0, h);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function g(e) {
  return (t, s) => typeof s == "object" ? Xt(e, t, s) : ((i, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, i), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function v(e) {
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
const te = I`
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
`, O = I`
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
var ee = Object.defineProperty, St = (e, t, s, i) => {
  for (var r = void 0, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(t, s, r) || r);
  return r && ee(t, s, r), r;
};
class z extends b {
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
St([
  g({ attribute: !1 })
], z.prototype, "config");
St([
  g({ attribute: !1 })
], z.prototype, "api");
const X = Array.from({ length: 24 }, (e, t) => t);
function se() {
  return {
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    ramp_dark: 900,
    ramp_light: 3600,
    sunrise_time: null,
    sunset_time: null,
    sunrise_offset: 0,
    sunset_offset: 0,
    min_sunrise_time: null,
    max_sunrise_time: null,
    min_sunset_time: null,
    max_sunset_time: null
  };
}
function ie() {
  return {
    min_brightness: 1,
    max_brightness: 100,
    min_color_temp: 2e3,
    max_color_temp: 5500,
    separate_turn_on_commands: !1,
    hours: Array.from({ length: 24 }, () => null)
  };
}
function re(e, t) {
  return { id: e, name: t, sun: se(), lights: {} };
}
function Et(e) {
  const t = Math.max(1e3, Math.min(12e3, e)) / 100;
  let s, i, r;
  t <= 66 ? (s = 255, i = 99.47 * Math.log(t) - 161.12) : (s = 329.7 * Math.pow(t - 60, -0.1332), i = 288.12 * Math.pow(t - 60, -0.0755)), t >= 66 ? r = 255 : t <= 19 ? r = 0 : r = 138.52 * Math.log(t - 10) - 305.04;
  const n = (a) => Math.max(0, Math.min(255, Math.round(a)));
  return `rgb(${n(s)}, ${n(i)}, ${n(r)})`;
}
function ne(e) {
  return String(e).padStart(2, "0");
}
var ae = Object.getOwnPropertyDescriptor, oe = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ae(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
};
let Y = class extends z {
  render() {
    return this.config.lights.length === 0 ? l`<div class="card">
        <div class="empty">
          No lights are configured. Add light entities in the integration's
          options, then design schemas on the Schemas tab.
        </div>
      </div>` : l`<div class="card">
      <h2>Controlled lights</h2>
      <p class="muted">
        Live status of every light. Behaviour is configured per schema on the
        Schemas tab.
      </p>
      ${this.config.lights.map((e) => this._renderRow(e))}
    </div>`;
  }
  _renderRow(e) {
    const { brightness_pct: t, color_temp_kelvin: s } = e.target;
    return l`<div class="row">
      <div
        class="swatch"
        style="background:${s ? Et(s) : "transparent"}"
      ></div>
      <div class="grow">
        <div>${e.name}</div>
        <div class="muted">
          ${e.state === "on" ? l`${t ?? "–"}% · ${s ?? "–"} K` : l`${e.state}`}
        </div>
      </div>
      ${e.manual_control ? l`<span class="badge manual">Manual</span>
            <button
              class="btn ghost"
              @click=${() => void this.run(
      this.api.setManualControl(e.entity_id, !1)
    )}
            >
              Reset
            </button>` : c}
    </div>`;
  }
};
Y.styles = O;
Y = oe([
  P("ha-adapt-lights-tab")
], Y);
function p(e, t, s) {
  return l`<label class="field"
    >${e}
    <input
      type="number"
      .value=${String(t)}
      @change=${(i) => s(Number(i.target.value))}
    />
  </label>`;
}
function $t(e, t, s) {
  return l`<label class="field"
    >${e}
    <input
      type="time"
      step="1"
      .value=${t ?? ""}
      @change=${(i) => s(i.target.value || null)}
    />
  </label>`;
}
function tt(e, t, s) {
  return l`<label class="toggle">
    <input
      type="checkbox"
      .checked=${t}
      @change=${(i) => s(i.target.checked)}
    />
    ${e}
  </label>`;
}
var le = Object.defineProperty, he = Object.getOwnPropertyDescriptor, B = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? he(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && le(t, s, r), r;
};
let C = class extends b {
  constructor() {
    super(...arguments), this.lights = [], this.selected = null, this.previewHour = 12;
  }
  render() {
    if (!this.timeline)
      return l`<div class="card"><div class="empty">Loading timeline…</div></div>`;
    const e = Math.floor(this.previewHour) % 24;
    return l`<div class="card">
      <div class="scroll">
        <div class="grid">
          ${this._headerRow(e)}
          ${this._sunRow(e)}
          ${this.lights.map((t) => this._lightRow(t, e))}
        </div>
      </div>
    </div>`;
  }
  _headerRow(e) {
    return l`<div class="gridrow">
      <div class="label"></div>
      ${X.map(
      (t) => l`<div class="hourhead ${t === e ? "now" : ""}">
          ${ne(t)}
        </div>`
    )}
    </div>`;
  }
  _sunRow(e) {
    const t = this.timeline.sun;
    return l`<div class="gridrow">
      <div class="label">☀️ Sun</div>
      ${X.map(
      (s) => this._cell(t[s], s === e, "readonly", !1, !1)
    )}
    </div>`;
  }
  _lightRow(e, t) {
    const s = this.timeline.lights[e.entity_id] ?? [];
    return l`<div class="gridrow">
      <div
        class="label clickable"
        title="Edit light range"
        @click=${() => this._emit("select-light", e.entity_id)}
      >
        ${e.name}
      </div>
      ${X.map((i) => {
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
    const a = e ? e.brightness : 0, h = e ? Et(e.color_temp) : "transparent", o = [
      "cell",
      s,
      i ? "explicit" : "",
      r ? "selected" : "",
      t ? "now" : ""
    ].join(" ");
    return l`<div
      class=${o}
      @click=${n}
      title=${e ? `${e.brightness}% · ${e.color_temp} K` : ""}
    >
      <div
        class="fill"
        style="height:${a}%;background:${h}"
      ></div>
    </div>`;
  }
  _emit(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
    );
  }
};
C.styles = [
  O,
  I`
      .scroll {
        overflow-x: auto;
        padding-bottom: 6px;
      }
      .grid {
        display: grid;
        grid-auto-rows: minmax(0, auto);
        gap: 2px;
      }
      .gridrow {
        display: grid;
        grid-template-columns: 130px repeat(24, 30px);
        gap: 2px;
        align-items: center;
      }
      .label {
        font-size: 0.82rem;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 6px;
      }
      .label.clickable {
        cursor: pointer;
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
B([
  g({ attribute: !1 })
], C.prototype, "lights", 2);
B([
  g({ attribute: !1 })
], C.prototype, "timeline", 2);
B([
  g({ attribute: !1 })
], C.prototype, "selected", 2);
B([
  g({ type: Number })
], C.prototype, "previewHour", 2);
C = B([
  P("ha-adapt-timeline-grid")
], C);
var ce = Object.defineProperty, de = Object.getOwnPropertyDescriptor, Ct = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? de(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && ce(t, s, r), r;
};
let F = class extends b {
  render() {
    const e = this.sun;
    return l`<div class="card">
      <h2>☀️ Sun</h2>
      <p class="muted">
        The sun drives every light's fallback. Empty timeline cells follow it.
      </p>
      <div class="grid">
        ${p(
      "Min brightness %",
      e.min_brightness,
      (t) => this._patch({ min_brightness: t })
    )}
        ${p(
      "Max brightness %",
      e.max_brightness,
      (t) => this._patch({ max_brightness: t })
    )}
        ${p(
      "Min color temp K",
      e.min_color_temp,
      (t) => this._patch({ min_color_temp: t })
    )}
        ${p(
      "Max color temp K",
      e.max_color_temp,
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
        ${p(
      "Sunrise offset (s)",
      e.sunrise_offset,
      (t) => this._patch({ sunrise_offset: t })
    )}
        ${p(
      "Sunset offset (s)",
      e.sunset_offset,
      (t) => this._patch({ sunset_offset: t })
    )}
        ${p(
      "Ramp – dark side (s)",
      e.ramp_dark,
      (t) => this._patch({ ramp_dark: t })
    )}
        ${p(
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
F.styles = O;
Ct([
  g({ attribute: !1 })
], F.prototype, "sun", 2);
F = Ct([
  P("ha-adapt-sun-config")
], F);
var pe = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, m = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ue(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && pe(t, s, r), r;
};
let f = class extends b {
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
    e.has("schema") && this._draft?.id !== this.schema.id && (this._draft = structuredClone(this.schema), this._selectedCell = null, this._selectedLight = null, this._loadTimeline());
  }
  async _loadTimeline() {
    try {
      this._timeline = await this.api.timeline(this._draft.id);
    } catch {
      this._timeline = void 0;
    }
  }
  // --- persistence ---------------------------------------------------------
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
    return this._draft.lights[e] ?? ie();
  }
  _patchLight(e, t) {
    const s = { ...this._lightCfg(e), ...t };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [e]: s }
    }, this._saveAndRefresh();
  }
  // --- render --------------------------------------------------------------
  render() {
    return l`
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
          ${this.active ? l`<span class="badge">Active</span>` : l`<button
                class="btn ghost"
                @click=${() => void this._setActive()}
              >
                Set active
              </button>`}
          <span class="grow"></span>
          ${this._draft.id !== "default" ? l`<button class="btn danger" @click=${this._delete}>
                Delete
              </button>` : c}
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
        @select-cell=${(e) => {
      this._selectedCell = e.detail, this._selectedLight = null;
    }}
        @select-light=${(e) => {
      this._selectedLight = e.detail, this._selectedCell = null;
    }}
      ></ha-adapt-timeline-grid>

      ${this._renderScrubber()}
      ${this._selectedCell ? this._renderCellEditor() : c}
      ${this._selectedLight ? this._renderLightEditor() : c}
    `;
  }
  _renderScrubber() {
    const e = Math.floor(this._previewHour), t = Math.round((this._previewHour - e) * 60), s = `${String(e).padStart(2, "0")}:${String(t).padStart(2, "0")}`;
    return l`<div class="card">
      <div class="scrubber">
        <span class="clock">${s}</span>
        <input
          type="range"
          min="0"
          max="23.5"
          step="0.5"
          .value=${String(this._previewHour)}
          @input=${(i) => this._onScrub(Number(i.target.value))}
        />
        ${tt("Live preview to lights", this._livePreview, (i) => {
      this._livePreview = i, i && this._sendPreview();
    })}
      </div>
      <p class="muted">
        Drag to step through the day. With live preview on, the lights that are
        currently on follow the slider.
      </p>
    </div>`;
  }
  _renderCellEditor() {
    const e = this._selectedCell, t = this.lights.find((a) => a.entity_id === e.entityId), s = this._lightCfg(e.entityId).hours[e.hour], i = this._timeline?.lights[e.entityId]?.[e.hour], r = s?.brightness ?? i?.brightness ?? 50, n = s?.color_temp ?? i?.color_temp ?? 3e3;
    return l`<div class="card">
      <h2>
        ${t?.name ?? e.entityId} · ${String(e.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${s ? "Explicit override for this hour." : "Currently following the sun — set a value to override."}
      </p>
      <div class="grid">
        ${p(
      "Brightness %",
      r,
      (a) => this._setCell(e, { brightness: a, color_temp: n })
    )}
        ${p(
      "Color temp K",
      n,
      (a) => this._setCell(e, { brightness: r, color_temp: a })
    )}
      </div>
      <div class="actions">
        ${s ? l`<button
              class="btn ghost"
              @click=${() => this._setCell(e, null)}
            >
              Use sun (clear)
            </button>` : c}
        <button class="btn ghost" @click=${() => this._selectedCell = null}>
          Close
        </button>
      </div>
    </div>`;
  }
  _renderLightEditor() {
    const e = this._selectedLight, t = this.lights.find((i) => i.entity_id === e), s = this._lightCfg(e);
    return l`<div class="card">
      <h2>${t?.name ?? e} · range</h2>
      <div class="grid">
        ${p(
      "Min brightness %",
      s.min_brightness,
      (i) => this._patchLight(e, { min_brightness: i })
    )}
        ${p(
      "Max brightness %",
      s.max_brightness,
      (i) => this._patchLight(e, { max_brightness: i })
    )}
        ${p(
      "Min color temp K",
      s.min_color_temp,
      (i) => this._patchLight(e, { min_color_temp: i })
    )}
        ${p(
      "Max color temp K",
      s.max_color_temp,
      (i) => this._patchLight(e, { max_color_temp: i })
    )}
      </div>
      <div class="actions">
        ${tt(
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
    this._draft = { ...this._draft, ...e }, this._saveAndRefresh();
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
f.styles = [
  O,
  I`
      .toolbar {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      .scrubber {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .scrubber input[type="range"] {
        flex: 1;
        accent-color: var(--accent);
      }
      .clock {
        font-variant-numeric: tabular-nums;
        font-weight: 700;
        color: var(--accent-strong);
        min-width: 52px;
      }
    `
];
m([
  g({ attribute: !1 })
], f.prototype, "schema", 2);
m([
  g({ attribute: !1 })
], f.prototype, "lights", 2);
m([
  g({ attribute: !1 })
], f.prototype, "api", 2);
m([
  g({ type: Boolean })
], f.prototype, "active", 2);
m([
  v()
], f.prototype, "_draft", 2);
m([
  v()
], f.prototype, "_timeline", 2);
m([
  v()
], f.prototype, "_selectedCell", 2);
m([
  v()
], f.prototype, "_selectedLight", 2);
m([
  v()
], f.prototype, "_previewHour", 2);
m([
  v()
], f.prototype, "_livePreview", 2);
f = m([
  P("ha-adapt-schema-editor")
], f);
var _e = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, Pt = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ge(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && _e(t, s, r), r;
};
let Z = class extends z {
  get _currentId() {
    return this._selectedId && this.config.schemas[this._selectedId] ? this._selectedId : this.config.active_schema_id;
  }
  render() {
    const e = Object.values(this.config.schemas), t = this._currentId, s = this.config.schemas[t];
    return l`
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
      (i) => l`<option
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
      ${s ? l`<ha-adapt-schema-editor
            .schema=${s}
            .lights=${this.config.lights}
            .api=${this.api}
            .active=${t === this.config.active_schema_id}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>` : c}
    `;
  }
  async _new() {
    const e = `schema_${Date.now().toString(36)}`;
    this._selectedId = e, await this.run(this.api.saveSchema(re(e, "New schema")));
  }
  async _onDelete(e) {
    this._selectedId = this.config.active_schema_id, await this.run(this.api.deleteSchema(e.detail));
  }
};
Z.styles = O;
Pt([
  v()
], Z.prototype, "_selectedId", 2);
Z = Pt([
  P("ha-adapt-schemas-tab")
], Z);
var fe = Object.getOwnPropertyDescriptor, me = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? fe(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = a(r) || r);
  return r;
};
let et = class extends z {
  render() {
    const e = this.config.settings, t = (s) => void this.run(this.api.updateSettings(s));
    return l`<div class="card">
      <h2>Global settings</h2>
      <div class="grid">
        ${p("Interval (s)", e.interval, (s) => t({ interval: s }))}
        ${p(
      "Transition (s)",
      e.transition,
      (s) => t({ transition: s })
    )}
        ${p(
      "Initial transition (s)",
      e.initial_transition,
      (s) => t({ initial_transition: s })
    )}
        ${p(
      "Auto-reset override (s)",
      e.autoreset_control,
      (s) => t({ autoreset_control: s })
    )}
        ${p(
      "Split delay (ms)",
      e.send_split_delay,
      (s) => t({ send_split_delay: s })
    )}
      </div>
      <div class="actions">
        ${tt(
      "Take over control",
      e.take_over_control,
      (s) => t({ take_over_control: s })
    )}
      </div>
    </div>`;
  }
};
et.styles = O;
et = me([
  P("ha-adapt-settings-tab")
], et);
var ve = Object.defineProperty, $e = Object.getOwnPropertyDescriptor, U = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? $e(t, s) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && ve(t, s, r), r;
};
const be = [
  { id: "lights", label: "Lights" },
  { id: "schemas", label: "Schemas" },
  { id: "settings", label: "Settings" }
];
let x = class extends b {
  constructor() {
    super(...arguments), this.narrow = !1, this._tab = "lights", this._loaded = !1;
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
  _onConfigChanged(e) {
    this._config = e.detail, this._error = void 0;
  }
  _onError(e) {
    this._error = e.detail;
  }
  render() {
    if (!this._config)
      return l`<div class="wrap">
        <div class="empty">${this._error ?? "Loading…"}</div>
      </div>`;
    const e = this._config;
    return l`<div
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

      ${this._error ? l`<div class="card error">${this._error}</div>` : c}

      <nav class="tabs">
        ${be.map(
      (t) => l`<button
            class=${this._tab === t.id ? "active" : ""}
            @click=${() => this._tab = t.id}
          >
            ${t.label}
          </button>`
    )}
      </nav>

      ${this._renderTab(e)}
    </div>`;
  }
  _renderTab(e) {
    switch (this._tab) {
      case "schemas":
        return l`<ha-adapt-schemas-tab
          .config=${e}
          .api=${this._api}
        ></ha-adapt-schemas-tab>`;
      case "settings":
        return l`<ha-adapt-settings-tab
          .config=${e}
          .api=${this._api}
        ></ha-adapt-settings-tab>`;
      default:
        return l`<ha-adapt-lights-tab
          .config=${e}
          .api=${this._api}
        ></ha-adapt-lights-tab>`;
    }
  }
  async _applyNow() {
    try {
      this._config = await this._api.apply();
    } catch (e) {
      this._error = String(e);
    }
  }
};
x.styles = [
  te,
  O,
  I`
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
U([
  g({ attribute: !1 })
], x.prototype, "hass", 2);
U([
  g({ attribute: !1 })
], x.prototype, "narrow", 2);
U([
  v()
], x.prototype, "_config", 2);
U([
  v()
], x.prototype, "_tab", 2);
U([
  v()
], x.prototype, "_error", 2);
x = U([
  P("ha-adapt-panel")
], x);
export {
  x as HaAdaptPanel
};
