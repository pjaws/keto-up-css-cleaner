# Keto Up CSS Cleaner

## Prerequisites

Install [PurifyCSS](https://github.com/purifycss/purifycss) globally

```
npm install -g purify-css
```

Install [CSS-Purge](https://github.com/rbtech/css-purge) globally

```
npm install -g css-purge
```

## Usage

1. Combine all CSS files into one (copy and paste is fine).
2. Run the script to remove unused CSS rules

```
node index.js <path to theme folder> <combined CSS file name>
```

3. Edit all of the files ending in `config_css.json` with the proper path to the Shopify theme. Find and replace all should make this quick.
4. Once the script is done running, run `css-purge` for each of the files ending in `config_css.json`:

```
css-purge -f article.config_css.json
```

4. The new CSS files are included in `snippets/head-styles.liquid` (in the theme folder) on a template by template basis, i.e.:

```
{% if template contains index %}
	{{ 'styles.index.purged.css' | asset_url | stylesheet_tag }}
{% endif %}
```

5. Alternatively, after the script from Step 2 is finished, the resulting files can be combined as needed with [Shrinker](http://www.shrinker.ch/), which seems to work better, but requires manually adding each file required for the template.

## Example

```
node index.js ~/Projects/Yeti/keto-up styles.css
```

Looks for `styles.css` in `.../keto-up/assets` and outputs `assets/styles.index.purified.css`, `assets/styles.product.purified.css`, etc.
