"use strict";

var postcss = require("postcss"),

		/* Properties to check */
		epubProps = [
			/* epub text */
			"-epub-hyphens",
			"-epub-line-break",
			"-epub-text-align-last",
			"-epub-word-break",

			/* epub text decoration */
			"-epub-text-emphasis",
			"-epub-text-emphasis-color",
			"-epub-text-emphasis-style",
			"-epub-text-emphasis-position",
			"-epub-text-underline-position",
			
			/* epub writing modes */
			"-epub-writing-mode",
			"-epub-text-orientation",
			"-epub-text-combine",
			"-epub-text-combine-horizontal",
			"-epub-text-combine-upright",

			/* */
			"epub-ruby-position"
		],

		/* For some props, we need to change the prop/value as well */
		mappings = [
			{epubProp: "-epub-text-underline-position", epubVal: "alphabetic", stdVal: "auto"},
			{epubProp: "-epub-text-orientation", epubVal: "vertical-right", stdVal: "mixed"},
			{epubProp: "-epub-text-orientation", epubVal: "sideways-right", stdVal: "sideways"},
			{epubProp: "-epub-text-orientation", epubVal: "rotate-right", stdVal: "sidaways"},
			{epubProp: "-epub-text-orientation", epubVal: "rotate-normal", stdVal: "sideways"},
			{epubProp: "-epub-text-combine", epubVal: "horizontal", stdProp: "text-combine-upright", stdVal: "all"},
			{epubProp: "-epub-text-combine-horizontal", epubVal: "all", stdProp: "text-combine-upright"}
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

				/* If text-transform */
				if (decl.value === "-epub-fullwidth" && decl.prop === "text-transform") {
					var hasTextTransform = decl.parent.some(x => x.prop === "text-transform" && x.value === "full-width");

					if (!hasTextTransform) {
						decl.cloneAfter({
							prop: "text-transform",
							value: "full-width"
						});
					}
				}
				
				/* If declaration property in the list */
				 else if (epubProps.indexOf(decl.prop) >= 0) {

					/* Check if the unprefixed property already exists */					
					if (decl.prop === "-epub-text-combine-horizontal" || decl.prop === "-epub-text-combine") {
						var unprefixedProp = "text-combine-upright";
					} else {
						var unprefixedProp = decl.prop.replace(/-epub-/i, "");
					}

					var hasUnprefixed = decl.parent.some(y => y.prop === unprefixedProp);

					/* If the unprefixed prop doesn’t exist */
					if (!hasUnprefixed) {

						/* Check if we have to change the value for this prop as well */
						var idx = mappings.findIndex(z => z.epubVal === decl.value && z.epubProp === decl.prop);
					
						/* If we have to change the value and/or prop */
						if (idx >= 0) {

							/* If we have to change the prop */
							if (mappings[idx].stdProp) {
								
								/* And the value as well */
								if (mappings[idx].stdVal) {
									decl.cloneAfter({
										prop: mappings[idx].stdProp,
										value: mappings[idx].stdVal
									});
								} else {
									decl.cloneAfter({
										prop: mappings[idx].stdProp
									});
								}
							} else {

							/* Clone the epub-prop to add the unprefixed one and the new value */
								decl.cloneAfter({
									prop: unprefixedProp,
									value: mappings[idx].stdVal
								});
							}
						} else {

							/* Clone the epub-prop to add the unprefixed one */
							decl.cloneAfter({
								prop: unprefixedProp
							});
						}
					}
				}
			}
		});
	};
});

// If you need to prefix properties, use the autoprefixer plugin