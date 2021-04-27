
/* eslint-disable no-unused-vars */
function iterRows(data) {
  log('START - starting treatment');
  data.MAILINGS.length = 0;
  for (let i = 0; i < data.CSVA.length; i++) {
    const row = data.CSVA[i];
    const vals = {};
    const to = data.TO[i].replace(/"/g, '').trim();
    let cHTML = data.HTML;
    let cTEXT = data.TEXT;

    row.forEach((val, k) => {
      vals[data.VARS[k]] = val;
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

    data.MAILINGS.push({
      html: cHTML,
      text: cTEXT,
      to,
    });
  }

  return data.MAILINGS.length;
}

function _positions(template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const res = template.match(re);

  return res;
}
