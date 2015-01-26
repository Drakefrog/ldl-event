(function(app) {
  var $ = app.$,
      d3 = app.d3,
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
      ORANGE = '#FF7E00';
  // compile = app.compile,
  // textTemplate = compile($('#slide-3-template-text').html());

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

  function SelfPhoto(imgUrl) {
    this.uid = uuid();
    this.url = imgUrl;
  }
  // SelfPhoto.template = compile($('#slide-3-template-self-photo').html());
  SelfPhoto.location = { x: 464, y: 448 };
  SelfPhoto.radius = 150;
  SelfPhoto.diameter = 2 * SelfPhoto.radius;

  SelfPhoto.prototype.addToDOM = function(el) {
    var patternId = this.uid,
        r = SelfPhoto.radius,
        d = 2*r,
        url = this.url,
        x = SelfPhoto.location.x,
        y = SelfPhoto.location.y;

    d3.select(el)
      .append('defs')
      .append('pattern').attr('id', patternId).attr('x', -r).attr('y', -r)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', d)
      .attr('height', d)
      .append('image')
      .attr('x', 0).attr('x', 0)
      .attr('width', d).attr('height', d)
      .attr('xlink:href', url);

    d3.select(el)
      .append('circle')
      .attr('transform', 'translate(' + [x, y] + ')')
      .attr('r', r)
      .attr('fill', 'url(#' + patternId + ')');
  };

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

  function FriendPhoto(imgUrl, location, radius, circleborderWidth, rayWidth) {
    this.id = uuid();
    this.url = imgUrl;
    this.location = location;
    this.radius = radius;
    this.circleborderWidth = circleborderWidth;
    this.rayWidth = rayWidth;
  }
  // FriendPhoto.template = compile($('#slide-3-template-friend-photo').html());

  FriendPhoto.prototype.addToDOM = function(el) {
    var id = this.id,
        patternId = uuid(),
        r = this.radius,
        d = 2*r,
        url = this.url,
        x = this.location.x,
        y = this.location.y;

    d3.select(el)
      .append('defs')
      .append('pattern').attr('id', patternId).attr('x', -r).attr('y', -r)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', d)
      .attr('height', d)
      .append('image')
      .attr('x', 0).attr('x', 0)
      .attr('width', d).attr('height', d)
      .attr('xlink:href', url);

    d3.select(el)
      .append('circle')
      .attr('id', id)
      .attr('transform', 'translate(' + [x, y] + ')')
      .attr('r', 0)
      .attr('fill', 'url(#' + patternId + ')')
      .attr('stroke', ORANGE)
      .attr('stroke-width', this.circleborderWidth);

    var cx = 460, cy = 450, dx = x - cx, dy = y - cy, l = Math.sqrt(dx*dx+dy*dy);
    var cos = dx/l, sin = dy/l;
    var rSelfPhoto = 170;
    var x1 = cx + rSelfPhoto*cos, y1 = cy + rSelfPhoto*sin;
    var x2 = x - r*cos, y2 = y - r*sin;

    d3.select(el)
      .append('line')
      .attr('id', this.id + '-line')
      .attr('stroke-width', this.rayWidth)
      .attr('stroke', ORANGE)
      .attr('visibility', 'hidden')
      .attr('x1', x1)
      .attr('y1', y1)
      .attr('x2', x2)
      .attr('y2', y2);
  };

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
        lineAnimateId,
        animateId = setTimeout(function() {
          $('#' + id)
            .css('display', '')
            .velocity({ translateX: loc.x, translateY: loc.y }, {duration: 0})
            .velocity({ r: r }, {
              duration: duration,
              delay: delay,
              easing: [300, 20],
              complete: function() {
                $('#' + id + '-line').attr('visibility', 'visible');
              }
            });
        }, delay);
    return {
      stop: function() {
        clearTimeout(animateId);
        clearTimeout(lineAnimateId);
        $('#' + id).velocity('stop', true);
        $('#' + id).css('display', 'none');
      }
    };
  };

  app.addSlide('slide-3', {
    onCreate: function() {
      var selfImgUrl = this.context && this.context.userData && this.context.userData.avatar_url,
          selfPhoto = new SelfPhoto(selfImgUrl),
          friendsList = this.context && this.context.userData &&
            this.context.userData.friendsinfo &&
            this.context.userData.friendsinfo.friendslist || [];

      this.photosContainer = $('#slide-3-self-photo', this.domEl)[0];
      selfPhoto.addToDOM(this.photosContainer);

      d3.select('#slide-3-friends-count')
        .text(' ' + this.context.userData.friendsinfo.friends_count + ' ');

      d3.select('#slide-3-friends-rank')
        .text(' ' + this.context.userData.friendsinfo.friendsrank + ' ');

      this.$summary = $('#slide-3-text-summary', this.domEl);
      this.$yuepao = $('#slide-3-text-yuepao', this.domEl);


      this.friendsPhotos = [];
      // this.friendsPhotoContainer = $('#slide-3-friend-photos', this.domEl)[0];
      friendsList = friendsList.slice(0, 5);

      friendsList.forEach(function(p, i) {
        var url = p.avatar_url,
            photo = new FriendPhoto(
              url,
              { x: friendsPhotoSpecs[i].x, y: friendsPhotoSpecs[i].y },
              friendsPhotoSpecs[i].radius,
              friendsPhotoSpecs[i].circleborderWidth,
              friendsPhotoSpecs[i].rayWidth
            );
        // html = photo.compileToHTML();

        photo.addToDOM('#slide-3-friend-photos');

        // this.friendsPhotoContainer.innerHTML += html;
        this.friendsPhotos.push(photo);
      }, this);
    },
    onEnter: function() {
      // TODO: clean up use d3
      var dt = this.context.avatarShowDuration || 200,
          ss = this.ss,
          friendsList = this.context && this.context.userData &&
            this.context.userData.friendsinfo &&
            this.context.userData.friendsinfo.friendslist || [];

      $(this.$summary).velocity({
        opacity: 1.0
      }, {
        duration: 1500
      });

      // this.friendsPhotos = [];
      // this.friendsPhotoContainer = $('#slide-3-friend-photos', this.domEl)[0];
      // friendsList = friendsList.slice(0, 5);

      // friendsList.forEach(function(p, i) {
      //   var url = p.avatar_url,
      //       photo = new FriendPhoto(
      //         url,
      //         { x: friendsPhotoSpecs[i].x, y: friendsPhotoSpecs[i].y },
      //         friendsPhotoSpecs[i].radius
      //       );
      //   // html = photo.compileToHTML();

      //   photo.addToDOM('#slide-3-friend-photos');

      //   // this.friendsPhotoContainer.innerHTML += html;
      //   this.friendsPhotos.push(photo);
      // }, this);

      this.animationHandles = [];

      this.friendsPhotos.forEach(function(p, i) {
        this.animationHandles.push(p.present(dt, dt * i));
      }, this);

      $(this.$yuepao).velocity({
        opacity: 1.0
      }, {
        delay: 1500,
        duration: 800
      });

      // TODO: make duration and delay a parameter
      setTimeout(function() {
        ss.showArrowButton();
      }, 2300);

    },
    onExit: function() {
      // TODO:
    }
  });
})(app);
