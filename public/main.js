'use strict';

$('#filterbtn').click(function(evt) {
  var $keyword = $('#search-bar')[0][0].value();
  $.get('/tweets?keyword=' + $keyword);
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

var assignClickHandlersToDeleteBtns = function(selector) {
  $(selector).click(function(evt) {
    var tweetId = evt.toElement.dataset.tweetId;
    $.ajax({
      url: '/tweets/' + tweetId,
      method: 'DELETE',
      success: function(result) {
        $('#tweet' + tweetId).remove();
      }
    })
  });
};

assignClickHandlersToDeleteBtns('.deletebtn');

var generateTweetHtml = function(tweet) {
  return '<div class="tweetbox" id="tweet' + tweet.id + '">' +
            '<img src="'+ tweet.profilePicUrl + '">' +
            '<div class="content">' +
              '<p class="by"><a href="/users/'+ tweet.name + '">' + tweet.name + '</a></p>' +
              '<p><a href="/tweets/' + tweet.id + '">' + tweet.text + '</a></p>' +
            '</div>' +
            '<span>' +
              '<a href="/tweets/' + tweet.id + '/edit"><button type="button">Edit</button></a>' +
              '<button type="button" data-tweet-id="' + tweet.id + '" class="deletebtn">Delete</button>' +
            '</span>' +
          '</div>';
};

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
  var tweetHtml = generateTweetHtml(tweet);
  $tweets.append(tweetHtml);
  assignClickHandlersToDeleteBtns('#tweet' + tweet.id + ' .deletebtn');
});

socket.on('tweet_edited', function(tweet) {
  var $tweet = $('#tweet' + tweet.id);
  var tweetHtml = generateTweetHtml(tweet);
  $tweet.replaceWith(tweetHtml);
  assignClickHandlersToDeleteBtns('#tweet' + tweet.id + ' .deletebtn');
})

socket.on('tweet_deleted', function (data) {
  var tweetId = data.tweetId;
  $('#tweet' + tweetId).remove();
})
