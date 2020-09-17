require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;

const findOrCreate = require('mongoose-findorcreate');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Initialise the session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Initialise passport's session for authentication
app.use(passport.initialize());
app.use(passport.session());

// Connect to the database
mongoose.connect('mongodb://localhost:27017/secretsDB', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Create the user schema
const userSchema = new mongoose.Schema({
  username: String,
  googleId: String,
  facebookId: String
});

// The hashed password of the user is stored to the database
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Create the model for the database
const User = new mongoose.model('User', userSchema);

// The local authentication strategy
passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Setup the google authentication strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/maskradio',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return cb(err, user);
    });
  }
));

// Setup the facebook authentication strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/maskradio"
  },
  (accessToken, refreshToken, profile, cb) => {
    User.findOrCreate({ facebookId: profile.id }, (err, user) => {
      return cb(err, user);
    });
  }
));

// The authentication via google routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/maskradio',
  passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  }
);

// The authentication via facebook routes
app.get('/auth/facebook',
  passport.authenticate('facebook')
);


app.get('/auth/facebook/maskradio',
  passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  }
);

// The home route displays the home page
app.get('/', (req, res) => {
  res.render('home')
});

/*
 * The login route has the following methods:
 * GET  - displays the login page
 * POST - authenticates the user's username and password via the local strategy
 *        and if successful redirects the user to the secrets page.
 */
app.route('/login')
  .get((req, res) => {
    res.render('login-register', { action: 'Login' });
  })
  .post(
    passport.authenticate('local',
    {
      successRedirect: '/secrets',
      failureRedirect: '/login'
    })
  );

  /*
   * The login route has the following methods:
   * GET  - displays the register page
   * POST - stores the user's username and hashed password to the database and
   *        if successful redirects the user to the secrets page
   */
app.route('/register')
  .get((req, res) => {
    res.render('login-register', { action: 'Register' });
  })
  .post(async(req, res) => {
    const registered = await User.register(new User({ username: req.body.username }), req.body.password);
    if (registered) {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      });
    } else {
      res.redirect('/register');
    }

  });

// The secrets route displays the secrets page only if the user is authenticated
app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('secrets');
  } else {
    res.redirect('/');
  }
});

app.get('/submit', (req, res) => {
  if (req.isAuthenticated()) {
    res.render('submit');
  } else {
    res.redirect('/');
  }
});

// The logout route deletes the user's session cookie and redirects him to the home page
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.listen(3000, () => {
  console.log('Server started on port 3000..');
});
