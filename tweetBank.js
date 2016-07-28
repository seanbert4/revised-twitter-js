'use strict';

var _ = require('lodash');
var data = [];
var id = 0;

function add (name, text) {
  var profilePicUrl = getProfilePicUrl(name);
  var tag = text.split("#")[1];
  data.push({ name: name, profilePicUrl: profilePicUrl, text: text, tag: tag, id: id++ });
  return _.clone(data[data.length - 1]);
}

function list () {
  return _.cloneDeep(data);
}

function find (properties) {
  return _.cloneDeep(_.filter(data, properties));
}

function update (tweetId, newText) {
  if (!data[tweetId]) return null;
  data[tweetId].text = newText;
  return data[tweetId];
};

function remove(tweetId) {
  var tweetToRemove = find({id: Number(tweetId)})[0];
  if (!tweetToRemove) return 'Tweet not found';
  _.remove(data, tweetToRemove);
  return 'Tweet deleted';
}

module.exports = { add: add, list: list, find: find, update: update, remove: remove};

var randArrayEl = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

var getFakeName = function() {
  var fakeFirsts = ['Nimit', 'David', 'Shanna', 'Scott', 'Ayana', 'Omri', 'Gabriel', 'Joe', 'Ben', 'Karen', 'Dan', 'Ashi', 'Cang'];
  var fakeLasts = ['Hashington', 'Stackson', 'McQueue', 'OLogn', 'Ternary', 'Claujure', 'Dunderproto', 'Binder', 'Docsreader', 'Ecma'];
  return randArrayEl(fakeFirsts) + " " + randArrayEl(fakeLasts);
};

var getFakeTweet = function() {
  var awesome_adj = ['awesome', 'breathtaking', 'amazing', 'funny', 'sweet', 'cool', 'wonderful', 'mindblowing'];
  var campuses = ['Fullstack Academy', 'Grace Hopper Academy'];
  var tags = ['#fullstacklove',
              '#codedreams',
              '#obsessed',
              '#strongfeels',
              '#gracehopperlove',
              '#codeisbae',
              '#fullstackismyfriend',
              '#gracehopperismyfriend',
              '#cleancode',
              '#staffarecodeninjas',
              '#feelthebson',
              '#makeJSgreatagain',
              '#testfirsttalklater'];
  return randArrayEl(campuses)+ " is " + randArrayEl(awesome_adj) + "! The instructors are just so " + randArrayEl(awesome_adj) + ". " + randArrayEl(tags);
};

//Receives a string and hashes it to a number between 1 and 99
var simpleHash = function(string) {
  return string.split('')
  .map(function(char) {
    return char.charCodeAt(0)
  })
  .reduce(function(sum, nextCharCode) {
    return sum + nextCharCode;
  }) % 99;
};

var getProfilePicUrl = function(fullName) {
  var firstName = fullName.split(' ')[0];
  var femaleNames = ['Shanna', 'Ayana', 'Karen', 'Ashi', 'Cang'];
  var gender = femaleNames.indexOf(firstName) > -1 ? 'women' : 'men';
  var picNum = simpleHash(fullName);
  return 'https://randomuser.me/api/portraits/thumb/' + gender + '/' + picNum + '.jpg';
};

for (var i = 0; i < 10; i++) {
  module.exports.add( getFakeName(), getFakeTweet() );
}
