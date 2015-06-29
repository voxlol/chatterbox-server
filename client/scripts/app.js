var app = {
  room : 'default',
  friends : {}
};
app.init = function(){
  app.fetch()
  //Refresh button clears the page and fetches update
  $('.refresh').on('click', function() {
    app.fetch();
  });

  $('.input').focus().select();

  $('#submit_message').on('click', function() {
    app.send(app.createMessage($('.input').val()));
  });

  $('.chatrooms').on('click', function() {
    $('.message').hide();
    $($(event.target).attr('class')).show();
    app.room = $(event.target).attr('class').slice(1).replace(/[^A-Za-z0-9]/g,'');
    $('#current_chat').text(app.room)
  })

  $('#chatroom_submit').on('click', function() {
    app.room = $('#chatroom_input').val().replace(/[^A-Za-z0-9]/g,'');
    $('.message').hide();
    $('.'+app.room).show();
    $('#current_chat').text('Your current chatroom is '+app.room)
  })
}

app.fetch = function() {
  app.clearMessages();
  $.ajax({
  // This is the url you should use to communicate with the parse API server.
  url: 'http://127.0.0.1:3000/classes/room1',
  type: 'GET',
  // data: JSON.stringify(message),
  // contentType: 'application/json',
  success: function (data) {
    _.each(data['results'], function (post){
      //Sanitize messages
      var text = bleach.sanitize(post.message);
      var user = bleach.sanitize(post.username).replace(/[^A-Za-z0-9]/g,'');
      var room = bleach.sanitize(post.roomname).replace(/[^A-Za-z0-9]/g,'');

      //Remove empty messages
      if(!(user === 'undefined' || text === 'undefined' || user === '' || text === '')) {
        //Appends messages to a empty div inside main
        $('#messageHanger').append("<div id = chats username = "+user+" class = \"message "+room+" "+user+"\">"+user+":"+text+"  </div>").attr(user)
        //Toggles friends on click
        $('.message').on('click', function() {
          app.room = $(event.target).attr('username').replace(/[^A-Za-z0-9]/g,'');
          if ($(event.target).hasClass('friend')) {
            app.friends[$(event.target).attr('username')] = false;
            $('.'+$(event.target).attr('username')).removeClass('friend');
          } else {
            app.friends[$(event.target).attr('username')] = true;
            $('.'+$(event.target).attr('username')).addClass('friend');
          }
        })
      }
      //Adds room buttons
      if(room !== 'undefined' && document.getElementById('#'+room) === null && room !== '') {
        $('.chatrooms').append("<button type = button id = #"+room+" class = ."+room+">"+room+"</button>")
      }
    })
    console.log('chatterbox: Message recieved');
  },
  error: function (data) {
    console.error('chatterbox: Failed to recieve');
  }
})};

app.createMessage = function(text) {
  var message = {}

  message.username = window.location.search.slice(10);
  message.message = text;
  message.roomname = app.room;

  return message;
}

app.clearMessages = function() {
  $('.message').remove();
}

app.addMessage = function (message) {
  var text = bleach.sanitize(message.message);
  var user = bleach.sanitize(message.username);
  if(!(user === 'undefined' || text === 'undefined')) {
    $('body').append("<div id = chats>"+user+":"+text+"</div>")
  }
}

app.send = function(message) {
  debugger;
  $.ajax({
    url: 'http://127.0.0.1:3000/classes/room1',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  app.fetch();
}

$(document).ready(function(){
  app.init();
})
