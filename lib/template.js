function iterRows() {
  CSVA.forEach((row, k) => {
    const to = row.shift();
    const vals = {};
    row.forEach((val, k) => {
      vals[VARS[k]] = val[k];
    });
    Object.entries(vals).forEach((v, k) => {
      _positions().forEach((pos) => {
        if (pos === k) {
          HTML.replace(pos, v)
        }
      });
    });
  });
}

function _positions() {
  const re = '/${{([a-zA-Z0-9_]*)$}}/';
  return HTML.match(re);
}
