const config = require( './gulp.config.js' );

/**
 * Load Plugins.
 *
 * Load gulp plugins and passing them semantic names.
 */
const gulp = require( 'gulp' ); // Gulp of-course.

// CSS related plugins.
const sassGlob = require('gulp-sass-glob'); // Gulp plugin for gulp-sass to use glob imports.
const stripCssComments = require('gulp-strip-css-comments');
const sass = require( 'gulp-sass' ); // Gulp plugin for Sass compilation.
const minifycss = require( 'gulp-uglifycss' ); // Minifies CSS files.
const autoprefixer = require( 'gulp-autoprefixer' ); // Autoprefixing magic.
const mmq = require( 'gulp-merge-media-queries' ); // Combine matching media queries into one.
const mediaQueriesSplitter = require('gulp-media-queries-splitter'); // Split CSS files into several CSS files based on media queries

// JS related plugins.
// const concat = require( 'gulp-concat' ); // Concatenates JS files.
// const uglify = require( 'gulp-uglify' ); // Minifies JS files.
// const babel = require( 'gulp-babel' ); // Compiles ESNext to browser compatible JS.

// Image related plugins.
const imagemin = require( 'gulp-imagemin' ); // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
const rename = require( 'gulp-rename' ); // Renames files E.g. style.css -> style.min.css.
const lineec = require( 'gulp-line-ending-corrector' ); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings).
const filter = require( 'gulp-filter' ); // Enables you to work on a subset of the original files by filtering them using a glob.
const sourcemaps = require( 'gulp-sourcemaps' ); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css).
const notify = require( 'gulp-notify' ); // Sends message notification to you.
const browserSync = require( 'browser-sync' ).create(); // Reloads browser and injects CSS. Time-saving synchronized browser testing.

const cache = require( 'gulp-cache' ); // Cache files in stream for later use.
const remember = require( 'gulp-remember' ); //  Adds all the files it has ever seen back into the stream.
const plumber = require( 'gulp-plumber' ); // Prevent pipe breaking caused by errors from gulp plugins.
const beep = require( 'beepbeep' );

// const svgmin = require('gulp-svgmin');
// const svgstore = require('gulp-svgstore');
// const cheerio = require('gulp-cheerio');

/**
 * Custom Error Handler.
 *
 * @param Mixed err
 */
const errorHandler = r => {
	notify.onError( '\n\n❌  ===> ERROR: <%= error.message %>\n' )( r );
	beep();

	// this.emit('end');
};

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 * @link http://www.browsersync.io/docs/options/
 *
 * @param {Mixed} done Done.
 */
const browsersync = done => {
	browserSync.init({
		proxy: config.projectURL,
		open: config.browserAutoOpen,
		injectChanges: config.injectChanges,
		watchEvents: [ 'change', 'add', 'unlink', 'addDir', 'unlinkDir' ]
	});
	done();
};

// Helper function to allow browser reload with Gulp 4.
const reload = done => {
	browserSync.reload();
	done();
};

/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
gulp.task( 'styles', () => {
	return gulp
		.src( config.styleSRC, { allowEmpty: true })
		.pipe( plumber( errorHandler ) )
    .pipe(sassGlob())
		.pipe(
			sass({
				errLogToConsole: config.errLogToConsole,
				outputStyle: config.outputStyle,
				precision: config.precision
			})
		)
		.on( 'error', sass.logError )
    .pipe( stripCssComments() )
		.pipe( autoprefixer( config.BROWSERS_LIST ) )
		// .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
		.pipe( mmq({ log: true }) ) // Merge Media Queries only for .min.css version.
    // .pipe( mediaQueriesSplitter([
    //   {media: 'all', filename: 'all.css'},
    //   // Include CSS rules for small screen sizes and CSS rules without screen size based media queries
    //   {media: ['none', {minUntil: '639px'}, {max: '640px'}], filename: 'mobile.css'},
    //   // Include CSS rules for medium screen sizes (mostly used on tablet)
    //   {media: [{min: '640px', minUntil: '959px'}, {min: '640px', max: '959px'}], filename: 'tablet.css'},
    //   // Include CSS rules for bigger screen sizes (mostly used on desktop)
    //   {media: {min: '960px'}, filename: 'desktop.css'},
    // ]))
		.pipe( gulp.dest( config.styleDestination ) )
		.pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.
		.pipe( rename({ suffix: '.min' }) )
		.pipe( minifycss({ maxLineLen: 10 }) )
		.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
		.pipe( gulp.dest( config.styleDestination ) )
		.pipe( filter( '**/*.css' ) ) // Filtering stream to only css files.
		.pipe( browserSync.stream() ) // Reloads style.min.css if that is enqueued.
		.pipe( notify({ message: '\n\n✅  ===> STYLES — completed!\n', onLast: true }) );
});

