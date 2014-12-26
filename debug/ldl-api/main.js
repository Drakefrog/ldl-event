var container = document.getElementById('container');

function dump(str) {
  var p = document.createElement('pre');
  p.textContent = str;
  container.appendChild(p);
}

// LDLAPI.MOCK_STATUS = 'OK';
// LDLAPI.USE_MOCK = false;
LDLAPI.getAnnualUserData(null, function(err, data) {
  if (err) {
    dump(JSON.stringify(err, null, 2));
    return;
  }

  dump(JSON.stringify(data, null, 2));
});
