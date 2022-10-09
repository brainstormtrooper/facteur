/* eslint-disable no-unused-vars */

function now () {
  return Date.now();
}

function humanDate (stamp) {
  const sent = new Date(stamp);

  return sent.toLocaleTimeString();
}
