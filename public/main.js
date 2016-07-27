'use strict';

$('.deletebtn').click(function(evt) {
  var tweetId = evt.toElement.dataset.tweetId;
  $.ajax({
    url: '/tweets/' + tweetId,
    method: 'DELETE',
    success: function(result) {
      $('#tweet' + tweetId).remove();
    }
  })
});

$('#submitEditBtn').click(function(evt) {
  var tweetId = evt.toElement.dataset.tweetId;
  var $edit_text_field = $('#edit_text_field');
  var newText = $edit_text_field[0].value;

  $.ajax({
    url: '/tweets/' + tweetId,
    method: 'PUT',
    data: {text: newText},
    success: function(editedTweet) {
      window.location.href = '/tweets/' + editedTweet.id;
    }
  })
});

// Load the socket.io library above, then connect to the server.
// Because the socket.io server is being run on the same server as your
// Express instance, you can connect() without any arguments.
var socket = io.connect();
socket.on('connect', function(){
  console.log('connected to server via WebSockets!');
});
// best practice with jQuery: find selection once, not every time a func runs
var $tweets = $('#tweets');
// When 'new_tweet' events are fired, do something with the packaged tweet
socket.on('new_tweet', function (tweet) {
  $tweets.append('<div class="tweetbox"><img src="'+ tweet.profilePicUrl + '"><div class="content"><p class="by"><a href="/users/' + tweet.name + '">' + tweet.name + '</a></p><p><a href="/tweets/' + tweet.id + '">' + tweet.text + '</a></p></div></div>');
});

socket.on('tweet_deleted', function (data) {
  var tweetId = data.tweetId;
  $('#tweet' + tweetId).remove();
});
