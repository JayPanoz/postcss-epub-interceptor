"use strict";

var postcss = require("postcss"),

    mappings = [
      {epubProp: "text-transform", unpref: true, epubVal: "-epub-fullwidth", stdVal: "full-width"},
      {epubProp: "-epub-hyphens"},
      {epubProp: "-epub-line-break"},
      {epubProp: "-epub-text-align-last"},
      {epubProp: "-epub-word-break"},
      {epubProp: "-epub-text-emphasis"},
      {epubProp: "-epub-text-emphasis-color"},
      {epubProp: "-epub-text-emphasis-style"},
      {epubProp: "-epub-text-emphasis-position"},
      {epubProp: "-epub-text-underline-position", epubVal: "alphabetic", stdVal: "auto"},
      {epubProp: "-epub-ruby-position"},
      {epubProp: "-epub-writing-mode"},
      {epubProp: "-epub-text-orientation", multipleVals: [
        {epubVal: "upright", stdVal: "upright"},
        {epubVal: "mixed", stdVal: "mixed"},
        {epubVal: "vertical-right", stdVal: "mixed"},
        {epubVal: "sideways", stdVal: "sideways"},
        {epubVal: "sideways-right", stdVal: "sideways"},
        {epubVal: "rotate-right", stdVal: "sideways"},
        {epubVal: "rotate-normal", stdVal: "sideways"}
      ]},
      {epubProp: "-epub-text-combine", epubVal: "horizontal", stdProp: "text-combine-upright", stdVal: "all"},
      {epubProp: "-epub-text-combine-horizontal", epubVal: "all", stdProp: "text-combine-upright"},
      {epubProp: "-epub-text-combine-upright"}     
    ];

module.exports = postcss.plugin("postcss-epub-interceptor", function(opts) {
	opts = opts || {};

	/**
	 * PostCSS plugin to unprefix ePub3 properties
	 * @param {Object} css
	 */

  return function(css) {
    css.walkDecls(function(decl) {
      if (decl.value) {
        var currentProp = decl.prop,
            currentValue = decl.value,
            idx = mappings.findIndex(x => x.epubProp === currentProp),
            mapping = mappings[idx];
        
        if (idx >= 0) {
          var hasUnprefixed = true;

          if (!mapping.unpref) {
            var unprefixedProp;
            mapping.stdProp ? unprefixedProp = mapping.stdProp : unprefixedProp = currentProp.replace(/-epub-/i, "");
            hasUnprefixed = decl.parent.some(y => y.prop === unprefixedProp);
          } else if (mapping.unpref && mapping.epubVal === currentValue) {
            var unprefixedProp = currentProp,
                unprefixedValue = mapping.stdVal,
                hasUnprefixed = decl.parent.some(y => y.prop === unprefixedProp && y.value === unprefixedValue);
          }

          if (!hasUnprefixed) {
            var newProp = unprefixedProp,
                newValue;

            if (mapping.multipleVals) {
              var subIdx = mapping.multipleVals.findIndex(z => z.epubVal === currentValue);
              subIdx >= 0 ? newValue = mapping.multipleVals[subIdx].stdVal : newValue = currentValue;
            } else if (mapping.stdVal) {
              newValue = mapping.stdVal;
            } else {
              newValue = currentValue;
            }

            decl.cloneAfter({
              prop: newProp,
              value: newValue
            });
          }
        }
      }
    });
  }
});

// If you need to prefix properties, use the autoprefixer plugin