/**
 * Task: `scripts`.
 *
 * Concatenate and uglify JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS vendor files and JS custom files
 *     2. Concatenates all the files and generates scripts.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates scripts.min.js
 */
// gulp.task( 'scripts', () => {
// 	return gulp
// 		.src( [config.jsVendorSRC, config.jsCustomSRC], { since: gulp.lastRun( 'scripts' ) }) // Only run on changed files.
// 		.pipe( plumber( errorHandler ) )
// 		.pipe(
// 			babel({
// 				presets: [
// 					[
// 						'@babel/preset-env', // Preset to compile your modern JS to ES5.
// 						{
// 							targets: { browsers: config.BROWSERS_LIST } // Target browser list to support.
// 						}
// 					]
// 				]
// 			})
// 		)
// 		.pipe( remember( 'scripts' ) ) // Bring all files back to stream.
// 		.pipe( concat( config.jsCustomFile + '.js' ) )
// 		.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
// 		.pipe( gulp.dest( config.jsCustomDestination ) )
// 		.pipe(
// 			rename({
// 				basename: config.jsCustomFile,
// 				suffix: '.min'
// 			})
// 		)
// 		.pipe( uglify() )
// 		.pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
// 		.pipe( gulp.dest( config.jsCustomDestination ) )
// 		.pipe( notify({ message: '\n\n✅  ===> SCRIPTS — completed!\n', onLast: true }) );
// });


/**
 * Task: `images`.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp images`.
 *
 * Read the following to change these options.
 * @link https://github.com/sindresorhus/gulp-imagemin
 */
gulp.task( 'images', () => {
	return gulp
		.src( config.imgSRC )
		.pipe(
			cache(
				imagemin([
					imagemin.gifsicle({ interlaced: true }),
					imagemin.mozjpeg({quality: 85, progressive: true}),
					imagemin.optipng({ optimizationLevel: 3 }), // 0-7 low-high.
					imagemin.svgo({
						plugins: [ { removeViewBox: true }, { cleanupIDs: false } ]
					})
				])
			)
		)
		.pipe( gulp.dest( config.imgDST ) )
		.pipe( notify({ message: '\n\n✅  ===> IMAGES — completed!\n', onLast: true }) );
});

// #################
//
// Sprite icons
//
// #################
//
// svgmin minifies our SVG files and strips out unnecessary
// code that you might inherit from your graphics editor.
// svgstore binds them together in one giant SVG container called
// icons.svg. Then cheerio gives us the ability to interact with
// the DOM components in this file in a jQuery-like way. cheerio
// in this case is removing any fill attributes from the SVG
// elements (you’ll want to use CSS to manipulate them)
// and adds a class of .hide to our parent SVG. It gets
// deposited into our inc directory with the rest of the HTML partials.
// ===================================================

gulp.task('icons', () => {
  return gulp
  .src( config.iconSRC )
    .pipe(svgmin())
    .pipe(svgstore({inlineSvg: true}))
    .pipe(
			rename({
				basename: config.iconSpriteFile
			})
		)
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hidden');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(gulp.dest(config.iconDST))
    .pipe( notify({ message: '\n\n✅  ===> ICONS — completed!\n', onLast: true }) );
});


/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task(
	'default',
	gulp.parallel( 'styles', 'images', browsersync, () => {
		// gulp.watch( config.watchPhp, reload ); // Reload on PHP file changes.
		gulp.watch( config.watchStyles, gulp.parallel( 'styles' ) ); // Reload on SCSS file changes.
		// gulp.watch( config.watchJsVendor, gulp.series( 'scripts', reload ) ); // Reload on script file changes.
		// gulp.watch( config.watchJsStyleguide, gulp.series( 'styleguide-scripts', reload ) ); // Reload on script file changes.
		gulp.watch( config.imgSRC, gulp.series( 'images', reload ) ); // Reload on images file changes.
		// gulp.watch( config.iconSRC, gulp.series( 'icons', reload ) ); // Reload on icons file changes.
	})
);
