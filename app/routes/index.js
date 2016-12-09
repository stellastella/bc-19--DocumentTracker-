'use strict';

var path = process.cwd();
var userController = require(path + '/app/controllers/userController.server.js');
var User = require(path + '/app/models/users.js');
var documentController = require(path + '/app/controllers/documentController.server.js');
var document = require(path + '/app/models/document.js')
var mongoose = require('mongoose');
var id = mongoose.Types.ObjectId();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var id = new ObjectId;



module.exports = function (app, passport) {
	var userCtrl = new userController();
		var documentCtrl = new documentController();


	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} 

		// otherwise redirect to login
		res.redirect('/login');
	}

	function isLoggedInAsAdmin (req, res, next) {
		if (req.isAuthenticated()) {
			if (req.user.local.isAdmin || req.user.google.isAdmin) {
	        	return next();
	    	}
	    }

    	// otherwise redirect to index
	    req.flash('error_msg', 'Unauthorised access');
	    res.redirect('/');
	}
	


	app.route('/')
		.get(function (req, res) {
			res.render('index', { title:'Clementine.js'});
		});

	app.route('/login')
		.get(function (req, res) {
			res.render('login', { title:'Account Login'});
		})
		.post(passport.authenticate('local',  {successRedirect: '/profile',
                                   failureRedirect: '/login',
                                   failureFlash: true }),
			function(req, res) {
			    // If this function gets called, authentication was successful.
			    // `req.user` contains the authenticated user.
			    req.flash('success_msg', 'You have been successfully logged in');
			    res.redirect('/profile');
			}
		);

	app.route('/register')
		.get(function (req, res) {
			res.render('register', { title:'Register'});
		})
		.post(function (req, res) {
		    var name = req.body.name;
		    var username = req.body.username;
		    var email = req.body.email;
		    var password = req.body.password;

		    // Validation
		    req.checkBody('name', 'Name is required').notEmpty();
		    req.checkBody('email', 'Email is required').notEmpty();
		    req.checkBody('email', 'Email is not valid').isEmail();
		    req.checkBody('username', 'Username is required').notEmpty();
		    req.checkBody('password', 'Password is required').notEmpty();
		    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

		    var errors = req.validationErrors();

		    if (errors) {
		        res.render('register', {
		            errors: errors
		        });
		    } else {
		        var newUser = new User();

		        newUser.local.name = name;
		        newUser.local.username = username;
		        newUser.local.email = email;
		        newUser.local.password = password;
		        newUser.local.isAdmin = false;

		        userCtrl.createUser(newUser, function (err) {
		            if (err) throw err;

		            req.flash('success_msg', 'You are registered and can now login');

		            res.redirect('/profile');
		        });
		    }
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render('profile', {title: 'User Profile', user: req.user });
		});

	app.route('/auth/google')
		.get(passport.authenticate('google', { scope : ['profile', 'email'] }));

	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/profile',
			failureRedirect: '/login'
		}));

	app.route('/admin')
		.get(isLoggedIn, function(req, res) {
			res.render('dashboard', { title: 'Dashboard' });
	});
	
		app.route('/document')
		.get(function(req, res) {
			res.render('document', { title: 'Add your documents' });
			console.log(res);
	})
	.post(function(req, res) {
		
	        var title = req.body.title;
		    var link = req.body.link;
		    var category = req.body.category;
		    var keywords = req.body.keywords;
            var addedBy = req.body.addedBy;
		    // Validation
		    req.checkBody('title', 'Document title is required').notEmpty();
			req.checkBody('link', 'add link your document. eg dropbox, googledrive. optional');
		    req.checkBody('category', 'write the category or department of your document').notEmpty();
	   	    req.checkBody('keywords', 'write keywords that relates to your document').notEmpty();
		    

		    var errors = req.validationErrors();

		    if (errors) {
		        res.render('document', {
		            errors: errors
		        });
		    } else {
		        var newDocument = new document();

		        newDocument.local.title = title;
		        newDocument.local.link = link;
		        newDocument.local.category = category;
				newDocument.local.keywords = keywords;
                newDocument.local.addedBy = addedBy;
		        documentCtrl.createDocument(newDocument, function (err) {
		            if (err) throw err;

		            req.flash('success_msg', 'You have successfully added your document');

		            res.redirect('/viewdocument');
		        });
		    }	
	})
	app.route('/documentUpdate')
		.get(function(req, res) {
			var id = req.params.id;
			documentCtrl.getDocumentById(id, function (err, documentObject ){
				if(err) throw err;
            res.render('documentUpdate', { documentObject: documentObject });
			})
	})
	.post(function(req, res) {
		    var id = req.params.id; 
		     var title = req.body.title;
		    var link = req.body.link;
		    var category = req.body.category;
		    var keywords = req.body.keywords;
            var addedBy = req.body.addedBy;
		    // Validation
		 
		    req.checkBody('title', 'Document title is required').notEmpty();
			req.checkBody('link', 'add link your document. eg dropbox, googledrive').notEmpty;
		    req.checkBody('category', 'write the category or department of your document').notEmpty();
	  	    req.checkBody('keywords', 'write keywords that relates to your document').notEmpty();

		    var errors = req.validationErrors();

		    if (errors) {
		        res.render('documentUpdate', {
		            errors: errors
		        });
		    } else {
		        var updatedDocument = new document();
				updatedDocument.local.id = id;
		        updatedDocument.local.title = title;
		        updatedDocument.local.link = link;
		        updatedDocument.local.category = category;
		        updatedDocument.local.keywords = keywords;
                updatedDocument.local.addedBy = addedBy;
		        documentCtrl.updatedDocument(id, updatedDocument, function (err) {
		            if (err) throw err;

		            req.flash('success_msg', 'You have updated you document information');

		            res.redirect('/viewDocument');
		        });
		    }	
	})
	
        
	app.route('/viewDocument')
		.get(function(req, res) {
			documentCtrl.getListOfDocument(function(err, documentView){
				if (err) throw err;
			res.render('viewDocument', { documentView: documentView });
			})
			
	})
	app.route('/documentDelete')
        .get(function (req, res) {
            var id = req.query.id;
            //console.log(id)
            documentCtrl.documentDelete(id, function(err, bookObject){
                 if (err) throw err;
                req.flash('success_msg', 'You have successfully deleted a document information');
                    res.redirect('/viewDocument');
            });
      });
};
