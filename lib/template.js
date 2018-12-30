function iterRows() {
  CSVA.forEach((row, k) => {
    const to = row.shift();
    const vals = {};
    row.forEach((val, k) => {
      vals[VARS[k]] = val[k];
    });
    const cHTML = HTML;
    const cTEXT = TEXT;
    Object.entries(vals).forEach((v, k) => {
      _positions(HTML).forEach((pos) => {
        if (pos === k) {
          cHTML.replace(pos, v);
        }
      });
      _positions(TEXT).forEach((pos) => {
        if (pos === k) {
          cTEXT.replace(pos, v);
        }
      });
    });
    MAILINGS.push({
      html: cHTML,
      text: cTEXT,
      to,
    });
  });
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);
  return res;
}
