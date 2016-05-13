(function (a) {
	typeof define == "function" ? define("libs/mustache/0.4.0/mustache", [], a) : typeof module != "undefined" ? module.exports = a() : this.Mustache = a()
})(function () {
	var a = function () {
		var a = {}, b = function () {
		};
		return b.prototype = {otag : "{{", ctag : "}}", pragmas : {}, buffer : [], pragmas_implemented : {"IMPLICIT-ITERATOR" : !0}, context : {}, render : function (a, b, c, d) {
			d || (this.context = b, this.buffer = []);
			if ( !this.includes("", a) ) {
				if ( d )return a;
				this.send(a);
				return
			}
			a = this.render_pragmas(a);
			var e = this.render_section(a, b, c);
			e === !1 && (e = this.render_tags(a, b, c, d));
			if ( d )return e;
			this.sendLines(e)
		}, send : function (a) {
			a !== "" && this.buffer.push(a)
		}, sendLines : function (a) {
			if ( a ) {
				var b = a.split("\n");
				for (var c = 0; c < b.length; c++)this.send(b[c])
			}
		}, render_pragmas : function (a) {
			if ( !this.includes("%", a) )return a;
			var b = this, c = this.getCachedRegex("render_pragmas", function (a, b) {
				return new RegExp(a + "%([\\w-]+) ?([\\w]+=[\\w]+)?" + b, "g")
			});
			return a.replace(c, function (a, c, d) {
				if ( !b.pragmas_implemented[c] )throw{message : "This implementation of mustache doesn't understand the '" + c + "' pragma"};
				b.pragmas[c] = {};
				if ( d ) {
					var e = d.split("=");
					b.pragmas[c][e[0]] = e[1]
				}
				return""
			})
		}, render_partial : function (a, b, c) {
			a = this.trim(a);
			if ( !c || c[a] === undefined )throw{message : "unknown_partial '" + a + "'"};
			return typeof b[a] != "object" ? this.render(c[a], b, c, !0) : this.render(c[a], b[a], c, !0)
		}, render_section : function (a, b, c) {
			if ( !this.includes("#", a) && !this.includes("^", a) )return!1;
			var d = this, e = this.getCachedRegex("render_section", function (a, b) {
				return new RegExp("^([\\s\\S]*?)" + a + "(\\^|\\#)\\s*(.+)\\s*" + b + "\n*([\\s\\S]*?)" + a + "\\/\\s*\\3\\s*" + b + "\\s*([\\s\\S]*)$", "g")
			});
			return a.replace(e, function (a, e, f, g, h, i) {
				var j = e ? d.render_tags(e, b, c, !0) : "", k = i ? d.render(i, b, c, !0) : "", l, m = d.find(g, b);
				return f === "^" ? !m || d.is_array(m) && m.length === 0 ? l = d.render(h, b, c, !0) : l = "" : f === "#" && (d.is_array(m) ? l = d.map(m,function (a) {
					return d.render(h, d.create_context(a), c, !0)
				}).join("") : d.is_object(m) ? l = d.render(h, d.create_context(m), c, !0) : typeof m == "function" ? l = m.call(b, h, function (a) {
					return d.render(a, b, c, !0)
				}) : m ? l = d.render(h, b, c, !0) : l = ""), j + l + k
			})
		}, render_tags : function (a, b, c, d) {
			var e = this, f = function () {
				return e.getCachedRegex("render_tags", function (a, b) {
					return new RegExp(a + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" + b + "+", "g")
				})
			}, g = f(), h = function (a, d, h) {
				switch (d) {
					case"!":
						return"";
					case"=":
						return e.set_delimiters(h), g = f(), "";
					case">":
						return e.render_partial(h, b, c);
					case"{":
						return e.find(h, b);
					default:
						return e.escape(e.find(h, b))
				}
			}, i = a.split("\n");
			for (var j = 0; j < i.length; j++)i[j] = i[j].replace(g, h, this), d || this.send(i[j]);
			if ( d )return i.join("\n")
		}, set_delimiters : function (a) {
			var b = a.split(" ");
			this.otag = this.escape_regex(b[0]), this.ctag = this.escape_regex(b[1])
		}, escape_regex : function (a) {
			if ( !arguments.callee.sRE ) {
				var b = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
				arguments.callee.sRE = new RegExp("(\\" + b.join("|\\") + ")", "g")
			}
			return a.replace(arguments.callee.sRE, "\\$1")
		}, find : function (a, b) {
			function c(a) {
				return a === !1 || a === 0 || a
			}

			a = this.trim(a);
			var d;
			if ( a.match(/([a-z_]+)\./ig) ) {
				var e = this.walk_context(a, b);
				c(e) && (d = e)
			} else c(b[a]) ? d = b[a] : c(this.context[a]) && (d = this.context[a]);
			return typeof d == "function" ? d.apply(b) : d !== undefined ? d : ""
		}, walk_context : function (a, b) {
			var c = a.split("."), d = b[c[0]] != undefined ? b : this.context, e = d[c.shift()];
			while (e != undefined && c.length > 0)d = e, e = e[c.shift()];
			return typeof e == "function" ? e.apply(d) : e
		}, includes : function (a, b) {
			return b.indexOf(this.otag + a) != -1
		}, escape : function (a) {
			return a = String(a === null ? "" : a), a.replace(/&(?!\w+;)|["'<>\\]/g, function (a) {
				switch (a) {
					case"&":
						return"&amp;";
					case'"':
						return"&quot;";
					case"'":
						return"&#39;";
					case"<":
						return"&lt;";
					case">":
						return"&gt;";
					default:
						return a
				}
			})
		}, create_context : function (a) {
			if ( this.is_object(a) )return a;
			var b = ".";
			this.pragmas["IMPLICIT-ITERATOR"] && (b = this.pragmas["IMPLICIT-ITERATOR"].iterator);
			var c = {};
			return c[b] = a, c
		}, is_object : function (a) {
			return a && typeof a == "object"
		}, is_array : function (a) {
			return Object.prototype.toString.call(a) === "[object Array]"
		}, trim : function (a) {
			return a.replace(/^\s*|\s*$/g, "")
		}, map : function (a, b) {
			if ( typeof a.map == "function" )return a.map(b);
			var c = [], d = a.length;
			for (var e = 0; e < d; e++)c.push(b(a[e]));
			return c
		}, getCachedRegex : function (b, c) {
			var d = a[this.otag];
			d || (d = a[this.otag] = {});
			var e = d[this.ctag];
			e || (e = d[this.ctag] = {});
			var f = e[b];
			return f || (f = e[b] = c(this.otag, this.ctag)), f
		}}, {name : "mustache.js", version : "0.4.0-dev", to_html : function (a, c, d, e) {
			var f = new b;
			e && (f.send = e), f.render(a, c || {}, d);
			if ( !e )return f.buffer.join("\n")
		}}
	}();
	return a
});