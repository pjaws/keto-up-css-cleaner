/*  Shopify CSS Cleaner
 *
 *  Statically analyzes files in `/templates`, `/snippets`, `/layout`, and `/sections`
 *  to find unused CSS rules from the given CSS file.
 *  Outputs "purified" and optionally minified (use the --min flag) CSS files to
 *  <CSS filename>.<template filename>.purified.css
 *
 *  USAGE: node index.js <theme directory> <CSS file>
 *
 *  EXAMPLE: node index.js ~/Projects/Yeti/keto-up styles.css
 *    Looks for styles.css in /assets, Outputs styles.index.purified.css,
 *    styles.product.purified.css, etc.
 *
 */
const fs = require('fs');
const exec = require('child_process').exec;

const mainDir = process.argv[2];
const cssFile = process.argv[3];
const shouldMinify = process.argv.includes('--min');
const templateDir = `${mainDir}/templates`;
const snippetDir = `${mainDir}/snippets`;
const layoutDir = `${mainDir}/layout`;
const sectionsDir = `${mainDir}/sections`;
const assetDir = `${mainDir}/assets`;

const purify = (cssFile, templateDir, assetDir) => {
	fs.readdir(templateDir, { withFileTypes: true }, (err, files) => {
		if (err) console.log(`Error reading directory: ${err}`);

		files.forEach(file => {
			if (file.isDirectory()) {
				purify(cssFile, `${templateDir}/${file.name}`, assetDir);
			} else {
				if (file.name.indexOf('pluginspeed') === -1) {
					// this is the final shell command executed with a callback
					exec(
						`purifycss ${assetDir}/${cssFile} ${templateDir}/${file.name} ${
							shouldMinify ? '--min' : ''
						} --info --out ${assetDir}/${cssFile.substring(
							0,
							cssFile.length - 4,
						)}.${file.name.substring(0, file.name.length - 7)}.purified.css`, // (length - 7) is to remove the .liquid extension
						(err, stdout, stderr) => {
							console.log(file.name);
							if (err) {
								console.log(`Error purifying css: ${err}`);
							}

							console.log(stdout);
						},
					);
				}
			}
		});
	});
};
try {
	purify(cssFile, templateDir, assetDir);
	purify(cssFile, snippetDir, assetDir);
	purify(cssFile, layoutDir, assetDir);
	purify(cssFile, sectionsDir, assetDir);
} catch (error) {
	console.log(
		'Error cleaning your files. Make sure you are running this at the root of your Shopify theme.',
	);
}
