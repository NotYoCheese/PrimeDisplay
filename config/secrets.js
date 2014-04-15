module.exports = {
  db: 'mongodb://node-test:reX7MTcDVp16@ds033629.mongolab.com:33629/node-test',

  sessionSecret: "reX7MTcDVp16reX7MTcDVp16",

  localAuth: true,

  googlePageSpeed: {
    apiKey: 'AIzaSyAOvKPPQgN53SbANdmkXYo4Lqi0FEzetfs'
  },
  
  mailgun: {
    login: 'Your Mailgun SMTP Username',
    password: 'Your Mailgun SMTP Password'
  },

  sendgrid: {
    user: 'Your SendGrid Username',
    password: 'Your SendGrid Password'
  },

  gmail: {
    user: 'Your Gmail Username',
    password: 'Your Gmail Password'
  },

  nyt: {
    key: 'Your New York Times API Key'
  },

  lastfm: {
    api_key: 'Your API Key',
    secret: 'Your API Secret'
  },

  facebookAuth: true,
  facebook: {
    clientID: 'Your App ID',
    clientSecret: 'Your App Secret',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  githubAuth: true,
  github: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitterAuth: true,
  twitter: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  googleAuth: true,
  google: {
    clientID: '142664224591-88dt7n9rqjl3d90pvlgjtfo50brn2rus.apps.googleusercontent.com',
    clientSecret: 'uxquGEo1yKkrwtN4zbXw5QC7',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

  linkedinAuth: true,
  linkedin: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/linkedin/callback',
    scope: ['r_fullprofile', 'r_emailaddress', 'r_network'],
    passReqToCallback: true
  },

  steam: {
    apiKey: 'Your Steam API Key'
  },

  twilio: {
    sid: 'Your Twilio SID',
    token: 'Your Twilio token'
  },

  clockwork: {
    apiKey: 'Your Clockwork SMS API Key'
  },

  tumblr: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/tumblr/callback'
  },

  foursquare: {
    clientId: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    redirectUrl: 'http://localhost:3000/auth/foursquare/callback'
  },

  venmo: {
    clientId: 'Your Venmo Client ID',
    clientSecret: 'Your Venmo Client Secret',
    redirectUrl: 'http://localhost:3000/auth/venmo/callback'
  },

  paypal: {
    host: 'api.sandbox.paypal.com', // or api.paypal.com
    client_id: 'Your Client ID',
    client_secret: 'Your Client Secret',
    returnUrl: 'http://localhost:3000/api/paypal/success',
    cancelUrl: 'http://localhost:3000/api/paypal/cancel'
  }
};
