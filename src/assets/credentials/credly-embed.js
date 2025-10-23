(function () {
  var e, t, a, r, d, l, i, m, n, o, u, c, s;
  for (
    window.CREDLY_EMBED_JS_LOADER_VERSION = "20210331",
      e = "www.credly.com",
      t =
        /(.*\.credly.com$|(credly\.local|acclaim\.local|localhost|web):500[0-2]$)/,
      c = function (e) {
        if (null != e) return t.test(e) ? e : void 0;
      },
      l = function (e) {
        var t, a, r, d, l;
        if (null != document.querySelectorAll)
          return document.querySelectorAll("[data-" + e + "]");
        for (
          l = [], r = 0, d = (t = document.getElementsByTagName("*")).length;
          r < d;
          r++
        )
          (a = t[r]).getAttribute("data-" + e) && l.push(a);
        return l;
      },
      m = 0,
      n = (o = l("share-badge-id")).length;
    m < n;
    m++
  )
    ((r = (d = o[m]).attributes.getNamedItem("data-share-badge-id").value),
      (s = d.attributes.getNamedItem("data-iframe-width").value),
      (i = d.attributes.getNamedItem("data-iframe-height").value),
      (a = c(
        null != (u = d.attributes.getNamedItem("data-share-badge-host"))
          ? u.value
          : void 0,
      )) || (a = e),
      /^https?:\/\//.test(a) || (a = "//" + a),
      (d.outerHTML =
        '<iframe name="acclaim-badge" allowTransparency="true" frameborder="0" id="embedded-badge-' +
        r +
        '" scrolling="no" src="' +
        a +
        "/embedded_badge/" +
        r +
        '" style="width: ' +
        s +
        "px; height: " +
        i +
        'px;" title="View my verified achievement on Credly." ></iframe>'));
}).call(this);
