(function(app) {
  var compile = app.compile,
      $ = app.$,
      uuid = app.uuid,

      selfPhotoLocation = { x: 464, y: 448 },
      selfPhotoRadius = 147,
      friendsPhotoSpecs = [
        { x: 700, y: 700, circleborderWidth: 6, rayWidth: 6, radius: 120 },
        { x: 250, y: 150, circleborderWidth: 6, rayWidth: 6, radius: 111 },
        { x: 200, y: 720, circleborderWidth: 3, rayWidth: 3, radius: 105 },
        { x: 600, y: 160, circleborderWidth: 3, rayWidth: 3, radius: 90 },
        { x: 100, y: 500, circleborderWidth: 3, rayWidth: 3, radius: 81 }
      ],
      textTemplate = compile($('#slide-3-template-text').html());

  friendsPhotoSpecs = calculateLinesFromSelfToFriend(friendsPhotoSpecs);

  function calculateLinesFromSelfToFriend(friendsPhotoSpecs) {
    friendsPhotoSpecs.forEach(function(spec) {
      spec.lineX0 = spec.x;
      spec.lineY0 = spec.y;
      spec.lineX1 = selfPhotoLocation.x;
      spec.lineY1 = selfPhotoLocation.y;
    });
    return friendsPhotoSpecs;
  }

  function SelfPhoto(imgUrl) { this.url = imgUrl; }
  SelfPhoto.template = compile($('#slide-3-template-self-photo').html());
  SelfPhoto.location = { x: 464, y: 448 };
  SelfPhoto.radius = 150;
  SelfPhoto.diameter = 2 * SelfPhoto.radius;

  SelfPhoto.prototype.compileToHTML = function() {
    var data = {
      patternId: uuid(),
      url: this.url,
      radius: SelfPhoto.radius,
      diameter: SelfPhoto.diameter,
      x: SelfPhoto.location.x,
      y: SelfPhoto.location.y
    };
    return SelfPhoto.template(data);
  };

  function FriendPhoto(imgUrl, location, radius) {
    this.id = uuid();
    this.url = imgUrl;
    this.location = location;
    this.radius = radius;
  }
  FriendPhoto.template = compile($('#slide-3-template-friend-photo').html());

  FriendPhoto.prototype.compileToHTML = function() {
    var data = {
      id: this.id,
      patternId: uuid(),
      url: this.url,
      radius: this.radius,
      diameter: 2 * this.radius,
      x: this.location.x,
      y: this.location.y
    };
    return FriendPhoto.template(data);
  };

  FriendPhoto.prototype.present = function(duration, delay) {
    var id = this.id, r = this.radius, loc = this.location,
        animateId = setTimeout(function() {
          $('#' + id)
            .css('display', '')
            .velocity({ translateX: loc.x, translateY: loc.y }, {duration: 0})
            .velocity({ r: r }, {
              duration: duration,
              delay: delay
            });
        }, delay);
    return {
      stop: function() {
        clearTimeout(animateId);
        $('#' + id).velocity('stop', true);
        $('#' + id).css('display', 'none');
      }
    };
  };



  app.addSlide('slide-3', {
    onCreate: function() {
      var selfImgUrl = this.context && this.context.userData && this.context.userData.avatar_url,
          selfPhoto = new SelfPhoto(selfImgUrl);

      this.photosContainer = $('#slide-3-self-photo', this.domEl)[0];
      this.photosContainer.innerHTML = selfPhoto.compileToHTML();

      $('#slide-3-text')[0].innerHTML = textTemplate(this.context);
      this.$summary = $('#slide-3-text-summary', this.domEl);
      this.$yuepao = $('#slide-3-text-yuepao', this.domEl);
    },
    onEnter: function() {
      var dt = this.context.avatarShowDuration || 200,
           friendsList = this.context && this.context.userData &&
            this.context.userData.friendsinfo &&
            this.context.userData.friendsinfo.friendslist || [];

      $('text', this.$summary).velocity({
        opacity: 1.0
      }, {
        duration: 1500
      });

      this.friendsPhotos = [];
      this.friendsPhotoContainer = $('#slide-3-friend-photos', this.domEl)[0];
      friendsList = friendsList.slice(0, 5);

      friendsList.forEach(function(p, i) {
        var url = p.avatar_url,
            photo = new FriendPhoto(
              url,
              { x: friendsPhotoSpecs[i].x, y: friendsPhotoSpecs[i].y },
              friendsPhotoSpecs[i].radius
            ),
            html = photo.compileToHTML();
        this.friendsPhotoContainer.innerHTML += html;
        this.friendsPhotos.push(photo);
      }, this);

      this.animationHandles = [];

      this.friendsPhotos.forEach(function(p, i) {
        this.animationHandles.push(p.present(dt, dt * i));
      }, this);

      $('text', this.$yuepao).velocity({
        opacity: 1.0
      }, {
        delay: 1500,
        duration: 800
      });

    },
    onExit: function() {
      this.animationHandles.forEach(function(h) {
        h.stop();
      });
      this.friendsPhotoContainer.innerHTML = '';

      // TODO: does not reset the style.opactiy
      $('text', this.$yuepao).velocity('stop', true);
      $('text', this.$yuepao)[0].opacity = 0.0;

      $('text', this.$summary).velocity('stop', true);
      $('text', this.$summary)[0].opacity = 0.0;
    }
  });
})(app);
