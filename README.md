# postcss-epub-interceptor

A [PostCSS](https://github.com/postcss/postcss) plugin to unprefix EPUB3 properties.

See [EPUB 3.1 Mapping](http://www.idpf.org/epub/31/spec/epub-contentdocs.html#sec-css-prefixed) for further details.

## Warning

This is very alpha (v.0.1) and is more of a proof of concept than an elegant plugin. It gets the job done but is neither elegant nor optimized.

At least it implements the correct mapping for `-epub-properties` back to EPUB 3.0.0 – I just needed to do a practical implementation in order to get all the details and will redo it from scratch ASAP. In the meantime, please feel free to fork it, improve code and pull request.

## Usage

```js

postcss([ require("postcss-epub-interceptor") ])

// postcss.config.js

module.exports = (ctx) => ({
  plugins: [
    require('postcss-epub-interceptor')({ })
  ]
})
```

## Prefixing

If you need to prefix those properties, please use [autoprefixer](https://github.com/postcss/autoprefixer). 

## Example

### Input

```css

.text-1 {
	-epub-hyphens: auto;
	-epub-line-break: normal;
	-epub-text-align-last: center;
	-epub-word-break: break-all;
	text-transform: -epub-fullsize-kana; 
}

.text-2 {
	-epub-hyphens: none;
	hyphens: none;
	text-align-last: center;
	-epub-word-break: break-all;
	word-break: break-all;
  text-transform: -epub-fullwidth;	
}

.text-3 {
	text-transform: -epub-fullwidth;
	text-transform: full-width;
}
```

### Output

```css

.text-1 {
	-epub-hyphens: auto;
	hyphens: auto;
	-epub-line-break: normal;
	line-break: normal;
	-epub-text-align-last: center;
	text-align-last: center;
	-epub-word-break: break-all;
	word-break: break-all;
	text-transform: -epub-fullsize-kana; 
}

.text-2 {
	-epub-hyphens: none;
	hyphens: none;
	text-align-last: center;
	-epub-word-break: break-all;
	word-break: break-all;
  text-transform: -epub-fullwidth;
  text-transform: full-width;	
}

.text-3 {
	text-transform: -epub-fullwidth;
	text-transform: full-width;
}
```

## Notes

The following declarations are not supported: 

- `text-transform: -epub-fullsize-kana` (CSS Text Level 3 module has dropped support for the `fullsize-kana` value);
- `-epub-text-combine: horizontal <digit>`.

## License

MIT