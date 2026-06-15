/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, et = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, st = Symbol(), lt = /* @__PURE__ */ new WeakMap();
let bt = class {
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
const Pt = (e) => new bt(typeof e == "string" ? e : e + "", void 0, st), z = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, n) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[n + 1], e[0]);
  return new bt(s, e, st);
}, Ot = (e, t) => {
  if (et) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = F.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, ht = et ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Pt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: kt, defineProperty: Mt, getOwnPropertyDescriptor: Tt, getOwnPropertyNames: Ht, getOwnPropertySymbols: Ut, getPrototypeOf: Rt } = Object, J = globalThis, ct = J.trustedTypes, Nt = ct ? ct.emptyScript : "", Lt = J.reactiveElementPolyfillSupport, R = (e, t) => e, W = { toAttribute(e, t) {
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
} }, it = (e, t) => !kt(e, t), dt = { attribute: !0, type: String, converter: W, reflect: !1, useDefault: !1, hasChanged: it };
Symbol.metadata ??= Symbol("metadata"), J.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = dt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Mt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: n } = Tt(this.prototype, t) ?? { get() {
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
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = Rt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const s = this.properties, i = [...Ht(s), ...Ut(s)];
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
    return Ot(t, this.constructor.elementStyles), t;
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[R("elementProperties")] = /* @__PURE__ */ new Map(), O[R("finalized")] = /* @__PURE__ */ new Map(), Lt?.({ ReactiveElement: O }), (J.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis, pt = (e) => e, Z = rt.trustedTypes, ut = Z ? Z.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, yt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, wt = "?" + y, It = `<${wt}>`, P = document, I = () => P.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", nt = Array.isArray, Dt = (e) => nt(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _t = /-->/g, gt = />/g, E = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ft = /'/g, mt = /"/g, xt = /^(?:script|style|textarea|title)$/i, jt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), h = jt(1), k = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), C = P.createTreeWalker(P, 129);
function At(e, t) {
  if (!nt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ut !== void 0 ? ut.createHTML(t) : t;
}
const zt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = U;
  for (let l = 0; l < s; l++) {
    const a = e[l];
    let p, u, c = -1, m = 0;
    for (; m < a.length && (o.lastIndex = m, u = o.exec(a), u !== null); ) m = o.lastIndex, o === U ? u[1] === "!--" ? o = _t : u[1] !== void 0 ? o = gt : u[2] !== void 0 ? (xt.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = E) : u[3] !== void 0 && (o = E) : o === E ? u[0] === ">" ? (o = r ?? U, c = -1) : u[1] === void 0 ? c = -2 : (c = o.lastIndex - u[2].length, p = u[1], o = u[3] === void 0 ? E : u[3] === '"' ? mt : ft) : o === mt || o === ft ? o = E : o === _t || o === gt ? o = U : (o = E, r = void 0);
    const b = o === E && e[l + 1].startsWith("/>") ? " " : "";
    n += o === U ? a + It : c >= 0 ? (i.push(p), a.slice(0, c) + yt + a.slice(c) + y + b) : a + y + (c === -2 ? l : b);
  }
  return [At(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class j {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const l = t.length - 1, a = this.parts, [p, u] = zt(t, s);
    if (this.el = j.createElement(p, i), C.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = C.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(yt)) {
          const m = u[o++], b = r.getAttribute(c).split(y), q = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: n, name: q[2], strings: b, ctor: q[1] === "." ? Kt : q[1] === "?" ? Vt : q[1] === "@" ? qt : X }), r.removeAttribute(c);
        } else c.startsWith(y) && (a.push({ type: 6, index: n }), r.removeAttribute(c));
        if (xt.test(r.tagName)) {
          const c = r.textContent.split(y), m = c.length - 1;
          if (m > 0) {
            r.textContent = Z ? Z.emptyScript : "";
            for (let b = 0; b < m; b++) r.append(c[b], I()), C.nextNode(), a.push({ type: 2, index: ++n });
            r.append(c[m], I());
          }
        }
      } else if (r.nodeType === 8) if (r.data === wt) a.push({ type: 2, index: n });
      else {
        let c = -1;
        for (; (c = r.data.indexOf(y, c + 1)) !== -1; ) a.push({ type: 7, index: n }), c += y.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = P.createElement("template");
    return i.innerHTML = t, i;
  }
}
function M(e, t, s = e, i) {
  if (t === k) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = D(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = M(e, r._$AS(e, t.values), r, i)), t;
}
class Bt {
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
        a.type === 2 ? p = new B(n, n.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (p = new Ft(n, this, t)), this._$AV.push(p), a = i[++l];
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
    t = M(this, t, s), D(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Dt(t) ? this.k(t) : this._(t);
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
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = j.createElement(At(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const n = new Bt(r, this), o = n.u(this.options);
      n.p(s), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = vt.get(t.strings);
    return s === void 0 && vt.set(t.strings, s = new j(t)), s;
  }
  k(t) {
    nt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const n of t) r === s.length ? s.push(i = new B(this.O(I()), this.O(I()), this, this.options)) : i = s[r], i._$AI(n), r++;
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
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, s = this, i, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = M(this, t, s, 0), o = !D(t) || t !== this._$AH && t !== k, o && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = n[0], a = 0; a < n.length - 1; a++) p = M(this, l[i + a], s, a), p === k && (p = this._$AH[a]), o ||= !D(p) || p !== this._$AH[a], p === d ? t = d : t !== d && (t += (p ?? "") + n[a + 1]), this._$AH[a] = p;
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
class Vt extends X {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class qt extends X {
  constructor(t, s, i, r, n) {
    super(t, s, i, r, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = M(this, t, s, 0) ?? d) === k) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== d && (i === d || r);
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
    M(this, t);
  }
}
const Wt = rt.litHtmlPolyfillSupport;
Wt?.(j, B), (rt.litHtmlVersions ??= []).push("3.3.3");
const Zt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = r = new B(t.insertBefore(I(), n), n, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ot = globalThis;
class v extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Zt(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return k;
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
const K = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Jt = { attribute: !0, type: String, converter: W, reflect: !1, hasChanged: it }, Xt = (e = Jt, t, s) => {
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
  return (t, s) => typeof s == "object" ? Xt(e, t, s) : ((i, r, n) => {
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
const Yt = z`
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
`, V = z`
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
`, Y = Array.from({ length: 24 }, (e, t) => t), N = 1500, L = 6500;
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
function se(e, t) {
  return { id: e, name: t, sun: te(), lights: {} };
}
function ie(e) {
  const t = Math.max(1e3, Math.min(12e3, e)) / 100;
  let s, i, r;
  t <= 66 ? (s = 255, i = 99.47 * Math.log(t) - 161.12) : (s = 329.7 * Math.pow(t - 60, -0.1332), i = 288.12 * Math.pow(t - 60, -0.0755)), t >= 66 ? r = 255 : t <= 19 ? r = 0 : r = 138.52 * Math.log(t - 10) - 305.04;
  const n = (o) => Math.max(0, Math.min(255, Math.round(o)));
  return `rgb(${n(s)}, ${n(i)}, ${n(r)})`;
}
function re(e) {
  return String(e).padStart(2, "0");
}
function w(e, t, s) {
  return h`<label class="field"
    >${e}
    <input
      type="number"
      .value=${String(t)}
      @change=${(i) => s(Number(i.target.value))}
    />
  </label>`;
}
function f(e, t, s, i, r, n, o) {
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
function $t(e, t, s) {
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
function St(e, t, s) {
  return h`<label class="toggle">
    <input
      type="checkbox"
      .checked=${t}
      @change=${(i) => s(i.target.checked)}
    />
    ${e}
  </label>`;
}
var ne = Object.defineProperty, oe = Object.getOwnPropertyDescriptor, T = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? oe(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && ne(t, s, r), r;
};
let x = class extends v {
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
      ${Y.map(
      (t) => h`<div class="hourhead ${t === e ? "now" : ""}">
          ${re(t)}
        </div>`
    )}
    </div>`;
  }
  _sunRow(e) {
    const t = this.timeline.sun;
    return h`<div class="gridrow sunrow">
      <div
        class="label clickable"
        title="Edit the sun"
        @click=${() => this._emit("select-sun", null)}
      >
        ☀️ Sun
      </div>
      ${Y.map(
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
      ${Y.map((i) => {
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
    const o = e ? e.brightness : 0, l = e ? ie(e.color_temp) : "transparent", a = [
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
x.styles = [
  V,
  z`
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
T([
  _({ attribute: !1 })
], x.prototype, "lights", 2);
T([
  _({ attribute: !1 })
], x.prototype, "timeline", 2);
T([
  _({ attribute: !1 })
], x.prototype, "selected", 2);
T([
  _({ type: Number })
], x.prototype, "previewHour", 2);
T([
  _({ type: Boolean })
], x.prototype, "live", 2);
x = T([
  K("ha-adapt-timeline-grid")
], x);
var ae = Object.defineProperty, le = Object.getOwnPropertyDescriptor, Et = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? le(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && ae(t, s, r), r;
};
let G = class extends v {
  render() {
    const e = this.sun;
    return h`<div class="card">
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
      N,
      L,
      50,
      "K",
      (t) => this._patch({ min_color_temp: t })
    )}
        ${f(
      "Max color temp",
      e.max_color_temp,
      N,
      L,
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
        ${w(
      "Sunrise offset (s)",
      e.sunrise_offset,
      (t) => this._patch({ sunrise_offset: t })
    )}
        ${w(
      "Sunset offset (s)",
      e.sunset_offset,
      (t) => this._patch({ sunset_offset: t })
    )}
        ${w(
      "Ramp – dark side (s)",
      e.ramp_dark,
      (t) => this._patch({ ramp_dark: t })
    )}
        ${w(
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
G.styles = V;
Et([
  _({ attribute: !1 })
], G.prototype, "sun", 2);
G = Et([
  K("ha-adapt-sun-config")
], G);
var he = Object.defineProperty, Ct = (e, t, s, i) => {
  for (var r = void 0, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(t, s, r) || r);
  return r && he(t, s, r), r;
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
Ct([
  _({ attribute: !1 })
], at.prototype, "config");
Ct([
  _({ attribute: !1 })
], at.prototype, "api");
var ce = Object.getOwnPropertyDescriptor, de = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ce(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = o(r) || r);
  return r;
};
let tt = class extends at {
  render() {
    const e = this.config.settings, t = (s) => void this.run(this.api.updateSettings(s));
    return h`<div class="card">
      <h2>Global settings</h2>
      <div class="grid">
        ${w("Interval (s)", e.interval, (s) => t({ interval: s }))}
        ${w(
      "Transition (s)",
      e.transition,
      (s) => t({ transition: s })
    )}
        ${w(
      "Initial transition (s)",
      e.initial_transition,
      (s) => t({ initial_transition: s })
    )}
        ${w(
      "Auto-reset override (s)",
      e.autoreset_control,
      (s) => t({ autoreset_control: s })
    )}
      </div>
      <div class="actions">
        ${St(
      "Take over control",
      e.take_over_control,
      (s) => t({ take_over_control: s })
    )}
      </div>
    </div>`;
  }
};
tt.styles = V;
tt = de([
  K("ha-adapt-settings-tab")
], tt);
var pe = Object.defineProperty, ue = Object.getOwnPropertyDescriptor, $ = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ue(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && pe(t, s, r), r;
};
let g = class extends v {
  constructor() {
    super(...arguments), this._sel = null, this._previewHour = 12, this._livePreview = !1, this._setActive = () => {
      this.api.setActiveSchema(this._draft.id).then((e) => this._emit("config-changed", e)).catch((e) => this._emit("panel-error", String(e)));
    }, this._delete = () => {
      this._emit("schema-delete", this._draft.id);
    };
  }
  get _active() {
    return this.schema.id === this.config.active_schema_id;
  }
  willUpdate(e) {
    e.has("schema") && this._draft?.id !== this.schema.id && (this._flushSave(), this._draft = structuredClone(this.schema), this._sel = null, this._loadTimeline());
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
      this._emit("config-changed", e), await this._loadTimeline();
    } catch (e) {
      this._emit("panel-error", String(e));
    }
  }
  _lightCfg(e) {
    return this._draft.lights[e] ?? ee();
  }
  _patchSchema(e) {
    this._draft = { ...this._draft, ...e }, this._scheduleSave();
  }
  _patchLight(e, t) {
    const s = { ...this._lightCfg(e), ...t };
    this._draft = {
      ...this._draft,
      lights: { ...this._draft.lights, [e]: s }
    }, this._scheduleSave();
  }
  _setCell(e, t) {
    const i = [...this._lightCfg(e.entityId).hours];
    i[e.hour] = t, this._patchLight(e.entityId, { hours: i });
  }
  // --- render --------------------------------------------------------------
  render() {
    return h`
      <div class="head">
        <input
          class="name"
          .value=${this._draft.name}
          @input=${(e) => this._patchSchema({ name: e.target.value })}
        />
        <div class="head-actions">
          ${this._active ? h`<span class="badge">Active</span>` : h`<button class="btn ghost" @click=${this._setActive}>
                Set active
              </button>`}
          ${this._draft.id !== "default" ? h`<button class="btn danger" @click=${this._delete}>
                Delete
              </button>` : d}
        </div>
      </div>

      <div class="layout">
        <div class="main">
          <ha-adapt-timeline-grid
            .lights=${this.config.lights}
            .timeline=${this._timeline}
            .selected=${this._sel?.kind === "cell" ? this._sel.ref : null}
            .previewHour=${this._previewHour}
            .live=${this._livePreview}
            @select-cell=${(e) => this._sel = { kind: "cell", ref: e.detail }}
            @select-light=${(e) => this._sel = { kind: "light", entityId: e.detail }}
            @select-sun=${() => this._sel = { kind: "sun" }}
            @scrub=${(e) => this._onScrub(e.detail)}
            @live-toggle=${(e) => this._onLiveToggle(e.detail)}
          ></ha-adapt-timeline-grid>
        </div>

        <div class="side">
          ${this._renderContext()}
          <ha-adapt-settings-tab
            .config=${this.config}
            .api=${this.api}
          ></ha-adapt-settings-tab>
        </div>
      </div>
    `;
  }
  _renderContext() {
    const e = this._sel;
    return e?.kind === "sun" ? h`<ha-adapt-sun-config
        .sun=${this._draft.sun}
        @sun-changed=${(t) => this._patchSchema({ sun: t.detail })}
      ></ha-adapt-sun-config>` : e?.kind === "light" ? this._renderLightEditor(e.entityId) : e?.kind === "cell" ? this._renderCellEditor(e.ref) : h`<div class="card">
      <div class="empty">
        Click the ☀️ sun row, a light, or an hour cell to edit it here.
      </div>
    </div>`;
  }
  _renderCellEditor(e) {
    const t = this.config.lights.find((o) => o.entity_id === e.entityId), s = this._lightCfg(e.entityId).hours[e.hour], i = this._timeline?.lights[e.entityId]?.[e.hour], r = s?.brightness ?? i?.brightness ?? 50, n = s?.color_temp ?? i?.color_temp ?? 3e3;
    return h`<div class="card">
      <h2>
        ${t?.name ?? e.entityId} · ${String(e.hour).padStart(2, "0")}:00
      </h2>
      <p class="muted">
        ${s ? "Explicit override for this hour." : "Following the sun — set a value to override."}
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
      N,
      L,
      50,
      "K",
      (o) => this._setCell(e, { brightness: r, color_temp: o })
    )}
      <div class="actions">
        ${s ? h`<button class="btn ghost" @click=${() => this._setCell(e, null)}>
              Use sun (clear)
            </button>` : d}
        <button class="btn ghost" @click=${() => this._sel = null}>Close</button>
      </div>
    </div>`;
  }
  _renderLightEditor(e) {
    const t = this.config.lights.find((i) => i.entity_id === e), s = this._lightCfg(e);
    return h`<div class="card">
      <h2>${t?.name ?? e}</h2>
      ${f(
      "Min brightness",
      s.min_brightness,
      1,
      100,
      1,
      "%",
      (i) => this._patchLight(e, { min_brightness: i })
    )}
      ${f(
      "Max brightness",
      s.max_brightness,
      1,
      100,
      1,
      "%",
      (i) => this._patchLight(e, { max_brightness: i })
    )}
      ${f(
      "Min color temp",
      s.min_color_temp,
      N,
      L,
      50,
      "K",
      (i) => this._patchLight(e, { min_color_temp: i })
    )}
      ${f(
      "Max color temp",
      s.max_color_temp,
      N,
      L,
      50,
      "K",
      (i) => this._patchLight(e, { max_color_temp: i })
    )}
      <div class="actions">
        ${St(
      "Split commands (IKEA)",
      s.separate_turn_on_commands,
      (i) => this._patchLight(e, { separate_turn_on_commands: i })
    )}
        <span class="grow"></span>
        <button class="btn ghost" @click=${() => this._sel = null}>Close</button>
      </div>
    </div>`;
  }
  _onScrub(e) {
    this._previewHour = e, this._livePreview && this._sendPreview();
  }
  _onLiveToggle(e) {
    this._livePreview = e, e ? this._sendPreview() : this.api.apply();
  }
  _sendPreview() {
    window.clearTimeout(this._previewTimer), this._previewTimer = window.setTimeout(() => {
      this.api.preview(this._draft.id, this._previewHour, !0);
    }, 150);
  }
  _emit(e, t) {
    this.dispatchEvent(
      new CustomEvent(e, { detail: t, bubbles: !0, composed: !0 })
    );
  }
};
g.styles = [
  V,
  z`
      .head {
        display: flex;
        align-items: center;
        gap: 14px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      input.name {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text);
        border: none;
        border-bottom: 2px solid var(--border);
        background: transparent;
        border-radius: 0;
        padding: 4px 2px;
        width: 100%;
        max-width: 360px;
      }
      input.name:focus {
        outline: none;
        border-bottom-color: var(--accent);
      }
      .head-actions {
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 340px;
        gap: 16px;
        align-items: start;
      }
      .side {
        position: sticky;
        top: 14px;
        display: flex;
        flex-direction: column;
      }
      @media (max-width: 960px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .side {
          position: static;
        }
      }
    `
];
$([
  _({ attribute: !1 })
], g.prototype, "schema", 2);
$([
  _({ attribute: !1 })
], g.prototype, "config", 2);
$([
  _({ attribute: !1 })
], g.prototype, "api", 2);
$([
  S()
], g.prototype, "_draft", 2);
$([
  S()
], g.prototype, "_timeline", 2);
$([
  S()
], g.prototype, "_sel", 2);
$([
  S()
], g.prototype, "_previewHour", 2);
$([
  S()
], g.prototype, "_livePreview", 2);
g = $([
  K("ha-adapt-schema-editor")
], g);
var _e = Object.defineProperty, ge = Object.getOwnPropertyDescriptor, H = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? ge(t, s) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (r = (i ? o(t, s, r) : o(r)) || r);
  return i && r && _e(t, s, r), r;
};
let A = class extends v {
  constructor() {
    super(...arguments), this.narrow = !1, this._loaded = !1;
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
    const e = this._config, t = this._currentId, s = e.schemas[t];
    return h`<div
      class="wrap"
      @config-changed=${this._onConfigChanged}
      @panel-error=${this._onError}
    >
      <header>
        <h1>Adaptive Lighting</h1>
        <span class="spacer"></span>
        <button class="btn ghost" @click=${this._applyNow}>Apply now</button>
        <select
          @change=${(i) => this._selectedId = i.target.value}
        >
          ${Object.values(e.schemas).map(
      (i) => h`<option value=${i.id} ?selected=${i.id === t}>
              ${i.name}${i.id === e.active_schema_id ? " (active)" : ""}
            </option>`
    )}
        </select>
        <button class="btn ghost" @click=${this._new}>+ New</button>
      </header>

      ${this._error ? h`<div class="card error">${this._error}</div>` : d}

      ${s ? h`<ha-adapt-schema-editor
            .schema=${s}
            .config=${e}
            .api=${this._api}
            @schema-delete=${this._onDelete}
          ></ha-adapt-schema-editor>` : d}
    </div>`;
  }
  async _new() {
    const e = `schema_${Date.now().toString(36)}`;
    this._selectedId = e, await this._run(this._api.saveSchema(se(e, "New schema")));
  }
  async _onDelete(e) {
    this._selectedId = this._config.active_schema_id, await this._run(this._api.deleteSchema(e.detail));
  }
  async _applyNow() {
    await this._run(this._api.apply());
  }
  async _run(e) {
    try {
      this._config = await e, this._error = void 0;
    } catch (t) {
      this._error = String(t);
    }
  }
};
A.styles = [
  Yt,
  V,
  z`
      .wrap {
        width: 100%;
        padding: 18px 20px 64px;
        overflow-x: clip;
      }
      header {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
        margin-bottom: 18px;
      }
      header h1 {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
      }
      header select {
        width: auto;
        min-width: 160px;
      }
      .spacer {
        flex: 1;
      }
      .error {
        border-color: var(--danger);
        color: var(--danger);
      }
    `
];
H([
  _({ attribute: !1 })
], A.prototype, "hass", 2);
H([
  _({ attribute: !1 })
], A.prototype, "narrow", 2);
H([
  S()
], A.prototype, "_config", 2);
H([
  S()
], A.prototype, "_error", 2);
H([
  S()
], A.prototype, "_selectedId", 2);
A = H([
  K("ha-adapt-panel")
], A);
export {
  A as HaAdaptPanel
};
