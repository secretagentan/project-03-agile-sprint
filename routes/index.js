const express = require('express')
const router = express.Router();
const request = require('request');
const Handlebars = require('handlebars');

const redirect_uri = 'http://127.0.0.1:3000/authorized';

router.get('/', (req, res, next) => {
  Handlebars.registerPartial('myFirstPartial', '{{blogFeed}}')
  res.render('index', {title: 'TAJJ Ma BLOG'});
});

router.get('/login', (req, res, next) =>{
  const client_id = process.env.GITHUB_CLIENT_ID;
  const redirect_url = 'https://github.com/login/oauth/authorize';
  const scope = 'profile email';
  const state = 'JJAT';
  const queryParams = `?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}`;
    res.redirect(redirect_url + queryParams);
});

router.get('/authorized', (req, res, next) =>{
  const code = req.query.code;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env. GITHUB_CLIENT_SECRET;
  const state = req.query.state;

  const options = {
    method: 'POST',
    url: 'https://github.com/login/oauth/access_token',
    code: code,
    client_id: client_id,
    client_secret: client_secret,
    redirect_uri: redirect_uri,
    state: state
  }
  request(options, (err, response, body) =>{
    if(response.statusCode === 200){
      req.session.access_token = body.access_token;
      res.redirect('/active');
    } // else {
    //   console.log('I am the error: ' + err);
    //   res.json(body);
    // }
  });

});

router.get('/active', (req, res, next) => {
  res.render('active', {title: 'TAJJ Ma BLOG'});
});

router.get('/profile', (req, res, next) => {

})


module.exports = router
