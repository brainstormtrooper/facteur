function iterRows() {
  print('START - starting treatment');
  print(`> VARS = ${VARS}`);
  CSVA.forEach((row) => {
    print(`> row is ${row}`);
    const vals = {};
    // const to = row.shift();
    const cHTML = HTML;
    const cTEXT = TEXT;
    row.forEach((val, k) => {
      print(`VARS[k] = "${VARS[k]}", val = "${val}"`);
      vals[VARS[k]] = val;
    });
    Object.entries(vals).forEach(([i, v]) => {
      const iw = `{{${i}}}`;
      _positions(HTML).forEach((pos) => {
        print(`> Comparing "${pos}" to "${iw}"`);
        if (pos == iw) {
          print('> MATCH');
          cHTML.replace(pos, v);
        }
      });
      _positions(TEXT).forEach((pos) => {
        if (pos == iw) {
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
      });
    });
  });
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);
  return res;
}
