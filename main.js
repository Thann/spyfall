
var MODERATOR_CHANNEL_ID = 'thannSpyfall-'// + window.RMCDefaultChannel;

var MODERATOR_SESSION_ID = 'XYZ';    // room-id
var MODERATOR_ID         = 'HOST';    // user-id
var MODERATOR_SESSION    = {         // media-type
  //audio: true,
  //video: true,
  data:  true
};

var role;
var rtcmulti;

var locations = ['car', 'boat', 'plane']

// moderator
document.getElementById('open-room').onclick = function() {
  role='moderator'

  rtcmulti = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
  rtcmulti.session = MODERATOR_SESSION;
  rtcmulti.userid = MODERATOR_ID;
  rtcmulti.extra = {name: $('#name').val()}; //MODERATOR_EXTRA;
  rtcmulti.open({
      dontTransmit: true,
      sessionid: MODERATOR_SESSION_ID
  });
  setup()
};

// participants
document.getElementById('join-room').onclick = function() {
  role='partcipant'

  rtcmulti = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
  rtcmulti.join({
      sessionid: MODERATOR_SESSION_ID,
      userid: MODERATOR_ID,
      //TODO: this doesnt work
      extra: {name: $('#name').val()},
      session: MODERATOR_SESSION
  });
  setup()
};

function setup() {
  document.rtcmulti = rtcmulti;

  $('body').removeClass('start');
  $('body').addClass('join');
  $('input#name').prop('disabled', true);

  // On connection to host.
  rtcmulti.onconnected = function(e) {
    console.log("Connected to host:", e)
    e.peer.onCustomMessage = function(m) {
      console.log("Recieved Custom Msg", m)
      start_game( m.loc )
    }
  }

  rtcmulti.onmessage = function(e) {
    console.log('MESSAGE', e.data)
    if (e.data.type == 'message') add_message(e)
  }

  rtcmulti.onopen = function(e) {
    console.log("User Joined:", e.userid, e.extra)
    new_member = $('#join-box #members .template').clone().
      prependTo($('#join-box #members')).removeClass('template').
      attr('user_id', e.user).
      find('#name').
        html(' ->['+e.userid+'] ' + e.extra.name);
  }

  $('button#send').click(function(e) {
    txt_box = $('#chat-box textarea')
    console.log("trying to send", txt_box.val())
    rtcmulti.send({type: 'message', message: txt_box.val()})
    txt-box.val('')
  });

  $('#join-box #title').html('('+role+')')
  if (role == 'moderator') $('body').addClass('host')

  $('#join-box #start').click(function() {
    loc = _.sample(locations)
    spy_id = _.sample(_.keys(rtcmulti.peers))
    console.log('LLL',loc,spy_id)
    _.each(rtcmulti.peers, function(p, id) {
      if (id == spy_id) {
        if (p.userid) p.sendCustomMessage({loc: "You're the Spy!!"})
        else start_game( "You're the Spy!!" )
      } else {
        if (p.userid) p.sendCustomMessage({loc: loc})
        else start_game( loc )
      }
    })
  })
}

function start_game(e) {
  console.log('starting_game..', e)
  $('#game-box').html(e)
}

