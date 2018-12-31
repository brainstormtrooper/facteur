function iterRows() {
  CSVA.forEach((row, k) => {
    const to = row.shift();
    row.forEach((val, k) => {
      const vals = {};
      const cHTML = HTML;
      const cTEXT = TEXT;
      vals[VARS[k]] = val[k];
      Object.entries(vals).forEach((v, k) => {
        const kw = `{{${k}}}`;
        _positions(HTML).forEach((pos) => {
          print(`> Comparing "${pos}" to "${kw}"`);
          if (pos === kw) {
            cHTML.replace(pos, v);
          }
        });
        _positions(TEXT).forEach((pos) => {
          if (pos === kw) {
            cTEXT.replace(pos, v);
          }
        });
        print('-------------');
        print(cHTML);
        print(cTEXT);
        print('-------------');
        MAILINGS.push({
          html: cHTML,
          text: cTEXT,
          to,
        });
      });
    });
  });
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);
  return res;
}
