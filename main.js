
var mc = new Hammer(document.body);

mc.get('swipe').set({
  direction: Hammer.DIRECTION_ALL,
  velocity: 0.20
});

mc.on("swipeup", function(ev) {
  console.log('up', ev);
  showNextPage();
});

mc.on("swipedown", function(ev) {
  console.log('down', ev);
  showPrevPage();
});

function showNextPage() {

}

function showPrevPage() {

}
