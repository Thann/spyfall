
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

var occupations = {
  "airplane": [ "first class passenger", "air marshall", "mechanic", "air hostess", "copilot", "captain", "economy class passenger" ],
  "bank": [ "armored car driver", "manager", "consultant", "robber", "security guard", "teller", "customer" ],
  "beach": [ "beach waitress", "kite surfer", "lifeguard", "thief", "beach photographer", "ice cream truck driver", "beach goer" ],
  "casino": [ "bartender", "head security guard", "bouncer", "manager", "hustler", "dealer", "gambler" ],
  "cathedral": [ "priest", "beggar", "sinner", "tourist", "sponsor", "chorister", "parishioner" ],
  "circus tent": [ "acrobat", "animal trainer", "magician", "fire eater", "clown", "juggler", "visitor" ],
  "corporate party": [ "entertainer", "manager", "unwanted guest", "owner", "secretary", "delivery boy", "accountant" ],
  "crusader army": [ "monk", "imprisoned saracen", "servant", "bishop", "squire", "archer", "knight" ],
  "day spa": [ "stylist", "masseuse", "manicurist", "makeup artist", "dermatologist", "beautician", "customer" ],
  "embassy": [ "security guard", "secretary", "ambassador", "tourist", "refugee", "diplomat", "government official" ],
  "hospital": [ "nurse", "doctor", "anesthesiologist", "intern", "therapist", "surgeon", "patient" ],
  "hotel": [ "doorman", "security guard", "manager", "housekeeper", "bartender", "bellman", "customer" ],
  "military base": [ "deserter", "colonel", "medic", "sniper", "officer", "tank engineer", "soldier" ],
  "movie studio": [ "stunt man", "sound engineer", "camera man", "director", "costume artist", "producer", "actor" ],
  "ocean liner": [ "cook", "captain", "bartender", "musician", "waiter", "mechanic", "rich passenger" ],
  "passenger train": [ "mechanic", "border patrol", "train attendant", "restaurant chef", "train driver", "stoker", "passenger" ],
  "pirate ship": [ "cook", "slave", "cannoneer", "tied up prisoner", "cabin boy", "brave captain", "sailor" ],
  "polar station": [ "medic", "expedition leader", "biologist", "radioman", "hydrologist", "meteorologist", "geologist" ],
  "police station": [ "detective", "lawyer", "journalist", "criminalist", "archivist", "criminal", "patrol officer" ],
  "restaurant": [ "musician", "bouncer", "hostess", "head chef", "food critic", "waiter", "customer" ],
  "school": [ "gym teacher", "principal", "security guard", "janitor", "cafeteria lady", "maintenance man", "student" ],
  "service station": [ "manager", "tire specialist", "biker", "car owner", "car wash operator", "electrician", "auto mechanic" ],
  "space station": [ "engineer", "alien", "pilot", "commander", "scientist", "doctor", "space tourist" ],
  "submarine": [ "cook", "commander", "sonar technician", "electronics technician", "radioman", "navigator", "sailor" ],
  "supermarket": [ "cashier", "butcher", "janitor", "security guard", "food sample demonstrator", "shelf stocker", "customer" ],
  "theater": [ "coat check lady", "prompter", "cashier", "director", "actor", "crew man", "audience member" ],
  "university": [ "graduate student", "professor", "dean", "psychologist", "maintenance man", "janitor", "student" ],
  "world war ii squad": [ "resistance fighter", "radioman", "scout", "medic", "cook", "imprisoned nazi", "soldier" ]
}

var locations = _.keys(occupations)

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

