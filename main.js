var MODERATOR_CHANNEL_ID = 'thannSpyfall-'// + window.RMCDefaultChannel;

var MODERATOR_SESSION_ID = 'XYZ';    // room-id
var MODERATOR_ID         = 'JKL';    // user-id
var MODERATOR_SESSION    = {         // media-type
  //audio: true,
  //video: true,
  data:  true
};
var MODERATOR_EXTRA      = {};       // empty extra-data

var role;
var rtcmulti;

// moderator
document.getElementById('open-room').onclick = function() {
  role='moderator'

  rtcmulti = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
  rtcmulti.session = MODERATOR_SESSION;
  rtcmulti.userid = MODERATOR_ID;
  rtcmulti.extra = MODERATOR_EXTRA;
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
      extra: MODERATOR_EXTRA,
      session: MODERATOR_SESSION
  });
  setup()
};

function setup() {
  document.rtcmulti = rtcmulti;
  /*
  rtcmulti.onNewSession = function(session) {
    session.join();
  }

  rtcmulti.onmessage = function(e) {
    console.log('MESSAGE', e.data)
  }

  rtcmulti.oncustommessage = function(e) {
    console.log('CC_MESSAGE', e.data)
  }
  */

  $('body').toggleClass('start');
  $('button#send').click(function(e) {
    console.log("trying to send")
    rtcmulti.send({blah: 'woot'})
  });
}

