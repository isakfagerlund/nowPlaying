const express = require('express');
const next = require('next');
const url = require('url');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const request = require('request'); // "Request" library
const { generateRandomString } = require('./lib/generateString');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = dev ? 'http://localhost:3000/callback' : process.env.REDIRECT_URI; // Your redirect uri

const stateKey = 'spotify_auth_state';

app.prepare().then(() => {
  const server = express();


  server.use(express.static(`${__dirname}/public`))
    .use(cors())
    .use(cookieParser());

  server.get('/', (req, res) => {
    res.redirect('/login');
  });

  server.get('/login', (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    const scope = 'user-read-private user-read-email user-read-playback-state';
    res.redirect(`https://accounts.spotify.com/authorize?${
      querystring.stringify({
        response_type: 'code',
        client_id,
        scope,
        redirect_uri,
        state,
      })}`);
  });

  server.get('/callback', (req, res) => {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(`http://localhost:3000/#${
        querystring.stringify({
          error: 'state_mismatch',
        })}`);
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code,
          redirect_uri,
          grant_type: 'authorization_code',
        },
        headers: {
          Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}`,
        },
        json: true,
      };

      request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const { access_token } = body;
          const { refresh_token } = body;

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { Authorization: `Bearer ${access_token}` },
            json: true,
          };

          // use the access token to access the Spotify Web API
          request.get(options, (error, response, body) => {
            console.log(body);
          });

          // we can also pass the token to the browser to make requests from there
          // res.redirect(`/#${
          //   querystring.stringify({
          //     access_token,
          //     refresh_token,
          //   })}`);
          app.render(req, res, '/', { token: access_token });
        } else {
          res.redirect(`/#${
            querystring.stringify({
              error: 'invalid_token',
            })}`);
        }
      });
    }
  });

  server.get('/refresh_token', (req, res) => {
    // requesting access token from refresh token
    const { refresh_token } = req.query;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { Authorization: `Basic ${new Buffer(`${client_id}:${client_secret}`).toString('base64')}` },
      form: {
        grant_type: 'refresh_token',
        refresh_token,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const { access_token } = body;
        res.send({
          access_token,
        });
      }
    });
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
