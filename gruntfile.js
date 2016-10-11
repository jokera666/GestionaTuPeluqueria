module.exports = function(grunt){
 
 	var ficherosJS = ['www/js/app.js','www/js/calendar.js','www/controladores/controllers.js','www/servicios/services.js'];
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
	    uglify: {
	      // js: {
	      //   files: [{
	      //     expand: true,
	      //     cwd: 'www/*',
	      //     src: 	['*.js','!*.min.js'],
	      //     dest: 'www/todosJSmin/',
	      //     ext: '.min.js'
	      //   }]
	      // }
	       	static_mappings: {
		      // Because these src-dest file mappings are manually specified, every
		      // time a new file is added or removed, the Gruntfile has to be updated.
		      files: [
		        {src: 'www/js/app.js', 						dest: 'www/todosJSmin/app.min.js'},
		        {src: 'www/js/calendar.js', 				dest: 'www/todosJSmin/calendar.min.js'},
		        {src: 'www/controladores/controllers.js', 	dest: 'www/todosJSmin/controllers.min.js'},
		        {src: 'www/servicios/services.js', 			dest: 'www/todosJSmin/services.min.js'},
		      ],
		    },
	    },

	    cssmin:{
	    	target: {
		    files: [{
		      expand: true,
		      cwd: 'www/css/',
		      src: ['*.css', '!*.min.css'],
		      dest: 'www/todosCSSmin/',
		      ext: '.min.css'
		    }]
		  }
	    }

    });
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task(s).
  grunt.registerTask('default', ['uglify','cssmin']);
};