module.exports = function(grunt) {

	require('jit-grunt')(grunt);

	var mainFolder = "main/";
	var siteFolder = "site/"
	var siteBasename = "index.html";

	var sourceFolder = "../src/";
	var scriptsBasename = "**/*.ts";

	var sourceMainFolder = sourceFolder + mainFolder;
	var mainScripts = [ sourceMainFolder + scriptsBasename ];

	var sourceSiteFolder = sourceFolder + "site/";
	var siteScripts = [ sourceSiteFolder + scriptsBasename ];
	var stylesheets = [ sourceSiteFolder + "**/*.less" ];
	var site = sourceSiteFolder + siteBasename;

	var targetFolder = "../target/";
	var compiledScriptsBasename = "scripts.js";

	var targetMainFolder = targetFolder + mainFolder;
	var compiledMainScripts = targetMainFolder + compiledScriptsBasename;

	var targetSiteFolder = targetFolder + siteFolder;
	var compiledDependencies = targetSiteFolder + "bower_components.js";
	var compiledSiteScripts = targetSiteFolder + compiledScriptsBasename;
	var compiledStylesheets = targetSiteFolder + "stylesheets.css";
	var compiledSite = targetSiteFolder + siteBasename;

	grunt.initConfig({
		watch : {
			bower_concat : {
				files : [ "bower.json" ],
				tasks : [ "bower_concat" ]
			},
			typescript_main : {
				files : mainScripts,
				tasks : [ "typescript:main" ]
			},
			typescript_site : {
				files : mainScripts.concat(siteScripts),
				tasks : [ "typescript:site" ]
			},
			less : {
				files : stylesheets,
				tasks : [ "less" ]
			},
			site : {
				files : site,
				tasks : [ "dom_munger" ]
			},
		},
		bower_concat : {
			build : {
				dest : compiledDependencies
			}
		},
		typescript : {
			main : {
				src : mainScripts,
				dest : compiledMainScripts,
				options : {
					declaration: true
				}
			},
			site : {
				src : siteScripts,
				dest : compiledSiteScripts
			}
		},
		less : {
			build : {
				src : stylesheets,
				dest : compiledStylesheets
			}
		},
		dom_munger : {
			build : {
				src : site,
				dest : compiledSite,
				options : {
					append : {
						selector : "head",
						html :
							'<script src="../' + compiledDependencies + '" type="text/javascript"></script>' +
							'<script src="../' + compiledMainScripts + '" type="text/javascript"></script>' +
							'<script src="../' + compiledSiteScripts + '" type="text/javascript"></script>' +
							'<link rel="stylesheet" href="../' + compiledStylesheets + '" type="text/css" />'
					}
				}
			}
		},
		open : {
			build : {
				path : compiledSite
			}
		}
	});

};