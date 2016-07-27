'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    var allTheTweets = tweetBank.list();
    res.render('index', {
      title: 'Twitter.js',
      tweets: allTheTweets,
      showForm: true
    });
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  router.get('/filteredTweets', function(req, res, next) {
    req.params
  });

  // single-user page
  router.get('/users/:username', function(req, res, next){
    var tweetsForName = tweetBank.find({ name: req.params.username });
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsForName,
      showForm: true,
      username: req.params.username
    });
  });

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
    var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
    res.render('index', {
      title: 'Twitter.js',
      tweets: tweetsWithThatId // an array of only one element ;-)
    });
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
    var newTweet = tweetBank.add(req.body.name, req.body.text);
    io.sockets.emit('new_tweet', newTweet);
    res.redirect('/');
  });

    // navigates user to the single-tweet edit page
  router.get('/tweets/:id/edit', function(req, res, next){
    var tweetToEdit = tweetBank.find({ id: Number(req.params.id)})[0];
    res.render('index', {
      title: 'Twitter.js',
      tweets: [], //Hacky way to say: don't show any tweets!
      showEditForm: true,
      tweetToEdit: tweetToEdit
    });
  });

    // edits the tweet
  router.put('/tweets/:id', function(req, res, next){
    var editedTweet = tweetBank.update(req.params.id, req.body.text);
    res.json(editedTweet);
    io.sockets.emit('tweet_edited', editedTweet);
  });

    // deletes a tweet
  router.delete('/tweets/:id', function(req, res, next){
    var removeResult = tweetBank.remove(req.params.id);
    if (removeResult === 'Tweet deleted') {
      res.status(201).send();
      io.sockets.emit('tweet_deleted', {tweetId: req.params.id});
    }
  });

  return router;
}
