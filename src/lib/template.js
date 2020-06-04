function iterRows() {
  log('START - starting treatment');
  app.Data.MAILINGS.length = 0;
  // print(`> VARS = ${app.Data.VARS}`);
  for (let i = 0; i < app.Data.CSVA.length; i++) {
    const row = app.Data.CSVA[i];
    // print(`> row is ${row}`);
    const vals = {};
    const to = app.Data.TO[i];
    let cHTML = app.Data.HTML;
    let cTEXT = app.Data.TEXT;
    row.forEach((val, k) => {
      // print(`VARS[k] = "${app.Data.VARS[k]}", val = "${val}"`);
      vals[app.Data.VARS[k]] = val;
    });
    Object.entries(vals).forEach(([i, v]) => {
      const iw = `{{${i}}}`;
      _positions(cHTML).forEach((pos) => {
        // print(`> Comparing "${pos}" to "${iw}"`);
        if (pos == iw) {
          // print(`> MATCH; replacing pos="${pos}" with v="${v}"`);
          cHTML = cHTML.replace(pos, v);
        }
      });
      _positions(cTEXT).forEach((pos) => {
        if (pos == iw) {
          cTEXT = cTEXT.replace(pos, v);
        }
      });
    });
    /*
    print('-------------');
    print(cHTML);
    print(cTEXT);
    print('-------------');
    */
    app.Data.MAILINGS.push({
      html: cHTML,
      text: cTEXT,
      to,
    });
  };
  // print(`> MAILINGS.length ; "${app.Data.MAILINGS.length}"`);
  return app.Data.MAILINGS.length;
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);
  return res;
}
