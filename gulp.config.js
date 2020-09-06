/**
 * Gulp Configuration File
 *
 * 1. Edit the variables as per your project requirements.
 * 2. In paths you can add <<glob or array of globs>>.
 *
 */

module.exports = {

	// Project options.
	projectURL: 'localhost:3000',
	productURL: './',
	browserAutoOpen: false,
	injectChanges: true,

	// Style options.
	styleSRC: './assets/sass/main.scss', // Path to main .scss file.
	styleDestination: './assets/css', // Path to place the compiled CSS file. Default set to root folder.
	outputStyle: 'compact', // Available options → 'compact' or 'compressed' or 'nested' or 'expanded'
	errLogToConsole: true,
	precision: 10,

	// JS Vendor options.
	jsVendorSRC: './build/script/vendor/**/*.js', // Path to JS vendor folder.

	// JS Custom options.
	jsCustomSRC: './build/script/custom/*.js', // Path to JS custom scripts folder.
	jsCustomDestination: './build/script/', // Path to place the compiled JS custom scripts file.
	jsCustomFile: 'scripts', // Compiled JS custom file name. Default set to custom i.e. custom.js.

  // JS Style Guide options.
	jsStyleGuideSRC: './build/script/styleguide/*.js', // Path to JS custom scripts folder.
	jsStyleGuideDestination: './build/script/', // Path to place the compiled JS custom scripts file.
	jsStyleGuideFile: 'styleguide', // Compiled JS custom file name. Default set to custom i.e. custom.js.

	// Images options.
	imgSRC: './images/img/raw/**/*', // Source folder of images which should be optimized and watched. You can also specify types e.g. raw/**.{png,jpg,gif} in the glob.
	imgDST: './build/img/', // Destination folder of optimized images. Must be different from the imagesSRC folder.

  // SVG Icon options.
	iconSRC: './images/icons/input/**/*', // Source folder of svgs which should be optimized and watched. You can also specify types e.g. raw/**.{png,jpg,gif} in the glob.
	iconDST: './build/img/icons/', // Destination folder of svg sprite. Must be different from the imagesSRC folder.
  iconSpriteFile: 'icons', // Compiled SVG sprite file name. Default set to icons i.e. icons.svg.

	// Watch files paths.
	watchStyles: './assets/sass/**/*.scss', // Path to all *.scss files inside css folder and inside them.
	watchJsVendor: './build/script/vendor/*.js', // Path to all vendor JS files.
	watchJsCustom: './build/script/custom/*.js', // Path to all custom JS files.
	watchJsStyleguide: './build/script/styleguide/*.js', // Path to all styleguide JS files.
	watchPhp: './docs/templates/**/*.php', // Path to all PHP files.

	// Browsers you care about for autoprefixing. Browserlist https://github.com/ai/browserslist
	// The following list is set as per WordPress requirements. Though, Feel free to change.
	BROWSERS_LIST: [
		'last 2 version',
		'> 1%',
		'ie >= 11',
		'last 1 Android versions',
		'last 1 ChromeAndroid versions',
		'last 2 Chrome versions',
		'last 2 Firefox versions',
		'last 2 Safari versions',
		'last 2 iOS versions',
		'last 2 Edge versions',
		'last 2 Opera versions'
	]
};
