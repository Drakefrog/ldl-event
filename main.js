
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

var currentPage = 0, lastPage = 2;

function showNextPage() {
  if (currentPage >= lastPage) return;

  currentPage += 1;
  $('.slider').animate({ top: '-=100%' });
}

function showPrevPage() {
  if (currentPage <= 0) return;
  currentPage -= 1;
  $('.slider').animate({ top: '+=100%' });
}
