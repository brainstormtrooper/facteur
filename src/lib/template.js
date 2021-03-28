function iterRows() {
  log('START - starting treatment');
  app.Data.MAILINGS.length = 0;
  for (let i = 0; i < app.Data.CSVA.length; i++) {
    const row = app.Data.CSVA[i];
    const vals = {};
    const to = app.Data.TO[i];
    let cHTML = app.Data.HTML;
    let cTEXT = app.Data.TEXT;
    row.forEach((val, k) => {
      vals[app.Data.VARS[k]] = val;
    });
    Object.entries(vals).forEach(([i, v]) => {
      const iw = `{{${i}}}`;
      _positions(cHTML).forEach((pos) => {
        if (pos == iw) {
          cHTML = cHTML.replace(pos, v);
        }
      });
      _positions(cTEXT).forEach((pos) => {
        if (pos == iw) {
          cTEXT = cTEXT.replace(pos, v);
        }
      });
    });

    app.Data.MAILINGS.push({
      html: cHTML,
      text: cTEXT,
      to,
    });
  };
  
  return app.Data.MAILINGS.length;
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);
  return res;
}
