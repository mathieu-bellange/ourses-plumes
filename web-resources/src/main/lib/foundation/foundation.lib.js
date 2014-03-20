﻿/*
 * Foundation Responsive Library
 * http://foundation.zurb.com
 * Copyright 2014, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

/* Loading Feedback */
$(document).ready(function() {
  if (loading_feedback == true) {
    alert("Foundation 5.1.1 library loaded");
  }
});

(function (e, t, n, r) {
    "use strict";

    function l(e) {
        if (typeof e == "string" || e instanceof String) e = e.replace(/^['\\/"]+|(;\s?})+|['\\/"]+$/g, "");
        return e
    }
    var i = function (t) {
        var n = t.length;
        while (n--) e("head").has("." + t[n]).length === 0 && e("head").append('<meta class="' + t[n] + '">')
    };
    i(["foundation-mq-small", "foundation-mq-medium", "foundation-mq-large", "foundation-mq-xlarge", "foundation-mq-xxlarge", "foundation-data-attribute-namespace"]), e(function () {
        typeof FastClick != "undefined" && typeof n.body != "undefined" && FastClick.attach(n.body)
    });
    var s = function (t, r) {
        if (typeof t == "string") {
            if (r) {
                var i;
                return r.jquery ? i = r[0] : i = r, e(i.querySelectorAll(t))
            }
            return e(n.querySelectorAll(t))
        }
        return e(t, r)
    }, o = function (e) {
            var t = [];
            return e || t.push("data"), this.namespace.length > 0 && t.push(this.namespace), t.push(this.name), t.join("-")
        }, i = function (t) {
            var n = t.length;
            while (n--) e("head").has("." + t[n]).length === 0 && e("head").append('<meta class="' + t[n] + '">')
        }, u = function (e) {
            var t = e.split("-"),
                n = t.length,
                r = [];
            while (n--) n !== 0 ? r.push(t[n]) : this.namespace.length > 0 ? r.push(this.namespace, t[n]) : r.push(t[n]);
            return r.reverse().join("-")
        }, a = function (t, n) {
            var r = this,
                i = !s(this).data(this.attr_name(!0));
            if (typeof t == "string") return this[t].call(this, n);
            s(this.scope).is("[" + this.attr_name() + "]") ? (s(this.scope).data(this.attr_name(!0) + "-init", e.extend({}, this.settings, n || t, this.data_options(s(this.scope)))), i && this.events(this.scope)) : s("[" + this.attr_name() + "]", this.scope).each(function () {
                var i = !s(this).data(r.attr_name(!0) + "-init");
                s(this).data(r.attr_name(!0) + "-init", e.extend({}, r.settings, n || t, r.data_options(s(this)))), i && r.events(this)
            })
        }, f = function (e, t) {
            function n() {
                t(e[0])
            }

            function r() {
                this.one("load", n);
                if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var e = this.attr("src"),
                        t = e.match(/\?/) ? "&" : "?";
                    t += "random=" + (new Date).getTime(), this.attr("src", e + t)
                }
            }
            if (!e.attr("src")) {
                n();
                return
            }
            e[0].complete || e[0].readyState === 4 ? n() : r.call(e)
        };
    t.matchMedia = t.matchMedia || function (e, t) {
        var n, r = e.documentElement,
            i = r.firstElementChild || r.firstChild,
            s = e.createElement("body"),
            o = e.createElement("div");
        return o.id = "mq-test-1", o.style.cssText = "position:absolute;top:-100em", s.style.background = "none", s.appendChild(o),
        function (e) {
            return o.innerHTML = '&shy;<style media="' + e + '"> #mq-test-1 { width: 42px; }</style>', r.insertBefore(s, i), n = o.offsetWidth === 42, r.removeChild(s), {
                matches: n,
                media: e
            }
        }
    }(n),
    function (e) {
        function u() {
            n && (s(u), jQuery.fx.tick())
        }
        var n, r = 0,
            i = ["webkit", "moz"],
            s = t.requestAnimationFrame,
            o = t.cancelAnimationFrame;
        for (; r < i.length && !s; r++) s = t[i[r] + "RequestAnimationFrame"], o = o || t[i[r] + "CancelAnimationFrame"] || t[i[r] + "CancelRequestAnimationFrame"];
        s ? (t.requestAnimationFrame = s, t.cancelAnimationFrame = o, jQuery.fx.timer = function (e) {
            e() && jQuery.timers.push(e) && !n && (n = !0, u())
        }, jQuery.fx.stop = function () {
            n = !1
        }) : (t.requestAnimationFrame = function (e, n) {
            var i = (new Date).getTime(),
                s = Math.max(0, 16 - (i - r)),
                o = t.setTimeout(function () {
                    e(i + s)
                }, s);
            return r = i + s, o
        }, t.cancelAnimationFrame = function (e) {
            clearTimeout(e)
        })
    }(jQuery), t.Foundation = {
        name: "Foundation",
        version: "5.1.1",
        media_queries: {
            small: s(".foundation-mq-small").css("font-family").replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ""),
            medium: s(".foundation-mq-medium").css("font-family").replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ""),
            large: s(".foundation-mq-large").css("font-family").replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ""),
            xlarge: s(".foundation-mq-xlarge").css("font-family").replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ""),
            xxlarge: s(".foundation-mq-xxlarge").css("font-family").replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, "")
        },
        stylesheet: e("<style></style>").appendTo("head")[0].sheet,
        global: {
            namespace: ""
        },
        init: function (e, t, n, r, i) {
            var o, u = [e, n, r, i],
                a = [];
            this.rtl = /rtl/i.test(s("html").attr("dir")), this.scope = e || this.scope, this.set_namespace();
            if (t && typeof t == "string" && !/reflow/i.test(t)) this.libs.hasOwnProperty(t) && a.push(this.init_lib(t, u));
            else
                for (var f in this.libs) a.push(this.init_lib(f, t));
            return e
        },
        init_lib: function (e, t) {
            return this.libs.hasOwnProperty(e) ? (this.patch(this.libs[e]), t && t.hasOwnProperty(e) ? this.libs[e].init.apply(this.libs[e], [this.scope, t[e]]) : (t = t instanceof Array ? t : Array(t), this.libs[e].init.apply(this.libs[e], t))) : function () {}
        },
        patch: function (e) {
            e.scope = this.scope, e.namespace = this.global.namespace, e.rtl = this.rtl, e.data_options = this.utils.data_options, e.attr_name = o, e.add_namespace = u, e.bindings = a, e.S = this.utils.S
        },
        inherit: function (e, t) {
            var n = t.split(" "),
                r = n.length;
            while (r--) this.utils.hasOwnProperty(n[r]) && (e[n[r]] = this.utils[n[r]])
        },
        set_namespace: function () {
            var t = e(".foundation-data-attribute-namespace").css("font-family");
            if (/false/i.test(t)) return;
            this.global.namespace = t
        },
        libs: {},
        utils: {
            S: s,
            throttle: function (e, t) {
                var n = null;
                return function () {
                    var r = this,
                        i = arguments;
                    clearTimeout(n), n = setTimeout(function () {
                        e.apply(r, i)
                    }, t)
                }
            },
            debounce: function (e, t, n) {
                var r, i;
                return function () {
                    var s = this,
                        o = arguments,
                        u = function () {
                            r = null, n || (i = e.apply(s, o))
                        }, a = n && !r;
                    return clearTimeout(r), r = setTimeout(u, t), a && (i = e.apply(s, o)), i
                }
            },
            data_options: function (t) {
                function a(e) {
                    return !isNaN(e - 0) && e !== null && e !== "" && e !== !1 && e !== !0
                }

                function f(t) {
                    return typeof t == "string" ? e.trim(t) : t
                }
                var n = {}, r, i, s, o = function (e) {
                        var t = Foundation.global.namespace;
                        return t.length > 0 ? e.data(t + "-options") : e.data("options")
                    }, u = o(t);
                if (typeof u == "object") return u;
                s = (u || ":").split(";"), r = s.length;
                while (r--) i = s[r].split(":"), /true/i.test(i[1]) && (i[1] = !0), /false/i.test(i[1]) && (i[1] = !1), a(i[1]) && (i[1] = parseInt(i[1], 10)), i.length === 2 && i[0].length > 0 && (n[f(i[0])] = f(i[1]));
                return n
            },
            register_media: function (t, n) {
                Foundation.media_queries[t] === r && (e("head").append('<meta class="' + n + '">'), Foundation.media_queries[t] = l(e("." + n).css("font-family")))
            },
            add_custom_rule: function (e, t) {
                if (t === r) Foundation.stylesheet.insertRule(e, Foundation.stylesheet.cssRules.length);
                else {
                    var n = Foundation.media_queries[t];
                    n !== r && Foundation.stylesheet.insertRule("@media " + Foundation.media_queries[t] + "{ " + e + " }")
                }
            },
            image_loaded: function (e, t) {
                var n = this,
                    r = e.length;
                e.each(function () {
                    f(n.S(this), function () {
                        r -= 1, r == 0 && t(e)
                    })
                })
            },
            random_str: function (e) {
                var t = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
                e || (e = Math.floor(Math.random() * t.length));
                var n = "";
                while (e--) n += t[Math.floor(Math.random() * t.length)];
                return n
            }
        }
    }, e.fn.foundation = function () {
        var e = Array.prototype.slice.call(arguments, 0);
        return this.each(function () {
            return Foundation.init.apply(Foundation, [this].concat(e)), this
        })
    }
})(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.interchange = {
        name: "interchange",
        version: "5.1.1",
        cache: {},
        images_loaded: !1,
        nodes_loaded: !1,
        settings: {
            load_attr: "interchange",
            named_queries: {
                "default": "only screen",
                small: Foundation.media_queries.small,
                medium: Foundation.media_queries.medium,
                large: Foundation.media_queries.large,
                xlarge: Foundation.media_queries.xlarge,
                xxlarge: Foundation.media_queries.xxlarge,
                landscape: "only screen and (orientation: landscape)",
                portrait: "only screen and (orientation: portrait)",
                retina: "only screen and (-webkit-min-device-pixel-ratio: 2),only screen and (min--moz-device-pixel-ratio: 2),only screen and (-o-min-device-pixel-ratio: 2/1),only screen and (min-device-pixel-ratio: 2),only screen and (min-resolution: 192dpi),only screen and (min-resolution: 2dppx)"
            },
            directives: {
                replace: function (t, n, r) {
                    if (/IMG/.test(t[0].nodeName)) {
                        var i = t[0].src;
                        if ((new RegExp(n, "i")).test(i)) return;
                        return t[0].src = n, r(t[0].src)
                    }
                    var s = t.data(this.data_attr + "-last-path");
                    if (s == n) return;
                    return e.get(n, function (e) {
                        t.html(e), t.data(this.data_attr + "-last-path", n), r()
                    })
                }
            }
        },
        init: function (t, n, r) {
            Foundation.inherit(this, "throttle random_str"), this.data_attr = this.set_data_attr(), e.extend(!0, this.settings, n, r), this.bindings(n, r), this.load("images"), this.load("nodes")
        },
        events: function () {
            var n = this;
            return e(t).off(".interchange").on("resize.fndtn.interchange", n.throttle(function () {
                n.resize()
            }, 50)), this
        },
        resize: function () {
            var t = this.cache;
            if (!this.images_loaded || !this.nodes_loaded) {
                setTimeout(e.proxy(this.resize, this), 50);
                return
            }
            for (var n in t)
                if (t.hasOwnProperty(n)) {
                    var r = this.results(n, t[n]);
                    r && this.settings.directives[r.scenario[1]].call(this, r.el, r.scenario[0], function () {
                        if (arguments[0] instanceof Array) var e = arguments[0];
                        else var e = Array.prototype.slice.call(arguments, 0);
                        r.el.trigger(r.scenario[1], e)
                    })
                }
        },
        results: function (e, t) {
            var n = t.length;
            if (n > 0) {
                var r = this.S("[" + this.add_namespace("data-uuid") + '="' + e + '"]');
                while (n--) {
                    var i, s = t[n][2];
                    this.settings.named_queries.hasOwnProperty(s) ? i = matchMedia(this.settings.named_queries[s]) : i = matchMedia(s);
                    if (i.matches) return {
                        el: r,
                        scenario: t[n]
                    }
                }
            }
            return !1
        },
        load: function (e, t) {
            return (typeof this["cached_" + e] == "undefined" || t) && this["update_" + e](), this["cached_" + e]
        },
        update_images: function () {
            var e = this.S("img[" + this.data_attr + "]"),
                t = e.length,
                n = t,
                r = 0,
                i = this.data_attr;
            this.cache = {}, this.cached_images = [], this.images_loaded = t === 0;
            while (n--) {
                r++;
                if (e[n]) {
                    var s = e[n].getAttribute(i) || "";
                    s.length > 0 && this.cached_images.push(e[n])
                }
                r === t && (this.images_loaded = !0, this.enhance("images"))
            }
            return this
        },
        update_nodes: function () {
            var e = this.S("[" + this.data_attr + "]").not("img"),
                t = e.length,
                n = t,
                r = 0,
                i = this.data_attr;
            this.cached_nodes = [], this.nodes_loaded = t === 0;
            while (n--) {
                r++;
                var s = e[n].getAttribute(i) || "";
                s.length > 0 && this.cached_nodes.push(e[n]), r === t && (this.nodes_loaded = !0, this.enhance("nodes"))
            }
            return this
        },
        enhance: function (n) {
            var r = this["cached_" + n].length;
            while (r--) this.object(e(this["cached_" + n][r]));
            return e(t).trigger("resize")
        },
        parse_params: function (e, t, n) {
            return [this.trim(e), this.convert_directive(t), this.trim(n)]
        },
        convert_directive: function (e) {
            var t = this.trim(e);
            return t.length > 0 ? t : "replace"
        },
        object: function (e) {
            var t = this.parse_data_attr(e),
                n = [],
                r = t.length;
            if (r > 0)
                while (r--) {
                    var i = t[r].split(/\((.*?)(\))$/);
                    if (i.length > 1) {
                        var s = i[0].split(","),
                            o = this.parse_params(s[0], s[1], i[1]);
                        n.push(o)
                    }
                }
            return this.store(e, n)
        },
        uuid: function (e) {
            function r() {
                return n.random_str(6)
            }
            var t = e || "-",
                n = this;
            return r() + r() + t + r() + t + r() + t + r() + t + r() + r() + r()
        },
        store: function (e, t) {
            var n = this.uuid(),
                r = e.data(this.add_namespace("uuid", !0));
            return this.cache[r] ? this.cache[r] : (e.attr(this.add_namespace("data-uuid"), n), this.cache[n] = t)
        },
        trim: function (t) {
            return typeof t == "string" ? e.trim(t) : t
        },
        set_data_attr: function (e) {
            return e ? this.namespace.length > 0 ? this.namespace + "-" + this.settings.load_attr : this.settings.load_attr : this.namespace.length > 0 ? "data-" + this.namespace + "-" + this.settings.load_attr : "data-" + this.settings.load_attr
        },
        parse_data_attr: function (e) {
            var t = e.attr(this.attr_name()).split(/\[(.*?)\]/),
                n = t.length,
                r = [];
            while (n--) t[n].replace(/[\W\d]+/, "").length > 4 && r.push(t[n]);
            return r
        },
        reflow: function () {
            this.load("images", !0), this.load("nodes", !0)
        }
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.equalizer = {
        name: "equalizer",
        version: "5.1.1",
        settings: {
            use_tallest: !0,
            before_height_change: e.noop,
            after_height_change: e.noop
        },
        init: function (e, t, n) {
            this.bindings(t, n), this.reflow()
        },
        events: function () {
            this.S(t).off(".equalizer").on("resize.fndtn.equalizer", function (e) {
                this.reflow()
            }.bind(this))
        },
        equalize: function (t) {
            var n = !1,
                r = t.find("[" + this.attr_name() + "-watch]"),
                i = r.first().offset().top,
                s = t.data(this.attr_name(!0) + "-init");
            if (r.length === 0) return;
            s.before_height_change(), t.trigger("before-height-change"), r.height("inherit"), r.each(function () {
                var t = e(this);
                t.offset().top !== i && (n = !0)
            });
            if (n) return;
            var o = r.map(function () {
                return e(this).outerHeight()
            });
            if (s.use_tallest) {
                var u = Math.max.apply(null, o);
                r.height(u)
            } else {
                var a = Math.min.apply(null, o);
                r.height(a)
            }
            s.after_height_change(), t.trigger("after-height-change")
        },
        reflow: function () {
            var t = this;
            this.S("[" + this.attr_name() + "]", this.scope).each(function () {
                t.equalize(e(this))
            })
        }
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.abide = {
        name: "abide",
        version: "5.1.1",
        settings: {
            live_validate: !0,
            focus_on_invalid: !0,
            error_labels: !0,
            timeout: 1e3,
            patterns: {
                alpha: /^[a-zA-Z]+$/,
                alpha_numeric: /^[a-zA-Z0-9]+$/,
                integer: /^\d+$/,
                number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,
                password: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
                card: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
                cvv: /^([0-9]){3,4}$/,
                email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                url: /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,
                domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
                datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
                date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
                time: /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
                dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
                month_day_year: /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,
                color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
            }
        },
        timer: null,
        init: function (e, t, n) {
            this.bindings(t, n)
        },
        events: function (t) {
            var n = this,
                r = n.S(t).attr("novalidate", "novalidate"),
                i = r.data(this.attr_name(!0) + "-init");
            this.invalid_attr = this.add_namespace("data-invalid"), r.off(".abide").on("submit.fndtn.abide validate.fndtn.abide", function (e) {
                var t = /ajax/i.test(n.S(this).attr(n.attr_name()));
                return n.validate(n.S(this).find("input, textarea, select").get(), e, t)
            }).on("reset", function () {
                return n.reset(e(this))
            }).find("input, textarea, select").off(".abide").on("blur.fndtn.abide change.fndtn.abide", function (e) {
                n.validate([this], e)
            }).on("keydown.fndtn.abide", function (t) {
                var r = e(this).closest("form").data("abide-init");
                r.live_validate === !0 && (clearTimeout(n.timer), n.timer = setTimeout(function () {
                    n.validate([this], t)
                }.bind(this), r.timeout))
            })
        },
        reset: function (t) {
            t.removeAttr(this.invalid_attr), e(this.invalid_attr, t).removeAttr(this.invalid_attr), e(".error", t).not("small").removeClass("error")
        },
        validate: function (e, t, n) {
            var r = this.parse_patterns(e),
                i = r.length,
                s = this.S(e[0]).closest("form"),
                o = /submit/.test(t.type);
            for (var u = 0; u < i; u++)
                if (!r[u] && (o || n)) return this.settings.focus_on_invalid && e[u].focus(), s.trigger("invalid"), this.S(e[u]).closest("form").attr(this.invalid_attr, ""), !1;
            return (o || n) && s.trigger("valid"), s.removeAttr(this.invalid_attr), n ? !1 : !0
        },
        parse_patterns: function (e) {
            var t = e.length,
                n = [];
            while (t--) n.push(this.pattern(e[t]));
            return this.check_validation_and_apply_styles(n)
        },
        pattern: function (e) {
            var t = e.getAttribute("type"),
                n = typeof e.getAttribute("required") == "string",
                r = e.getAttribute("pattern") || "";
            return this.settings.patterns.hasOwnProperty(r) && r.length > 0 ? [e, this.settings.patterns[r], n] : r.length > 0 ? [e, new RegExp(r), n] : this.settings.patterns.hasOwnProperty(t) ? [e, this.settings.patterns[t], n] : (r = /.*/, [e, r, n])
        },
        check_validation_and_apply_styles: function (t) {
            var n = t.length,
                r = [];
            while (n--) {
                var i = t[n][0],
                    s = t[n][2],
                    o = i.value,
                    u = this.S(i).parent(),
                    a = i.getAttribute(this.add_namespace("data-equalto")),
                    f = i.type === "radio",
                    l = i.type === "checkbox",
                    c = this.S('label[for="' + i.getAttribute("id") + '"]'),
                    h = s ? i.value.length > 0 : !0,
                    p;
                u.is("label") ? p = u.parent() : p = u, f && s ? r.push(this.valid_radio(i, s)) : l && s ? r.push(this.valid_checkbox(i, s)) : a && s ? r.push(this.valid_equal(i, s, p)) : t[n][1].test(o) && h || !s && i.value.length < 1 ? (this.S(i).removeAttr(this.invalid_attr), p.removeClass("error"), c.length > 0 && this.settings.error_labels && c.removeClass("error"), r.push(!0), e(i).triggerHandler("valid")) : (this.S(i).attr(this.invalid_attr, ""), p.addClass("error"), c.length > 0 && this.settings.error_labels && c.addClass("error"), r.push(!1), e(i).triggerHandler("invalid"))
            }
            return r
        },
        valid_checkbox: function (e, t) {
            var e = this.S(e),
                n = e.is(":checked") || !t;
            return n ? e.removeAttr(this.invalid_attr).parent().removeClass("error") : e.attr(this.invalid_attr, "").parent().addClass("error"), n
        },
        valid_radio: function (e, t) {
            var r = e.getAttribute("name"),
                i = n.getElementsByName(r),
                s = i.length,
                o = !1;
            for (var u = 0; u < s; u++) i[u].checked && (o = !0);
            for (var u = 0; u < s; u++) o ? this.S(i[u]).removeAttr(this.invalid_attr).parent().removeClass("error") : this.S(i[u]).attr(this.invalid_attr, "").parent().addClass("error");
            return o
        },
        valid_equal: function (e, t, r) {
            var i = n.getElementById(e.getAttribute(this.add_namespace("data-equalto"))).value,
                s = e.value,
                o = i === s;
            return o ? (this.S(e).removeAttr(this.invalid_attr), r.removeClass("error")) : (this.S(e).attr(this.invalid_attr, ""), r.addClass("error")), o
        }
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.dropdown = {
        name: "dropdown",
        version: "5.1.1",
        settings: {
            active_class: "open",
            is_hover: !1,
            opened: function () {},
            closed: function () {}
        },
        init: function (e, t, n) {
            Foundation.inherit(this, "throttle"), this.bindings(t, n)
        },
        events: function (n) {
            var r = this,
                i = r.S;
            i(this.scope).off(".dropdown").on("click.fndtn.dropdown", "[" + this.attr_name() + "]", function (e) {
                var t = i(this).data(r.attr_name(!0) + "-init") || r.settings;
                e.preventDefault(), (!t.is_hover || Modernizr.touch) && r.toggle(i(this))
            }).on("mouseenter.fndtn.dropdown", "[" + this.attr_name() + "], [" + this.attr_name() + "-content]", function (e) {
                var t = i(this);
                clearTimeout(r.timeout);
                if (t.data(r.data_attr())) var n = i("#" + t.data(r.data_attr())),
                s = t;
                else {
                    var n = t;
                    s = i("[" + r.attr_name() + "='" + n.attr("id") + "']")
                }
                var o = s.data(r.attr_name(!0) + "-init") || r.settings;
                i(e.target).data(r.data_attr()) && o.is_hover && r.closeall.call(r), o.is_hover && r.open.apply(r, [n, s])
            }).on("mouseleave.fndtn.dropdown", "[" + this.attr_name() + "], [" + this.attr_name() + "-content]", function (e) {
                var t = i(this);
                r.timeout = setTimeout(function () {
                    if (t.data(r.data_attr())) {
                        var e = t.data(r.data_attr(!0) + "-init") || r.settings;
                        e.is_hover && r.close.call(r, i("#" + t.data(r.data_attr())))
                    } else {
                        var n = i("[" + r.attr_name() + '="' + i(this).attr("id") + '"]'),
                            e = n.data(r.attr_name(!0) + "-init") || r.settings;
                        e.is_hover && r.close.call(r, t)
                    }
                }.bind(this), 150)
            }).on("click.fndtn.dropdown", function (t) {
                var n = i(t.target).closest("[" + r.attr_name() + "-content]");
                if (i(t.target).data(r.data_attr()) || i(t.target).parent().data(r.data_attr())) return;
                if (!i(t.target).data("revealId") && n.length > 0 && (i(t.target).is("[" + r.attr_name() + "-content]") || e.contains(n.first()[0], t.target))) {
                    t.stopPropagation();
                    return
                }
                r.close.call(r, i("[" + r.attr_name() + "-content]"))
            }).on("opened.fndtn.dropdown", "[" + r.attr_name() + "-content]", function () {
                r.settings.opened.call(this)
            }).on("closed.fndtn.dropdown", "[" + r.attr_name() + "-content]", function () {
                r.settings.closed.call(this)
            }), i(t).off(".dropdown").on("resize.fndtn.dropdown", r.throttle(function () {
                r.resize.call(r)
            }, 50)).trigger("resize")
        },
        close: function (e) {
            var t = this;
            e.each(function () {
                t.S(this).hasClass(t.settings.active_class) && (t.S(this).css(Foundation.rtl ? "right" : "left", "-99999px").removeClass(t.settings.active_class), t.S(this).trigger("closed"))
            })
        },
        closeall: function () {
            var t = this;
            e.each(t.S("[" + this.attr_name() + "-content]"), function () {
                t.close.call(t, t.S(this))
            })
        },
        open: function (e, t) {
            this.css(e.addClass(this.settings.active_class), t), e.trigger("opened")
        },
        data_attr: function () {
            return this.namespace.length > 0 ? this.namespace + "-" + this.name : this.name
        },
        toggle: function (e) {
            var t = this.S("#" + e.data(this.data_attr()));
            if (t.length === 0) return;
            this.close.call(this, this.S("[" + this.attr_name() + "-content]").not(t)), t.hasClass(this.settings.active_class) ? this.close.call(this, t) : (this.close.call(this, this.S("[" + this.attr_name() + "-content]")), this.open.call(this, t, e))
        },
        resize: function () {
            var e = this.S("[" + this.attr_name() + "-content].open"),
                t = this.S("[" + this.attr_name() + "='" + e.attr("id") + "']");
            e.length && t.length && this.css(e, t)
        },
        css: function (e, n) {
            var r = e.offsetParent(),
                i = n.offset();
            i.top -= r.offset().top, i.left -= r.offset().left;
            if (this.small()) e.css({
                position: "absolute",
                width: "95%",
                "max-width": "none",
                top: i.top + n.outerHeight()
            }), e.css(Foundation.rtl ? "right" : "left", "2.5%");
            else {
                if (!Foundation.rtl && this.S(t).width() > e.outerWidth() + n.offset().left) {
                    var s = i.left;
                    e.hasClass("right") && e.removeClass("right")
                } else {
                    e.hasClass("right") || e.addClass("right");
                    var s = i.left - (e.outerWidth() - n.outerWidth())
                }
                e.attr("style", "").css({
                    position: "absolute",
                    top: i.top + n.outerHeight(),
                    left: s
                })
            }
            return e
        },
        small: function () {
            return matchMedia(Foundation.media_queries.small).matches && !matchMedia(Foundation.media_queries.medium).matches
        },
        off: function () {
            this.S(this.scope).off(".fndtn.dropdown"), this.S("html, body").off(".fndtn.dropdown"), this.S(t).off(".fndtn.dropdown"), this.S("[data-dropdown-content]").off(".fndtn.dropdown"), this.settings.init = !1
        },
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.alert = {
        name: "alert",
        version: "5.1.1",
        settings: {
            animation: "fadeOut",
            speed: 300,
            callback: function () {}
        },
        init: function (e, t, n) {
            this.bindings(t, n)
        },
        events: function () {
            var t = this,
                n = this.S;
            e(this.scope).off(".alert").on("click.fndtn.alert", "[" + this.attr_name() + "] a.close", function (e) {
                var r = n(this).closest("[" + t.attr_name() + "]"),
                    i = r.data(t.attr_name(!0) + "-init") || t.settings;
                e.preventDefault(), r[i.animation](i.speed, function () {
                    n(this).trigger("closed").remove(), i.callback()
                })
            })
        },
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs["magellan-expedition"] = {
        name: "magellan-expedition",
        version: "5.1.1",
        settings: {
            active_class: "active",
            threshold: 0,
            destination_threshold: 20,
            throttle_delay: 30
        },
        init: function (e, t, n) {
            Foundation.inherit(this, "throttle"), this.bindings(t, n)
        },
        events: function () {
            var n = this,
                r = n.S,
                i = n.settings;
            n.set_expedition_position(), r(n.scope).off(".magellan").on("click.fndtn.magellan", "[" + n.add_namespace("data-magellan-arrival") + '] a[href^="#"]', function (r) {
                r.preventDefault();
                var i = e(this).closest("[" + n.attr_name() + "]"),
                    s = i.data("magellan-expedition-init"),
                    o = this.hash.split("#").join(""),
                    u = e("a[name=" + o + "]");
                u.length === 0 && (u = e("#" + o));
                var a = u.offset().top;
                i.css("position") === "fixed" && (a -= i.outerHeight()), e("html, body").stop().animate({
                    scrollTop: a
                }, 700, "swing", function () {
                    t.location.hash = "#" + o
                })
            }).on("scroll.fndtn.magellan", n.throttle(this.check_for_arrivals.bind(this), i.throttle_delay)).on("resize.fndtn.magellan", n.throttle(this.set_expedition_position.bind(this), i.throttle_delay))
        },
        check_for_arrivals: function () {
            var e = this;
            e.update_arrivals(), e.update_expedition_positions()
        },
        set_expedition_position: function () {
            var t = this;
            e("[" + this.attr_name() + "=fixed]", t.scope).each(function (n, r) {
                var i = e(this),
                    s = i.attr("styles"),
                    o;
                i.attr("style", ""), o = i.offset().top, i.data(t.data_attr("magellan-top-offset"), o), i.attr("style", s)
            })
        },
        update_expedition_positions: function () {
            var n = this,
                r = e(t).scrollTop();
            e("[" + this.attr_name() + "=fixed]", n.scope).each(function () {
                var t = e(this),
                    i = t.data("magellan-top-offset");
                if (r >= i) {
                    var s = t.prev("[" + n.add_namespace("data-magellan-expedition-clone") + "]");
                    s.length === 0 && (s = t.clone(), s.removeAttr(n.attr_name()), s.attr(n.add_namespace("data-magellan-expedition-clone"), ""), t.before(s)), t.css({
                        position: "fixed",
                        top: 0
                    })
                } else t.prev("[" + n.add_namespace("data-magellan-expedition-clone") + "]").remove(), t.attr("style", "")
            })
        },
        update_arrivals: function () {
            var n = this,
                r = e(t).scrollTop();
            e("[" + this.attr_name() + "]", n.scope).each(function () {
                var t = e(this),
                    i = i = t.data(n.attr_name(!0) + "-init"),
                    s = n.offsets(t, r),
                    o = t.find("[" + n.add_namespace("data-magellan-arrival") + "]"),
                    u = !1;
                s.each(function (e, r) {
                    if (r.viewport_offset >= r.top_offset) {
                        var s = t.find("[" + n.add_namespace("data-magellan-arrival") + "]");
                        return s.not(r.arrival).removeClass(i.active_class), r.arrival.addClass(i.active_class), u = !0, !0
                    }
                }), u || o.removeClass(i.active_class)
            })
        },
        offsets: function (t, n) {
            var r = this,
                i = t.data(r.attr_name(!0) + "-init"),
                s = n + i.destination_threshold;
            return t.find("[" + r.add_namespace("data-magellan-arrival") + "]").map(function (t, n) {
                var i = e(this).data(r.data_attr("magellan-arrival")),
                    o = e("[" + r.add_namespace("data-magellan-destination") + "=" + i + "]");
                if (o.length > 0) {
                    var u = o.offset().top;
                    return {
                        destination: o,
                        arrival: e(this),
                        top_offset: u,
                        viewport_offset: s
                    }
                }
            }).sort(function (e, t) {
                return e.top_offset < t.top_offset ? -1 : e.top_offset > t.top_offset ? 1 : 0
            })
        },
        data_attr: function (e) {
            return this.namespace.length > 0 ? this.namespace + "-" + e : e
        },
        off: function () {
            this.S(this.scope).off(".magellan"), this.S(t).off(".magellan")
        },
        reflow: function () {
            var t = this;
            e("[" + t.add_namespace("data-magellan-expedition-clone") + "]", t.scope).remove()
        }
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.reveal = {
        name: "reveal",
        version: "5.1.1",
        locked: !1,
        settings: {
            animation: "fadeAndPop",
            animation_speed: 250,
            close_on_background_click: !0,
            close_on_esc: !0,
            dismiss_modal_class: "close-reveal-modal",
            bg_class: "reveal-modal-bg",
            open: function () {},
            opened: function () {},
            close: function () {},
            closed: function () {},
            bg: e(".reveal-modal-bg"),
            css: {
                open: {
                    opacity: 0,
                    visibility: "visible",
                    display: "block"
                },
                close: {
                    opacity: 1,
                    visibility: "hidden",
                    display: "none"
                }
            }
        },
        init: function (t, n, r) {
            e.extend(!0, this.settings, n, r), this.bindings(n, r)
        },
        events: function (e) {
            var t = this,
                r = t.S;
            return r(this.scope).off(".reveal").on("click.fndtn.reveal", "[" + this.add_namespace("data-reveal-id") + "]", function (e) {
                e.preventDefault();
                if (!t.locked) {
                    var n = r(this),
                        i = n.data(t.data_attr("reveal-ajax"));
                    t.locked = !0;
                    if (typeof i == "undefined") t.open.call(t, n);
                    else {
                        var s = i === !0 ? n.attr("href") : i;
                        t.open.call(t, n, {
                            url: s
                        })
                    }
                }
            }), r(n).on("click.fndtn.reveal", this.close_targets(), function (e) {
                e.preventDefault();
                if (!t.locked) {
                    var n = r("[" + t.attr_name() + "].open").data(t.attr_name(!0) + "-init"),
                        i = r(e.target)[0] === r("." + n.bg_class)[0];
                    if (i && !n.close_on_background_click) return;
                    t.locked = !0, t.close.call(t, i ? r("[" + t.attr_name() + "].open") : r(this).closest("[" + t.attr_name() + "]"))
                }
            }), r("[" + t.attr_name() + "]", this.scope).length > 0 ? r(this.scope).on("open.fndtn.reveal", this.settings.open).on("opened.fndtn.reveal", this.settings.opened).on("opened.fndtn.reveal", this.open_video).on("close.fndtn.reveal", this.settings.close).on("closed.fndtn.reveal", this.settings.closed).on("closed.fndtn.reveal", this.close_video) : r(this.scope).on("open.fndtn.reveal", "[" + t.attr_name() + "]", this.settings.open).on("opened.fndtn.reveal", "[" + t.attr_name() + "]", this.settings.opened).on("opened.fndtn.reveal", "[" + t.attr_name() + "]", this.open_video).on("close.fndtn.reveal", "[" + t.attr_name() + "]", this.settings.close).on("closed.fndtn.reveal", "[" + t.attr_name() + "]", this.settings.closed).on("closed.fndtn.reveal", "[" + t.attr_name() + "]", this.close_video), !0
        },
        key_up_on: function (e) {
            var t = this;
            return t.S("body").off("keyup.fndtn.reveal").on("keyup.fndtn.reveal", function (e) {
                var n = t.S("[" + t.attr_name() + "].open"),
                    r = n.data(t.attr_name(!0) + "-init");
                r && e.which === 27 && r.close_on_esc && !t.locked && t.close.call(t, n)
            }), !0
        },
        key_up_off: function (e) {
            return this.S("body").off("keyup.fndtn.reveal"), !0
        },
        open: function (t, n) {
            var r = this;
            if (t)
                if (typeof t.selector != "undefined") var i = r.S("#" + t.data(r.data_attr("reveal-id")));
                else {
                    var i = r.S(this.scope);
                    n = t
                } else var i = r.S(this.scope);
            var s = i.data(r.attr_name(!0) + "-init");
            if (!i.hasClass("open")) {
                var o = r.S("[" + r.attr_name() + "].open");
                typeof i.data("css-top") == "undefined" && i.data("css-top", parseInt(i.css("top"), 10)).data("offset", this.cache_offset(i)), this.key_up_on(i), i.trigger("open"), o.length < 1 && this.toggle_bg(i), typeof n == "string" && (n = {
                    url: n
                });
                if (typeof n == "undefined" || !n.url) {
                    if (o.length > 0) {
                        var u = o.data(r.attr_name(!0) + "-init");
                        this.hide(o, u.css.close)
                    }
                    this.show(i, s.css.open)
                } else {
                    var a = typeof n.success != "undefined" ? n.success : null;
                    e.extend(n, {
                        success: function (t, n, u) {
                            e.isFunction(a) && a(t, n, u), i.html(t), r.S(i).foundation("section", "reflow");
                            if (o.length > 0) {
                                var f = o.data(r.attr_name(!0));
                                r.hide(o, f.css.close)
                            }
                            r.show(i, s.css.open)
                        }
                    }), e.ajax(n)
                }
            }
        },
        close: function (e) {
            var e = e && e.length ? e : this.S(this.scope),
                t = this.S("[" + this.attr_name() + "].open"),
                n = e.data(this.attr_name(!0) + "-init");
            t.length > 0 && (this.locked = !0, this.key_up_off(e), e.trigger("close"), this.toggle_bg(e), this.hide(t, n.css.close, n))
        },
        close_targets: function () {
            var e = "." + this.settings.dismiss_modal_class;
            return this.settings.close_on_background_click ? e + ", ." + this.settings.bg_class : e
        },
        toggle_bg: function (t) {
            var n = t.data(this.attr_name(!0));
            this.S("." + this.settings.bg_class).length === 0 && (this.settings.bg = e("<div />", {
                "class": this.settings.bg_class
            }).appendTo("body")), this.settings.bg.filter(":visible").length > 0 ? this.hide(this.settings.bg) : this.show(this.settings.bg)
        },
        show: function (n, r) {
            if (r) {
                var i = n.data(this.attr_name(!0) + "-init");
                if (n.parent("body").length === 0) {
                    var s = n.wrap('<div style="display: none;" />').parent(),
                        o = this.settings.rootElement || "body";
                    n.on("closed.fndtn.reveal.wrapped", function () {
                        n.detach().appendTo(s), n.unwrap().unbind("closed.fndtn.reveal.wrapped")
                    }), n.detach().appendTo(o)
                }
                if (/pop/i.test(i.animation)) {
                    r.top = e(t).scrollTop() - n.data("offset") + "px";
                    var u = {
                        top: e(t).scrollTop() + n.data("css-top") + "px",
                        opacity: 1
                    };
                    return setTimeout(function () {
                        return n.css(r).animate(u, i.animation_speed, "linear", function () {
                            this.locked = !1, n.trigger("opened")
                        }.bind(this)).addClass("open")
                    }.bind(this), i.animation_speed / 2)
                }
                if (/fade/i.test(i.animation)) {
                    var u = {
                        opacity: 1
                    };
                    return setTimeout(function () {
                        return n.css(r).animate(u, i.animation_speed, "linear", function () {
                            this.locked = !1, n.trigger("opened")
                        }.bind(this)).addClass("open")
                    }.bind(this), i.animation_speed / 2)
                }
                return n.css(r).show().css({
                    opacity: 1
                }).addClass("open").trigger("opened")
            }
            var i = this.settings;
            return /fade/i.test(i.animation) ? n.fadeIn(i.animation_speed / 2) : (this.locked = !1, n.show())
        },
        hide: function (n, r) {
            if (r) {
                var i = n.data(this.attr_name(!0) + "-init");
                if (/pop/i.test(i.animation)) {
                    var s = {
                        top: -e(t).scrollTop() - n.data("offset") + "px",
                        opacity: 0
                    };
                    return setTimeout(function () {
                        return n.animate(s, i.animation_speed, "linear", function () {
                            this.locked = !1, n.css(r).trigger("closed")
                        }.bind(this)).removeClass("open")
                    }.bind(this), i.animation_speed / 2)
                }
                if (/fade/i.test(i.animation)) {
                    var s = {
                        opacity: 0
                    };
                    return setTimeout(function () {
                        return n.animate(s, i.animation_speed, "linear", function () {
                            this.locked = !1, n.css(r).trigger("closed")
                        }.bind(this)).removeClass("open")
                    }.bind(this), i.animation_speed / 2)
                }
                return n.hide().css(r).removeClass("open").trigger("closed")
            }
            var i = this.settings;
            return /fade/i.test(i.animation) ? n.fadeOut(i.animation_speed / 2) : n.hide()
        },
        close_video: function (t) {
            var n = e(".flex-video", t.target),
                r = e("iframe", n);
            r.length > 0 && (r.attr("data-src", r[0].src), r.attr("src", "about:blank"), n.hide())
        },
        open_video: function (t) {
            var n = e(".flex-video", t.target),
                i = n.find("iframe");
            if (i.length > 0) {
                var s = i.attr("data-src");
                if (typeof s == "string") i[0].src = i.attr("data-src");
                else {
                    var o = i[0].src;
                    i[0].src = r, i[0].src = o
                }
                n.show()
            }
        },
        data_attr: function (e) {
            return this.namespace.length > 0 ? this.namespace + "-" + e : e
        },
        cache_offset: function (e) {
            var t = e.show().height() + parseInt(e.css("top"), 10);
            return e.hide(), t
        },
        off: function () {
            e(this.scope).off(".fndtn.reveal")
        },
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.tooltip = {
        name: "tooltip",
        version: "5.1.1",
        settings: {
            additional_inheritable_classes: [],
            tooltip_class: ".tooltip",
            append_to: "body",
            touch_close_text: "Tap To Close",
            disable_for_touch: !1,
            hover_delay: 200,
            tip_template: function (e, t) {
                return '<span data-selector="' + e + '" class="' + Foundation.libs.tooltip.settings.tooltip_class.substring(1) + '">' + t + '<span class="nub"></span></span>'
            }
        },
        cache: {},
        init: function (e, t, n) {
            Foundation.inherit(this, "random_str"), this.bindings(t, n)
        },
        events: function () {
            var t = this,
                r = t.S;
            Modernizr.touch ? r(n).off(".tooltip").on("click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip", "[" + this.attr_name() + "]:not(a)", function (n) {
                var i = e.extend({}, t.settings, t.data_options(r(this)));
                i.disable_for_touch || (n.preventDefault(), r(i.tooltip_class).hide(), t.showOrCreateTip(r(this)))
            }).on("click.fndtn.tooltip touchstart.fndtn.tooltip touchend.fndtn.tooltip", this.settings.tooltip_class, function (e) {
                e.preventDefault(), r(this).fadeOut(150)
            }) : r(n).off(".tooltip").on("mouseenter.fndtn.tooltip mouseleave.fndtn.tooltip", "[" + this.attr_name() + "]", function (e) {
                var n = r(this);
                if (/enter|over/i.test(e.type)) this.timer = setTimeout(function () {
                    var e = t.showOrCreateTip(n)
                }.bind(this), t.settings.hover_delay);
                else if (e.type === "mouseout" || e.type === "mouseleave") clearTimeout(this.timer), t.hide(n)
            })
        },
        showOrCreateTip: function (e) {
            var t = this.getTip(e);
            return t && t.length > 0 ? this.show(e) : this.create(e)
        },
        getTip: function (e) {
            var t = this.selector(e),
                n = null;
            return t && (n = this.S('span[data-selector="' + t + '"]' + this.settings.tooltip_class)), typeof n == "object" ? n : !1
        },
        selector: function (e) {
            var t = e.attr("id"),
                n = e.attr(this.attr_name()) || e.attr("data-selector");
            return (t && t.length < 1 || !t) && typeof n != "string" && (n = "tooltip" + this.random_str(6), e.attr("data-selector", n)), t && t.length > 0 ? t : n
        },
        create: function (t) {
            var n = e(this.settings.tip_template(this.selector(t), e("<div></div>").html(t.attr("title")).html())),
                r = this.inheritable_classes(t);
            n.addClass(r).appendTo(this.settings.append_to), Modernizr.touch && n.append('<span class="tap-to-close">' + this.settings.touch_close_text + "</span>"), t.removeAttr("title").attr("title", ""), this.show(t)
        },
        reposition: function (e, t, n) {
            var r, i, s, o, u, a;
            t.css("visibility", "hidden").show(), r = e.data("width"), i = t.children(".nub"), s = i.outerHeight(), o = i.outerHeight(), this.small() ? t.css({
                width: "100%"
            }) : t.css({
                width: r ? r : "auto"
            }), a = function (e, t, n, r, i, s) {
                return e.css({
                    top: t ? t : "auto",
                    bottom: r ? r : "auto",
                    left: i ? i : "auto",
                    right: n ? n : "auto"
                }).end()
            }, a(t, e.offset().top + e.outerHeight() + 10, "auto", "auto", e.offset().left);
            if (this.small()) a(t, e.offset().top + e.outerHeight() + 10, "auto", "auto", 12.5, this.S(this.scope).width()), t.addClass("tip-override"), a(i, -s, "auto", "auto", e.offset().left + 10);
            else {
                var f = e.offset().left;
                Foundation.rtl && (f = e.offset().left + e.outerWidth() - t.outerWidth()), a(t, e.offset().top + e.outerHeight() + 10, "auto", "auto", f), t.removeClass("tip-override"), i.removeAttr("style"), n && n.indexOf("tip-top") > -1 ? a(t, e.offset().top - t.outerHeight() - 10, "auto", "auto", f).removeClass("tip-override") : n && n.indexOf("tip-left") > -1 ? a(t, e.offset().top + e.outerHeight() / 2 - t.outerHeight() / 2, "auto", "auto", e.offset().left - t.outerWidth() - s).removeClass("tip-override") : n && n.indexOf("tip-right") > -1 && a(t, e.offset().top + e.outerHeight() / 2 - t.outerHeight() / 2, "auto", "auto", e.offset().left + e.outerWidth() + s).removeClass("tip-override")
            }
            t.css("visibility", "visible").hide()
        },
        small: function () {
            return matchMedia(Foundation.media_queries.small).matches
        },
        inheritable_classes: function (t) {
            var n = ["tip-top", "tip-left", "tip-bottom", "tip-right", "radius", "round"].concat(this.settings.additional_inheritable_classes),
                r = t.attr("class"),
                i = r ? e.map(r.split(" "), function (t, r) {
                    if (e.inArray(t, n) !== -1) return t
                }).join(" ") : "";
            return e.trim(i)
        },
        show: function (e) {
            var t = this.getTip(e);
            return this.reposition(e, t, e.attr("class")), t.fadeIn(150)
        },
        hide: function (e) {
            var t = this.getTip(e);
            return t.fadeOut(150)
        },
        reload: function () {
            var t = e(this);
            return t.data("fndtn-tooltips") ? t.foundationTooltips("destroy").foundationTooltips("init") : t.foundationTooltips("init")
        },
        off: function () {
            this.S(this.scope).off(".fndtn.tooltip"), this.S(this.settings.tooltip_class).each(function (t) {
                e("[" + this.attr_name() + "]").get(t).attr("title", e(this).text())
            }).remove()
        },
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.tab = {
        name: "tab",
        version: "5.1.1",
        settings: {
            active_class: "active",
            callback: function () {}
        },
        init: function (e, t, n) {
            this.bindings(t, n)
        },
        events: function () {
            var e = this,
                t = this.S;
            t(this.scope).off(".tab").on("click.fndtn.tab", "[" + this.attr_name() + "] > dd > a", function (n) {
                n.preventDefault(), n.stopPropagation();
                var r = t(this).parent(),
                    i = r.closest("[" + e.attr_name() + "]"),
                    s = t("#" + this.href.split("#")[1]),
                    o = r.siblings(),
                    u = i.data(e.attr_name(!0) + "-init");
                t(this).data(e.data_attr("tab-content")) && (s = t("#" + t(this).data(e.data_attr("tab-content")).split("#")[1])), r.addClass(u.active_class).triggerHandler("opened"), o.removeClass(u.active_class), s.siblings().removeClass(u.active_class).end().addClass(u.active_class), u.callback(r), i.triggerHandler("toggled", [r])
            })
        },
        data_attr: function (e) {
            return this.namespace.length > 0 ? this.namespace + "-" + e : e
        },
        off: function () {},
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.clearing = {
        name: "clearing",
        version: "5.1.1",
        settings: {
            templates: {
                viewing: '<a href="#" class="clearing-close">&times;</a><div class="visible-img" style="display: none"><div class="clearing-touch-label"></div><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" /><p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a><a href="#" class="clearing-main-next"><span></span></a></div>'
            },
            close_selectors: ".clearing-close",
            touch_label: "&larr;&nbsp;Swipe to Advance&nbsp;&rarr;",
            init: !1,
            locked: !1
        },
        init: function (e, t, n) {
            var r = this;
            Foundation.inherit(this, "throttle image_loaded"), this.bindings(t, n), r.S(this.scope).is("[" + this.attr_name() + "]") ? this.assemble(r.S("li", this.scope)) : r.S("[" + this.attr_name() + "]", this.scope).each(function () {
                r.assemble(r.S("li", this))
            })
        },
        events: function (e) {
            var n = this,
                r = n.S;
            r(this.scope).off(".clearing").on("click.fndtn.clearing", "ul[" + this.attr_name() + "] li", function (e, t, i) {
                var t = t || r(this),
                    i = i || t,
                    s = t.next("li"),
                    o = t.closest("[" + n.attr_name() + "]").data(n.attr_name(!0) + "-init"),
                    u = r(e.target);
                e.preventDefault(), o || (n.init(), o = t.closest("[" + n.attr_name() + "]").data(n.attr_name(!0) + "-init")), i.hasClass("visible") && t[0] === i[0] && s.length > 0 && n.is_open(t) && (i = s, u = r("img", i)), n.open(u, t, i), n.update_paddles(i)
            }).on("click.fndtn.clearing", ".clearing-main-next", function (e) {
                n.nav(e, "next")
            }).on("click.fndtn.clearing", ".clearing-main-prev", function (e) {
                n.nav(e, "prev")
            }).on("click.fndtn.clearing", this.settings.close_selectors, function (e) {
                Foundation.libs.clearing.close(e, this)
            }).on("keydown.fndtn.clearing", function (e) {
                n.keydown(e)
            }), r(t).off(".clearing").on("resize.fndtn.clearing", function () {
                n.resize()
            }), this.swipe_events(e)
        },
        swipe_events: function (e) {
            var t = this,
                n = t.S;
            n(this.scope).on("touchstart.fndtn.clearing", ".visible-img", function (e) {
                e.touches || (e = e.originalEvent);
                var t = {
                    start_page_x: e.touches[0].pageX,
                    start_page_y: e.touches[0].pageY,
                    start_time: (new Date).getTime(),
                    delta_x: 0,
                    is_scrolling: r
                };
                n(this).data("swipe-transition", t), e.stopPropagation()
            }).on("touchmove.fndtn.clearing", ".visible-img", function (e) {
                e.touches || (e = e.originalEvent);
                if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
                var r = n(this).data("swipe-transition");
                typeof r == "undefined" && (r = {}), r.delta_x = e.touches[0].pageX - r.start_page_x, typeof r.is_scrolling == "undefined" && (r.is_scrolling = !! (r.is_scrolling || Math.abs(r.delta_x) < Math.abs(e.touches[0].pageY - r.start_page_y)));
                if (!r.is_scrolling && !r.active) {
                    e.preventDefault();
                    var i = r.delta_x < 0 ? "next" : "prev";
                    r.active = !0, t.nav(e, i)
                }
            }).on("touchend.fndtn.clearing", ".visible-img", function (e) {
                n(this).data("swipe-transition", {}), e.stopPropagation()
            })
        },
        assemble: function (t) {
            var n = t.parent();
            if (n.parent().hasClass("carousel")) return;
            n.after('<div id="foundationClearingHolder"></div>');
            var r = this.S("#foundationClearingHolder"),
                i = n.data(this.attr_name(!0) + "-init"),
                s = n.detach(),
                o = {
                    grid: '<div class="carousel">' + s[0].outerHTML + "</div>",
                    viewing: i.templates.viewing
                }, u = '<div class="clearing-assembled"><div>' + o.viewing + o.grid + "</div></div>",
                a = this.settings.touch_label;
            Modernizr.touch && (u = e(u).find(".clearing-touch-label").html(a).end()), r.after(u).remove()
        },
        open: function (e, t, n) {
            var r = this,
                i = n.closest(".clearing-assembled"),
                s = r.S("div", i).first(),
                o = r.S(".visible-img", s),
                u = r.S("img", o).not(e),
                a = r.S(".clearing-touch-label", s);
            this.locked() || (u.attr("src", this.load(e)).css("visibility", "hidden"), this.image_loaded(u, function () {
                u.css("visibility", "visible"), i.addClass("clearing-blackout"), s.addClass("clearing-container"), o.show(), this.fix_height(n).caption(r.S(".clearing-caption", o), e).center_and_label(u, a).shift(t, n, function () {
                    n.siblings().removeClass("visible"), n.addClass("visible")
                })
            }.bind(this)))
        },
        close: function (t, n) {
            t.preventDefault();
            var r = function (e) {
                return /blackout/.test(e.selector) ? e : e.closest(".clearing-blackout")
            }(e(n)),
                i, s;
            return n === t.target && r && (i = e("div", r).first(), s = e(".visible-img", i), this.settings.prev_index = 0, e("ul[" + this.attr_name() + "]", r).attr("style", "").closest(".clearing-blackout").removeClass("clearing-blackout"), i.removeClass("clearing-container"), s.hide()), !1
        },
        is_open: function (e) {
            return e.parent().prop("style").length > 0
        },
        keydown: function (t) {
            var n = e("ul[" + this.attr_name() + "]", ".clearing-blackout"),
                r = this.rtl ? 37 : 39,
                i = this.rtl ? 39 : 37,
                s = 27;
            t.which === r && this.go(n, "next"), t.which === i && this.go(n, "prev"), t.which === s && this.S("a.clearing-close").trigger("click")
        },
        nav: function (t, n) {
            var r = e("ul[" + this.attr_name() + "]", ".clearing-blackout");
            t.preventDefault(), this.go(r, n)
        },
        resize: function () {
            var t = e("img", ".clearing-blackout .visible-img"),
                n = e(".clearing-touch-label", ".clearing-blackout");
            t.length && this.center_and_label(t, n)
        },
        fix_height: function (e) {
            var t = e.parent().children(),
                n = this;
            return t.each(function () {
                var e = n.S(this),
                    t = e.find("img");
                e.height() > t.outerHeight() && e.addClass("fix-height")
            }).closest("ul").width(t.length * 100 + "%"), this
        },
        update_paddles: function (e) {
            var t = e.closest(".carousel").siblings(".visible-img");
            e.next().length > 0 ? this.S(".clearing-main-next", t).removeClass("disabled") : this.S(".clearing-main-next", t).addClass("disabled"), e.prev().length > 0 ? this.S(".clearing-main-prev", t).removeClass("disabled") : this.S(".clearing-main-prev", t).addClass("disabled")
        },
        center_and_label: function (e, t) {
            return this.rtl ? (e.css({
                marginRight: -(e.outerWidth() / 2),
                marginTop: -(e.outerHeight() / 2),
                left: "auto",
                right: "50%"
            }), t.css({
                marginRight: -(t.outerWidth() / 2),
                marginTop: -(e.outerHeight() / 2) - t.outerHeight() - 10,
                left: "auto",
                right: "50%"
            })) : (e.css({
                marginLeft: -(e.outerWidth() / 2),
                marginTop: -(e.outerHeight() / 2)
            }), t.css({
                marginLeft: -(t.outerWidth() / 2),
                marginTop: -(e.outerHeight() / 2) - t.outerHeight() - 10
            })), this
        },
        load: function (e) {
            if (e[0].nodeName === "A") var t = e.attr("href");
            else var t = e.parent().attr("href");
            return this.preload(e), t ? t : e.attr("src")
        },
        preload: function (e) {
            this.img(e.closest("li").next()).img(e.closest("li").prev())
        },
        img: function (e) {
            if (e.length) {
                var t = new Image,
                    n = this.S("a", e);
                n.length ? t.src = n.attr("href") : t.src = this.S("img", e).attr("src")
            }
            return this
        },
        caption: function (e, t) {
            var n = t.data("caption");
            return n ? e.html(n).show() : e.text("").hide(), this
        },
        go: function (e, t) {
            var n = this.S(".visible", e),
                r = n[t]();
            r.length && this.S("img", r).trigger("click", [n, r])
        },
        shift: function (e, t, n) {
            var r = t.parent(),
                i = this.settings.prev_index || t.index(),
                s = this.direction(r, e, t),
                o = this.rtl ? "right" : "left",
                u = parseInt(r.css("left"), 10),
                a = t.outerWidth(),
                f, l = {};
            t.index() !== i && !/skip/.test(s) ? /left/.test(s) ? (this.lock(), l[o] = u + a, r.animate(l, 300, this.unlock())) : /right/.test(s) && (this.lock(), l[o] = u - a, r.animate(l, 300, this.unlock())) : /skip/.test(s) && (f = t.index() - this.settings.up_count, this.lock(), f > 0 ? (l[o] = -(f * a), r.animate(l, 300, this.unlock())) : (l[o] = 0, r.animate(l, 300, this.unlock()))), n()
        },
        direction: function (e, t, n) {
            var r = this.S("li", e),
                i = r.outerWidth() + r.outerWidth() / 4,
                s = Math.floor(this.S(".clearing-container").outerWidth() / i) - 1,
                o = r.index(n),
                u;
            return this.settings.up_count = s, this.adjacent(this.settings.prev_index, o) ? o > s && o > this.settings.prev_index ? u = "right" : o > s - 1 && o <= this.settings.prev_index ? u = "left" : u = !1 : u = "skip", this.settings.prev_index = o, u
        },
        adjacent: function (e, t) {
            for (var n = t + 1; n >= t - 1; n--)
                if (n === e) return !0;
            return !1
        },
        lock: function () {
            this.settings.locked = !0
        },
        unlock: function () {
            this.settings.locked = !1
        },
        locked: function () {
            return this.settings.locked
        },
        off: function () {
            this.S(this.scope).off(".fndtn.clearing"), this.S(t).off(".fndtn.clearing")
        },
        reflow: function () {
            this.init()
        }
    }
}(jQuery, this, this.document), ! function (e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : e(jQuery)
}(function (e) {
    function t(e) {
        return u.raw ? e : encodeURIComponent(e)
    }

    function n(e) {
        return u.raw ? e : decodeURIComponent(e)
    }

    function r(e) {
        return t(u.json ? JSON.stringify(e) : String(e))
    }

    function i(e) {
        0 === e.indexOf('"') && (e = e.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            e = decodeURIComponent(e.replace(o, " "))
        } catch (t) {
            return
        }
        try {
            return u.json ? JSON.parse(e) : e
        } catch (t) {}
    }

    function s(t, n) {
        var r = u.raw ? t : i(t);
        return e.isFunction(n) ? n(r) : r
    }
    var o = /\+/g,
        u = e.cookie = function (i, o, l) {
            if (void 0 !== o && !e.isFunction(o)) {
                if (l = e.extend({}, u.defaults, l), "number" == typeof l.expires) {
                    var p = l.expires,
                        v = l.expires = new Date;
                    v.setDate(v.getDate() + p)
                }
                return document.cookie = [t(i), "=", r(o), l.expires ? "; expires=" + l.expires.toUTCString() : "", l.path ? "; path=" + l.path : "", l.domain ? "; domain=" + l.domain : "", l.secure ? "; secure" : ""].join("")
            }
            for (var m = i ? void 0 : {}, g = document.cookie ? document.cookie.split("; ") : [], y = 0, w = g.length; w > y; y++) {
                var E = g[y].split("="),
                    S = n(E.shift()),
                    x = E.join("=");
                if (i && i === S) {
                    m = s(x, o);
                    break
                }
                i || void 0 === (x = s(x)) || (m[S] = x)
            }
            return m
        };
    u.defaults = {}, e.removeCookie = function (t, n) {
        return void 0 !== e.cookie(t) ? (e.cookie(t, "", e.extend({}, n, {
            expires: -1
        })), !0) : !1
    }
}),
function (e, t, n, r) {
    "use strict";
    var i = i || !1;
    Foundation.libs.joyride = {
        name: "joyride",
        version: "5.1.1",
        defaults: {
            expose: !1,
            modal: !0,
            tip_location: "bottom",
            nub_position: "auto",
            scroll_speed: 1500,
            scroll_animation: "linear",
            timer: 0,
            start_timer_on_click: !0,
            start_offset: 0,
            next_button: !0,
            tip_animation: "fade",
            pause_after: [],
            exposed: [],
            tip_animation_fade_speed: 300,
            cookie_monster: !1,
            cookie_name: "joyride",
            cookie_domain: !1,
            cookie_expires: 365,
            tip_container: "body",
            tip_location_patterns: {
                top: ["bottom"],
                bottom: [],
                left: ["right", "top", "bottom"],
                right: ["left", "top", "bottom"]
            },
            post_ride_callback: function () {},
            post_step_callback: function () {},
            pre_step_callback: function () {},
            pre_ride_callback: function () {},
            post_expose_callback: function () {},
            template: {
                link: '<a href="#close" class="joyride-close-tip">&times;</a>',
                timer: '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>',
                tip: '<div class="joyride-tip-guide"><span class="joyride-nub"></span></div>',
                wrapper: '<div class="joyride-content-wrapper"></div>',
                button: '<a href="#" class="small button joyride-next-tip"></a>',
                modal: '<div class="joyride-modal-bg"></div>',
                expose: '<div class="joyride-expose-wrapper"></div>',
                expose_cover: '<div class="joyride-expose-cover"></div>'
            },
            expose_add_class: ""
        },
        init: function (e, t, n) {
            Foundation.inherit(this, "throttle random_str"), this.settings = this.defaults, this.bindings(t, n)
        },
        events: function () {
            var n = this;
            e(this.scope).off(".joyride").on("click.fndtn.joyride", ".joyride-next-tip, .joyride-modal-bg", function (e) {
                e.preventDefault(), this.settings.$li.next().length < 1 ? this.end() : this.settings.timer > 0 ? (clearTimeout(this.settings.automate), this.hide(), this.show(), this.startTimer()) : (this.hide(), this.show())
            }.bind(this)).on("click.fndtn.joyride", ".joyride-close-tip", function (e) {
                e.preventDefault(), this.end()
            }.bind(this)), e(t).off(".joyride").on("resize.fndtn.joyride", n.throttle(function () {
                if (e("[" + n.attr_name() + "]").length > 0 && n.settings.$next_tip) {
                    if (n.settings.exposed.length > 0) {
                        var t = e(n.settings.exposed);
                        t.each(function () {
                            var t = e(this);
                            n.un_expose(t), n.expose(t)
                        })
                    }
                    n.is_phone() ? n.pos_phone() : n.pos_default(!1, !0)
                }
            }, 100))
        },
        start: function () {
            var t = this,
                n = e("[" + this.attr_name() + "]", this.scope),
                r = ["timer", "scrollSpeed", "startOffset", "tipAnimationFadeSpeed", "cookieExpires"],
                i = r.length;
            if (!n.length > 0) return;
            this.settings.init || this.events(), this.settings = n.data(this.attr_name(!0) + "-init"), this.settings.$content_el = n, this.settings.$body = e(this.settings.tip_container), this.settings.body_offset = e(this.settings.tip_container).position(), this.settings.$tip_content = this.settings.$content_el.find("> li"), this.settings.paused = !1, this.settings.attempts = 0, typeof e.cookie != "function" && (this.settings.cookie_monster = !1);
            if (!this.settings.cookie_monster || this.settings.cookie_monster && !e.cookie(this.settings.cookie_name)) this.settings.$tip_content.each(function (n) {
                var s = e(this);
                this.settings = e.extend({}, t.defaults, t.data_options(s));
                var o = i;
                while (o--) t.settings[r[o]] = parseInt(t.settings[r[o]], 10);
                t.create({
                    $li: s,
                    index: n
                })
            }), !this.settings.start_timer_on_click && this.settings.timer > 0 ? (this.show("init"), this.startTimer()) : this.show("init")
        },
        resume: function () {
            this.set_li(), this.show()
        },
        tip_template: function (t) {
            var n, r;
            return t.tip_class = t.tip_class || "", n = e(this.settings.template.tip).addClass(t.tip_class), r = e.trim(e(t.li).html()) + this.button_text(t.button_text) + this.settings.template.link + this.timer_instance(t.index), n.append(e(this.settings.template.wrapper)), n.first().attr(this.add_namespace("data-index"), t.index), e(".joyride-content-wrapper", n).append(r), n[0]
        },
        timer_instance: function (t) {
            var n;
            return t === 0 && this.settings.start_timer_on_click && this.settings.timer > 0 || this.settings.timer === 0 ? n = "" : n = e(this.settings.template.timer)[0].outerHTML, n
        },
        button_text: function (t) {
            return this.settings.next_button ? (t = e.trim(t) || "Next", t = e(this.settings.template.button).append(t)[0].outerHTML) : t = "", t
        },
        create: function (t) {
            console.log(t.$li);
            var n = t.$li.attr(this.add_namespace("data-button")) || t.$li.attr(this.add_namespace("data-text")),
                r = t.$li.attr("class"),
                i = e(this.tip_template({
                    tip_class: r,
                    index: t.index,
                    button_text: n,
                    li: t.$li
                }));
            e(this.settings.tip_container).append(i)
        },
        show: function (t) {
            var n = null;
            this.settings.$li === r || e.inArray(this.settings.$li.index(), this.settings.pause_after) === -1 ? (this.settings.paused ? this.settings.paused = !1 : this.set_li(t), this.settings.attempts = 0, this.settings.$li.length && this.settings.$target.length > 0 ? (t && (this.settings.pre_ride_callback(this.settings.$li.index(), this.settings.$next_tip), this.settings.modal && this.show_modal()), this.settings.pre_step_callback(this.settings.$li.index(), this.settings.$next_tip), this.settings.modal && this.settings.expose && this.expose(), this.settings.tip_settings = e.extend({}, this.settings, this.data_options(this.settings.$li)), this.settings.timer = parseInt(this.settings.timer, 10), this.settings.tip_settings.tip_location_pattern = this.settings.tip_location_patterns[this.settings.tip_settings.tip_location], /body/i.test(this.settings.$target.selector) || this.scroll_to(), this.is_phone() ? this.pos_phone(!0) : this.pos_default(!0), n = this.settings.$next_tip.find(".joyride-timer-indicator"), /pop/i.test(this.settings.tip_animation) ? (n.width(0), this.settings.timer > 0 ? (this.settings.$next_tip.show(), setTimeout(function () {
                n.animate({
                    width: n.parent().width()
                }, this.settings.timer, "linear")
            }.bind(this), this.settings.tip_animation_fade_speed)) : this.settings.$next_tip.show()) : /fade/i.test(this.settings.tip_animation) && (n.width(0), this.settings.timer > 0 ? (this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed).show(), setTimeout(function () {
                n.animate({
                    width: n.parent().width()
                }, this.settings.timer, "linear")
            }.bind(this), this.settings.tip_animation_fadeSpeed)) : this.settings.$next_tip.fadeIn(this.settings.tip_animation_fade_speed)), this.settings.$current_tip = this.settings.$next_tip) : this.settings.$li && this.settings.$target.length < 1 ? this.show() : this.end()) : this.settings.paused = !0
        },
        is_phone: function () {
            return matchMedia(Foundation.media_queries.small).matches && !matchMedia(Foundation.media_queries.medium).matches
        },
        hide: function () {
            this.settings.modal && this.settings.expose && this.un_expose(), this.settings.modal || e(".joyride-modal-bg").hide(), this.settings.$current_tip.css("visibility", "hidden"), setTimeout(e.proxy(function () {
                this.hide(), this.css("visibility", "visible")
            }, this.settings.$current_tip), 0), this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip)
        },
        set_li: function (e) {
            e ? (this.settings.$li = this.settings.$tip_content.eq(this.settings.start_offset), this.set_next_tip(), this.settings.$current_tip = this.settings.$next_tip) : (this.settings.$li = this.settings.$li.next(), this.set_next_tip()), this.set_target()
        },
        set_next_tip: function () {
            this.settings.$next_tip = e(".joyride-tip-guide").eq(this.settings.$li.index()), this.settings.$next_tip.data("closed", "")
        },
        set_target: function () {
            console.log(this.add_namespace("data-class"));
            var t = this.settings.$li.attr(this.add_namespace("data-class")),
                r = this.settings.$li.attr(this.add_namespace("data-id")),
                i = function () {
                    return r ? e(n.getElementById(r)) : t ? e("." + t).first() : e("body")
                };
            console.log(t, r), this.settings.$target = i()
        },
        scroll_to: function () {
            var n, r;
            n = e(t).height() / 2, r = Math.ceil(this.settings.$target.offset().top - n + this.settings.$next_tip.outerHeight()), r != 0 && e("html, body").animate({
                scrollTop: r
            }, this.settings.scroll_speed, "swing")
        },
        paused: function () {
            return e.inArray(this.settings.$li.index() + 1, this.settings.pause_after) === -1
        },
        restart: function () {
            this.hide(), this.settings.$li = r, this.show("init")
        },
        pos_default: function (n, r) {
            var i = Math.ceil(e(t).height() / 2),
                s = this.settings.$next_tip.offset(),
                o = this.settings.$next_tip.find(".joyride-nub"),
                u = Math.ceil(o.outerWidth() / 2),
                a = Math.ceil(o.outerHeight() / 2),
                f = n || !1;
            f && (this.settings.$next_tip.css("visibility", "hidden"), this.settings.$next_tip.show()), typeof r == "undefined" && (r = !1), /body/i.test(this.settings.$target.selector) ? this.settings.$li.length && this.pos_modal(o) : (this.bottom() ? (this.rtl ? this.settings.$next_tip.css({
                top: this.settings.$target.offset().top + a + this.settings.$target.outerHeight(),
                left: this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth()
            }) : this.settings.$next_tip.css({
                top: this.settings.$target.offset().top + a + this.settings.$target.outerHeight(),
                left: this.settings.$target.offset().left
            }), this.nub_position(o, this.settings.tip_settings.nub_position, "top")) : this.top() ? (this.rtl ? this.settings.$next_tip.css({
                top: this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - a,
                left: this.settings.$target.offset().left + this.settings.$target.outerWidth() - this.settings.$next_tip.outerWidth()
            }) : this.settings.$next_tip.css({
                top: this.settings.$target.offset().top - this.settings.$next_tip.outerHeight() - a,
                left: this.settings.$target.offset().left
            }), this.nub_position(o, this.settings.tip_settings.nub_position, "bottom")) : this.right() ? (this.settings.$next_tip.css({
                top: this.settings.$target.offset().top,
                left: this.outerWidth(this.settings.$target) + this.settings.$target.offset().left + u
            }), this.nub_position(o, this.settings.tip_settings.nub_position, "left")) : this.left() && (this.settings.$next_tip.css({
                top: this.settings.$target.offset().top,
                left: this.settings.$target.offset().left - this.outerWidth(this.settings.$next_tip) - u
            }), this.nub_position(o, this.settings.tip_settings.nub_position, "right")), !this.visible(this.corners(this.settings.$next_tip)) && this.settings.attempts < this.settings.tip_settings.tip_location_pattern.length && (o.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"), this.settings.tip_settings.tip_location = this.settings.tip_settings.tip_location_pattern[this.settings.attempts], this.settings.attempts++, this.pos_default())), f && (this.settings.$next_tip.hide(), this.settings.$next_tip.css("visibility", "visible"))
        },
        pos_phone: function (t) {
            var n = this.settings.$next_tip.outerHeight(),
                r = this.settings.$next_tip.offset(),
                i = this.settings.$target.outerHeight(),
                s = e(".joyride-nub", this.settings.$next_tip),
                o = Math.ceil(s.outerHeight() / 2),
                u = t || !1;
            s.removeClass("bottom").removeClass("top").removeClass("right").removeClass("left"), u && (this.settings.$next_tip.css("visibility", "hidden"), this.settings.$next_tip.show()), /body/i.test(this.settings.$target.selector) ? this.settings.$li.length && this.pos_modal(s) : this.top() ? (this.settings.$next_tip.offset({
                top: this.settings.$target.offset().top - n - o
            }), s.addClass("bottom")) : (this.settings.$next_tip.offset({
                top: this.settings.$target.offset().top + i + o
            }), s.addClass("top")), u && (this.settings.$next_tip.hide(), this.settings.$next_tip.css("visibility", "visible"))
        },
        pos_modal: function (e) {
            this.center(), e.hide(), this.show_modal()
        },
        show_modal: function () {
            if (!this.settings.$next_tip.data("closed")) {
                var t = e(".joyride-modal-bg");
                t.length < 1 && e("body").append(this.settings.template.modal).show(), /pop/i.test(this.settings.tip_animation) ? t.show() : t.fadeIn(this.settings.tip_animation_fade_speed)
            }
        },
        expose: function () {
            var n, r, i, s, o, u = "expose-" + this.random_str(6);
            if (arguments.length > 0 && arguments[0] instanceof e) i = arguments[0];
            else {
                if (!this.settings.$target || !! /body/i.test(this.settings.$target.selector)) return !1;
                i = this.settings.$target
            } if (i.length < 1) return t.console && console.error("element not valid", i), !1;
            n = e(this.settings.template.expose), this.settings.$body.append(n), n.css({
                top: i.offset().top,
                left: i.offset().left,
                width: i.outerWidth(!0),
                height: i.outerHeight(!0)
            }), r = e(this.settings.template.expose_cover), s = {
                zIndex: i.css("z-index"),
                position: i.css("position")
            }, o = i.attr("class") == null ? "" : i.attr("class"), i.css("z-index", parseInt(n.css("z-index")) + 1), s.position == "static" && i.css("position", "relative"), i.data("expose-css", s), i.data("orig-class", o), i.attr("class", o + " " + this.settings.expose_add_class), r.css({
                top: i.offset().top,
                left: i.offset().left,
                width: i.outerWidth(!0),
                height: i.outerHeight(!0)
            }), this.settings.modal && this.show_modal(), this.settings.$body.append(r), n.addClass(u), r.addClass(u), i.data("expose", u), this.settings.post_expose_callback(this.settings.$li.index(), this.settings.$next_tip, i), this.add_exposed(i)
        },
        un_expose: function () {
            var n, r, i, s, o, u = !1;
            if (arguments.length > 0 && arguments[0] instanceof e) r = arguments[0];
            else {
                if (!this.settings.$target || !! /body/i.test(this.settings.$target.selector)) return !1;
                r = this.settings.$target
            } if (r.length < 1) return t.console && console.error("element not valid", r), !1;
            n = r.data("expose"), i = e("." + n), arguments.length > 1 && (u = arguments[1]), u === !0 ? e(".joyride-expose-wrapper,.joyride-expose-cover").remove() : i.remove(), s = r.data("expose-css"), s.zIndex == "auto" ? r.css("z-index", "") : r.css("z-index", s.zIndex), s.position != r.css("position") && (s.position == "static" ? r.css("position", "") : r.css("position", s.position)), o = r.data("orig-class"), r.attr("class", o), r.removeData("orig-classes"), r.removeData("expose"), r.removeData("expose-z-index"), this.remove_exposed(r)
        },
        add_exposed: function (t) {
            this.settings.exposed = this.settings.exposed || [], t instanceof e || typeof t == "object" ? this.settings.exposed.push(t[0]) : typeof t == "string" && this.settings.exposed.push(t)
        },
        remove_exposed: function (t) {
            var n, r;
            t instanceof e ? n = t[0] : typeof t == "string" && (n = t), this.settings.exposed = this.settings.exposed || [], r = this.settings.exposed.length;
            while (r--)
                if (this.settings.exposed[r] == n) {
                    this.settings.exposed.splice(r, 1);
                    return
                }
        },
        center: function () {
            var n = e(t);
            return this.settings.$next_tip.css({
                top: (n.height() - this.settings.$next_tip.outerHeight()) / 2 + n.scrollTop(),
                left: (n.width() - this.settings.$next_tip.outerWidth()) / 2 + n.scrollLeft()
            }), !0
        },
        bottom: function () {
            return /bottom/i.test(this.settings.tip_settings.tip_location)
        },
        top: function () {
            return /top/i.test(this.settings.tip_settings.tip_location)
        },
        right: function () {
            return /right/i.test(this.settings.tip_settings.tip_location)
        },
        left: function () {
            return /left/i.test(this.settings.tip_settings.tip_location)
        },
        corners: function (n) {
            var r = e(t),
                i = r.height() / 2,
                s = Math.ceil(this.settings.$target.offset().top - i + this.settings.$next_tip.outerHeight()),
                o = r.width() + r.scrollLeft(),
                u = r.height() + s,
                a = r.height() + r.scrollTop(),
                f = r.scrollTop();
            return s < f && (s < 0 ? f = 0 : f = s), u > a && (a = u), [n.offset().top < f, o < n.offset().left + n.outerWidth(), a < n.offset().top + n.outerHeight(), r.scrollLeft() > n.offset().left]
        },
        visible: function (e) {
            var t = e.length;
            while (t--)
                if (e[t]) return !1;
            return !0
        },
        nub_position: function (e, t, n) {
            t === "auto" ? e.addClass(n) : e.addClass(t)
        },
        startTimer: function () {
            this.settings.$li.length ? this.settings.automate = setTimeout(function () {
                this.hide(), this.show(), this.startTimer()
            }.bind(this), this.settings.timer) : clearTimeout(this.settings.automate)
        },
        end: function () {
            this.settings.cookie_monster && e.cookie(this.settings.cookie_name, "ridden", {
                expires: this.settings.cookie_expires,
                domain: this.settings.cookie_domain
            }), this.settings.timer > 0 && clearTimeout(this.settings.automate), this.settings.modal && this.settings.expose && this.un_expose(), this.settings.$next_tip.data("closed", !0), e(".joyride-modal-bg").hide(), this.settings.$current_tip.hide(), this.settings.post_step_callback(this.settings.$li.index(), this.settings.$current_tip), this.settings.post_ride_callback(this.settings.$li.index(), this.settings.$current_tip), e(".joyride-tip-guide").remove()
        },
        off: function () {
            e(this.scope).off(".joyride"), e(t).off(".joyride"), e(".joyride-close-tip, .joyride-next-tip, .joyride-modal-bg").off(".joyride"), e(".joyride-tip-guide, .joyride-modal-bg").remove(), clearTimeout(this.settings.automate), this.settings = {}
        },
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    var i = function () {}, s = function (i, s) {
            if (i.hasClass(s.slides_container_class)) return this;
            var f = this,
                l, c = i,
                h, p, d, v = 0,
                m, g, y = !1,
                b = !1;
            f.slides = function () {
                return c.children(s.slide_selector)
            }, f.slides().first().addClass(s.active_slide_class), f.update_slide_number = function (t) {
                s.slide_number && (h.find("span:first").text(parseInt(t) + 1), h.find("span:last").text(f.slides().length)), s.bullets && (p.children().removeClass(s.bullets_active_class), e(p.children().get(t)).addClass(s.bullets_active_class))
            }, f.update_active_link = function (t) {
                var n = e('a[data-orbit-link="' + f.slides().eq(t).attr("data-orbit-slide") + '"]');
                n.siblings().removeClass(s.bullets_active_class), n.addClass(s.bullets_active_class)
            }, f.build_markup = function () {
                c.wrap('<div class="' + s.container_class + '"></div>'), l = c.parent(), c.addClass(s.slides_container_class), s.navigation_arrows && (l.append(e('<a href="#"><span></span></a>').addClass(s.prev_class)), l.append(e('<a href="#"><span></span></a>').addClass(s.next_class))), s.timer && (d = e("<div>").addClass(s.timer_container_class), d.append("<span>"), d.append(e("<div>").addClass(s.timer_progress_class)), d.addClass(s.timer_paused_class), l.append(d)), s.slide_number && (h = e("<div>").addClass(s.slide_number_class), h.append("<span></span> " + s.slide_number_text + " <span></span>"), l.append(h)), s.bullets && (p = e("<ol>").addClass(s.bullets_container_class), l.append(p), p.wrap('<div class="orbit-bullets-container"></div>'), f.slides().each(function (t, n) {
                    var r = e("<li>").attr("data-orbit-slide", t);
                    p.append(r)
                })), s.stack_on_small && l.addClass(s.stack_on_small_class)
            }, f._goto = function (t, n) {
                if (t === v) return !1;
                typeof g == "object" && g.restart();
                var r = f.slides(),
                    i = "next";
                y = !0, t < v && (i = "prev");
                if (t >= r.length) {
                    if (!s.circular) return !1;
                    t = 0
                } else if (t < 0) {
                    if (!s.circular) return !1;
                    t = r.length - 1
                }
                var o = e(r.get(v)),
                    u = e(r.get(t));
                o.css("zIndex", 2), o.removeClass(s.active_slide_class), u.css("zIndex", 4).addClass(s.active_slide_class), c.trigger("before-slide-change.fndtn.orbit"), s.before_slide_change(), f.update_active_link(t);
                var a = function () {
                    var e = function () {
                        v = t, y = !1, n === !0 && (g = f.create_timer(), g.start()), f.update_slide_number(v), c.trigger("after-slide-change.fndtn.orbit", [{
                            slide_number: v,
                            total_slides: r.length
                        }]), s.after_slide_change(v, r.length)
                    };
                    c.height() != u.height() && s.variable_height ? c.animate({
                        height: u.height()
                    }, 250, "linear", e) : e()
                };
                if (r.length === 1) return a(), !1;
                var l = function () {
                    i === "next" && m.next(o, u, a), i === "prev" && m.prev(o, u, a)
                };
                u.height() > c.height() && s.variable_height ? c.animate({
                    height: u.height()
                }, 250, "linear", l) : l()
            }, f.next = function (e) {
                e.stopImmediatePropagation(), e.preventDefault(), f._goto(v + 1)
            }, f.prev = function (e) {
                e.stopImmediatePropagation(), e.preventDefault(), f._goto(v - 1)
            }, f.link_custom = function (t) {
                t.preventDefault();
                var n = e(this).attr("data-orbit-link");
                if (typeof n == "string" && (n = e.trim(n)) != "") {
                    var r = l.find("[data-orbit-slide=" + n + "]");
                    r.index() != -1 && f._goto(r.index())
                }
            }, f.link_bullet = function (t) {
                var n = e(this).attr("data-orbit-slide");
                if (typeof n == "string" && (n = e.trim(n)) != "")
                    if (isNaN(parseInt(n))) {
                        var r = l.find("[data-orbit-slide=" + n + "]");
                        r.index() != -1 && f._goto(r.index() + 1)
                    } else f._goto(parseInt(n))
            }, f.timer_callback = function () {
                f._goto(v + 1, !0)
            }, f.compute_dimensions = function () {
                var t = e(f.slides().get(v)),
                    n = t.height();
                s.variable_height || f.slides().each(function () {
                    e(this).height() > n && (n = e(this).height())
                }), c.height(n)
            }, f.create_timer = function () {
                var e = new o(l.find("." + s.timer_container_class), s, f.timer_callback);
                return e
            }, f.stop_timer = function () {
                typeof g == "object" && g.stop()
            }, f.toggle_timer = function () {
                var e = l.find("." + s.timer_container_class);
                e.hasClass(s.timer_paused_class) ? (typeof g == "undefined" && (g = f.create_timer()), g.start()) : typeof g == "object" && g.stop()
            }, f.init = function () {
                f.build_markup(), s.timer && (g = f.create_timer(), Foundation.utils.image_loaded(this.slides().children("img"), g.start)), m = new a(s, c), s.animation === "slide" && (m = new u(s, c)), l.on("click", "." + s.next_class, f.next), l.on("click", "." + s.prev_class, f.prev), l.on("click", "[data-orbit-slide]", f.link_bullet), l.on("click", f.toggle_timer), s.swipe && l.on("touchstart.fndtn.orbit", function (e) {
                    e.touches || (e = e.originalEvent);
                    var t = {
                        start_page_x: e.touches[0].pageX,
                        start_page_y: e.touches[0].pageY,
                        start_time: (new Date).getTime(),
                        delta_x: 0,
                        is_scrolling: r
                    };
                    l.data("swipe-transition", t), e.stopPropagation()
                }).on("touchmove.fndtn.orbit", function (e) {
                    e.touches || (e = e.originalEvent);
                    if (e.touches.length > 1 || e.scale && e.scale !== 1) return;
                    var t = l.data("swipe-transition");
                    typeof t == "undefined" && (t = {}), t.delta_x = e.touches[0].pageX - t.start_page_x, typeof t.is_scrolling == "undefined" && (t.is_scrolling = !! (t.is_scrolling || Math.abs(t.delta_x) < Math.abs(e.touches[0].pageY - t.start_page_y)));
                    if (!t.is_scrolling && !t.active) {
                        e.preventDefault();
                        var n = t.delta_x < 0 ? v + 1 : v - 1;
                        t.active = !0, f._goto(n)
                    }
                }).on("touchend.fndtn.orbit", function (e) {
                    l.data("swipe-transition", {}), e.stopPropagation()
                }), l.on("mouseenter.fndtn.orbit", function (e) {
                    s.timer && s.pause_on_hover && f.stop_timer()
                }).on("mouseleave.fndtn.orbit", function (e) {
                    s.timer && s.resume_on_mouseout && g.start()
                }), e(n).on("click", "[data-orbit-link]", f.link_custom), e(t).on("resize", f.compute_dimensions), Foundation.utils.image_loaded(this.slides().children("img"), f.compute_dimensions), Foundation.utils.image_loaded(this.slides().children("img"), function () {
                    l.prev(".preloader").css("display", "none"), f.update_slide_number(0), f.update_active_link(0), c.trigger("ready.fndtn.orbit")
                })
            }, f.init()
        }, o = function (e, t, n) {
            var r = this,
                i = t.timer_speed,
                s = e.find("." + t.timer_progress_class),
                o, u, a = -1;
            this.update_progress = function (e) {
                var t = s.clone();
                t.attr("style", ""), t.css("width", e + "%"), s.replaceWith(t), s = t
            }, this.restart = function () {
                clearTimeout(u), e.addClass(t.timer_paused_class), a = -1, r.update_progress(0)
            }, this.start = function () {
                if (!e.hasClass(t.timer_paused_class)) return !0;
                a = a === -1 ? i : a, e.removeClass(t.timer_paused_class), o = (new Date).getTime(), s.animate({
                    width: "100%"
                }, a, "linear"), u = setTimeout(function () {
                    r.restart(), n()
                }, a), e.trigger("timer-started.fndtn.orbit")
            }, this.stop = function () {
                if (e.hasClass(t.timer_paused_class)) return !0;
                clearTimeout(u), e.addClass(t.timer_paused_class);
                var n = (new Date).getTime();
                a -= n - o;
                var s = 100 - a / i * 100;
                r.update_progress(s), e.trigger("timer-stopped.fndtn.orbit")
            }
        }, u = function (t, n) {
            var r = t.animation_speed,
                i = e("html[dir=rtl]").length === 1,
                s = i ? "marginRight" : "marginLeft",
                o = {};
            o[s] = "0%", this.next = function (e, t, n) {
                e.animate({
                    marginLeft: "-100%"
                }, r), t.animate(o, r, function () {
                    e.css(s, "100%"), n()
                })
            }, this.prev = function (e, t, n) {
                e.animate({
                    marginLeft: "100%"
                }, r), t.css(s, "-100%"), t.animate(o, r, function () {
                    e.css(s, "100%"), n()
                })
            }
        }, a = function (t, n) {
            var r = t.animation_speed,
                i = e("html[dir=rtl]").length === 1,
                s = i ? "marginRight" : "marginLeft";
            this.next = function (e, t, n) {
                t.css({
                    margin: "0%",
                    opacity: "0.01"
                }), t.animate({
                    opacity: "1"
                }, r, "linear", function () {
                    e.css("margin", "100%"), n()
                })
            }, this.prev = function (e, t, n) {
                t.css({
                    margin: "0%",
                    opacity: "0.01"
                }), t.animate({
                    opacity: "1"
                }, r, "linear", function () {
                    e.css("margin", "100%"), n()
                })
            }
        };
    Foundation.libs = Foundation.libs || {}, Foundation.libs.orbit = {
        name: "orbit",
        version: "5.1.1",
        settings: {
            animation: "slide",
            timer_speed: 1e4,
            pause_on_hover: !0,
            resume_on_mouseout: !1,
            animation_speed: 500,
            stack_on_small: !1,
            navigation_arrows: !0,
            slide_number: !0,
            slide_number_text: "of",
            container_class: "orbit-container",
            stack_on_small_class: "orbit-stack-on-small",
            next_class: "orbit-next",
            prev_class: "orbit-prev",
            timer_container_class: "orbit-timer",
            timer_paused_class: "paused",
            timer_progress_class: "orbit-progress",
            slides_container_class: "orbit-slides-container",
            slide_selector: "*",
            bullets_container_class: "orbit-bullets",
            bullets_active_class: "active",
            slide_number_class: "orbit-slide-number",
            caption_class: "orbit-caption",
            active_slide_class: "active",
            orbit_transition_class: "orbit-transitioning",
            bullets: !0,
            circular: !0,
            timer: !0,
            variable_height: !1,
            swipe: !0,
            before_slide_change: i,
            after_slide_change: i
        },
        init: function (e, t, n) {
            var r = this;
            this.bindings(t, n)
        },
        events: function (e) {
            var t = new s(this.S(e), this.S(e).data("orbit-init"));
            this.S(e).data(self.name + "-instance", t)
        },
        reflow: function () {
            var e = this;
            if (e.S(e.scope).is("[data-orbit]")) {
                var t = e.S(e.scope),
                    n = t.data(e.name + "-instance");
                n.compute_dimensions()
            } else e.S("[data-orbit]", e.scope).each(function (t, n) {
                var r = e.S(n),
                    i = e.data_options(r),
                    s = r.data(e.name + "-instance");
                s.compute_dimensions()
            })
        }
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.topbar = {
        name: "topbar",
        version: "5.1.1",
        settings: {
            index: 0,
            sticky_class: "sticky",
            custom_back_text: !0,
            back_text: "Back",
            is_hover: !0,
            mobile_show_parent_link: !1,
            scrolltop: !0
        },
        init: function (t, n, r) {
            Foundation.inherit(this, "add_custom_rule register_media throttle");
            var i = this;
            i.register_media("topbar", "foundation-mq-topbar"), this.bindings(n, r), i.S("[" + this.attr_name() + "]", this.scope).each(function () {
                var t = i.S(this),
                    n = t.data(i.attr_name(!0) + "-init"),
                    r = i.S("section", this),
                    s = e("> ul", this).first();
                t.data("index", 0);
                var o = t.parent();
                o.hasClass("fixed") || o.hasClass(n.sticky_class) ? (i.settings.sticky_class = n.sticky_class, i.settings.sticky_topbar = t, t.data("height", o.outerHeight()), t.data("stickyoffset", o.offset().top)) : t.data("height", t.outerHeight()), n.assembled || i.assemble(t), n.is_hover ? i.S(".has-dropdown", t).addClass("not-click") : i.S(".has-dropdown", t).removeClass("not-click"), i.add_custom_rule(".f-topbar-fixed { padding-top: " + t.data("height") + "px }"), o.hasClass("fixed") && i.S("body").addClass("f-topbar-fixed")
            })
        },
        toggle: function (n) {
            var r = this;
            if (n) var i = r.S(n).closest("[" + this.attr_name() + "]");
            else var i = r.S("[" + this.attr_name() + "]");
            var s = i.data(this.attr_name(!0) + "-init"),
                o = r.S("section, .section", i);
            r.breakpoint() && (r.rtl ? (o.css({
                right: "0%"
            }), e(">.name", o).css({
                right: "100%"
            })) : (o.css({
                left: "0%"
            }), e(">.name", o).css({
                left: "100%"
            })), r.S("li.moved", o).removeClass("moved"), i.data("index", 0), i.toggleClass("expanded").css("height", "")), s.scrolltop ? i.hasClass("expanded") ? i.parent().hasClass("fixed") && (s.scrolltop ? (i.parent().removeClass("fixed"), i.addClass("fixed"), r.S("body").removeClass("f-topbar-fixed"), t.scrollTo(0, 0)) : i.parent().removeClass("expanded")) : i.hasClass("fixed") && (i.parent().addClass("fixed"), i.removeClass("fixed"), r.S("body").addClass("f-topbar-fixed")) : (i.parent().hasClass(r.settings.sticky_class) && i.parent().addClass("fixed"), i.parent().hasClass("fixed") && (i.hasClass("expanded") ? (i.addClass("fixed"), i.parent().addClass("expanded"), r.S("body").addClass("f-topbar-fixed")) : (i.removeClass("fixed"), i.parent().removeClass("expanded"), r.update_sticky_positioning())))
        },
        timer: null,
        events: function (e) {
            var n = this,
                r = this.S;
            r(this.scope).off(".topbar").on("click.fndtn.topbar", "[" + this.attr_name() + "] .toggle-topbar", function (e) {
                e.preventDefault(), n.toggle(this)
            }).on("click.fndtn.topbar", "[" + this.attr_name() + "] li.has-dropdown", function (e) {
                var t = r(this),
                    i = r(e.target),
                    s = t.closest("[" + n.attr_name() + "]"),
                    o = s.data(n.attr_name(!0) + "-init");
                if (i.data("revealId")) {
                    n.toggle();
                    return
                }
                if (n.breakpoint()) return;
                if (o.is_hover && !Modernizr.touch) return;
                e.stopImmediatePropagation(), t.hasClass("hover") ? (t.removeClass("hover").find("li").removeClass("hover"), t.parents("li.hover").removeClass("hover")) : (t.addClass("hover"), i[0].nodeName === "A" && i.parent().hasClass("has-dropdown") && e.preventDefault())
            }).on("click.fndtn.topbar", "[" + this.attr_name() + "] .has-dropdown>a", function (e) {
                if (n.breakpoint()) {
                    e.preventDefault();
                    var t = r(this),
                        i = t.closest("[" + n.attr_name() + "]"),
                        s = i.find("section, .section"),
                        o = t.next(".dropdown").outerHeight(),
                        u = t.closest("li");
                    i.data("index", i.data("index") + 1), u.addClass("moved"), n.rtl ? (s.css({
                        right: -(100 * i.data("index")) + "%"
                    }), s.find(">.name").css({
                        right: 100 * i.data("index") + "%"
                    })) : (s.css({
                        left: -(100 * i.data("index")) + "%"
                    }), s.find(">.name").css({
                        left: 100 * i.data("index") + "%"
                    })), i.css("height", t.siblings("ul").outerHeight(!0) + i.data("height"))
                }
            }), r(t).off(".topbar").on("resize.fndtn.topbar", n.throttle(function () {
                n.resize.call(n)
            }, 50)).trigger("resize"), r("body").off(".topbar").on("click.fndtn.topbar touchstart.fndtn.topbar", function (e) {
                var t = r(e.target).closest("li").closest("li.hover");
                if (t.length > 0) return;
                r("[" + n.attr_name() + "] li").removeClass("hover")
            }), r(this.scope).on("click.fndtn.topbar", "[" + this.attr_name() + "] .has-dropdown .back", function (e) {
                e.preventDefault();
                var t = r(this),
                    i = t.closest("[" + n.attr_name() + "]"),
                    s = i.find("section, .section"),
                    o = i.data(n.attr_name(!0) + "-init"),
                    u = t.closest("li.moved"),
                    a = u.parent();
                i.data("index", i.data("index") - 1), n.rtl ? (s.css({
                    right: -(100 * i.data("index")) + "%"
                }), s.find(">.name").css({
                    right: 100 * i.data("index") + "%"
                })) : (s.css({
                    left: -(100 * i.data("index")) + "%"
                }), s.find(">.name").css({
                    left: 100 * i.data("index") + "%"
                })), i.data("index") === 0 ? i.css("height", "") : i.css("height", a.outerHeight(!0) + i.data("height")), setTimeout(function () {
                    u.removeClass("moved")
                }, 300)
            })
        },
        resize: function () {
            var e = this;
            e.S("[" + this.attr_name() + "]").each(function () {
                var t = e.S(this),
                    r = t.data(e.attr_name(!0) + "-init"),
                    i = t.parent("." + e.settings.sticky_class),
                    s;
                if (!e.breakpoint()) {
                    var o = t.hasClass("expanded");
                    t.css("height", "").removeClass("expanded").find("li").removeClass("hover"), o && e.toggle(t)
                }
                i.length > 0 && (i.hasClass("fixed") ? (i.removeClass("fixed"), s = i.offset().top, e.S(n.body).hasClass("f-topbar-fixed") && (s -= t.data("height")), t.data("stickyoffset", s), i.addClass("fixed")) : (s = i.offset().top, t.data("stickyoffset", s)))
            })
        },
        breakpoint: function () {
            return !matchMedia(Foundation.media_queries.topbar).matches
        },
        assemble: function (t) {
            var n = this,
                r = t.data(this.attr_name(!0) + "-init"),
                i = n.S("section", t),
                s = e("> ul", t).first();
            i.detach(), n.S(".has-dropdown>a", i).each(function () {
                var t = n.S(this),
                    i = t.siblings(".dropdown"),
                    s = t.attr("href");
                if (!i.find(".title.back").length) {
                    if (r.mobile_show_parent_link && s && s.length > 1) var o = e('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5></li><li><a class="parent-link js-generated" href="' + s + '">' + t.text() + "</a></li>");
                    else var o = e('<li class="title back js-generated"><h5><a href="javascript:void(0)"></a></h5></li>');
                    r.custom_back_text == 1 ? e("h5>a", o).html(r.back_text) : e("h5>a", o).html("&laquo; " + t.html()), i.prepend(o)
                }
            }), i.appendTo(t), this.sticky(), this.assembled(t)
        },
        assembled: function (t) {
            t.data(this.attr_name(!0), e.extend({}, t.data(this.attr_name(!0)), {
                assembled: !0
            }))
        },
        height: function (t) {
            var n = 0,
                r = this;
            return e("> li", t).each(function () {
                n += r.S(this).outerHeight(!0)
            }), n
        },
        sticky: function () {
            var e = this.S(t),
                n = this;
            this.S(t).on("scroll", function () {
                n.update_sticky_positioning()
            })
        },
        update_sticky_positioning: function () {
            var e = "." + this.settings.sticky_class,
                n = this.S(t),
                r = this;
            if (r.S(e).length > 0) {
                var i = this.settings.sticky_topbar.data("stickyoffset");
                r.S(e).hasClass("expanded") || (n.scrollTop() > i ? r.S(e).hasClass("fixed") || (r.S(e).addClass("fixed"), r.S("body").addClass("f-topbar-fixed")) : n.scrollTop() <= i && r.S(e).hasClass("fixed") && (r.S(e).removeClass("fixed"), r.S("body").removeClass("f-topbar-fixed")))
            }
        },
        off: function () {
            this.S(this.scope).off(".fndtn.topbar"), this.S(t).off(".fndtn.topbar")
        },
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.accordion = {
        name: "accordion",
        version: "5.1.1",
        settings: {
            active_class: "active",
            toggleable: !0
        },
        init: function (e, t, n) {
            this.bindings(t, n)
        },
        events: function () {
            var t = this,
                n = this.S;
            n(this.scope).off(".fndtn.accordion").on("click.fndtn.accordion", "[" + this.attr_name() + "] > dd > a", function (r) {
                var i = n(this).closest("[" + t.attr_name() + "]"),
                    s = n("#" + this.href.split("#")[1]),
                    o = n("dd > .content", i),
                    u = e("> dd", i),
                    a = i.data(t.attr_name(!0) + "-init"),
                    f = n("dd > .content." + a.active_class, i),
                    l = n("dd." + a.active_class, i);
                r.preventDefault();
                if (f[0] == s[0] && a.toggleable) return l.toggleClass(a.active_class, !1), s.toggleClass(a.active_class, !1);
                o.removeClass(a.active_class), u.removeClass(a.active_class), s.addClass(a.active_class).parent().addClass(a.active_class)
            })
        },
        off: function () {},
        reflow: function () {}
    }
}(jQuery, this, this.document),
function (e, t, n, r) {
    "use strict";
    Foundation.libs.offcanvas = {
        name: "offcanvas",
        version: "5.1.1",
        settings: {},
        init: function (e, t, n) {
            this.events()
        },
        events: function () {
            var e = this.S;
            e(this.scope).off(".offcanvas").on("click.fndtn.offcanvas", ".left-off-canvas-toggle", function (t) {
                t.preventDefault(), e(this).closest(".off-canvas-wrap").toggleClass("move-right")
            }).on("click.fndtn.offcanvas", ".exit-off-canvas", function (t) {
                t.preventDefault(), e(".off-canvas-wrap").removeClass("move-right")
            }).on("click.fndtn.offcanvas", ".right-off-canvas-toggle", function (t) {
                t.preventDefault(), e(this).closest(".off-canvas-wrap").toggleClass("move-left")
            }).on("click.fndtn.offcanvas", ".exit-off-canvas", function (t) {
                t.preventDefault(), e(".off-canvas-wrap").removeClass("move-left")
            })
        },
        reflow: function () {}
    }
}(jQuery, this, this.document);