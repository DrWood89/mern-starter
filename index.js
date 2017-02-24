const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const config = require('./config');
const path = require('path');
const port = process.env.PORT || 8080
//const path = require('path');

// Connect to the database and load models
// ORIGINAL
require('./server/models').connect(config.dbUri);
// NEW
//require('./server/models').connect(process.env.MONGODB_URI);

const app = express();
// Tell the app to look for static files in these directories
app.use(express.static('./server/static/'));
app.use(express.static('./client/dist/'));

// Tell the app to parse HTTP body message
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// Pass the passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
passport.deserializeUser(function(obj, cb) {
    cb(null, user);
});
// Load Passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
const FacebookStrategy = require('./server/passport/passport-facebook');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);
passport.use('facebook', FacebookStrategy);

// Pass the authentication checker middleware
const authCheckMiddleware = require('./server/middleware/auth-check');
app.use('/api', authCheckMiddleware);


// CATCH ALL needed to use BrowserHistory with reactRouter
// Doesn't work because it's interfering with other server routing
/*
app.get('/success*', function (request, response) {
	response.sendFile(path.resolve('./server/static/index.html'));
});
*/

// Routes
const authRoutes = require('./server/routes/auth');
const apiRoutes = require('./server/routes/api');
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
    console.log('Server is running on http://localhost:8080');
});

