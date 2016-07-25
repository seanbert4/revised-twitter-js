'use strict';

$('#deletebtn').click(function(evt) {
  console.log('evt:', evt);
  console.log('evt.toElement.dataset:', evt.toElement.dataset.tweetId);
});
