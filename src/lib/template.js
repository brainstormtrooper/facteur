
/* eslint-disable no-unused-vars */
function iterRows (data) {
  data.get('MAILINGS').length = 0;
  for (let i = 0; i < data.get('CSVA').length; i++) {
    const row = data.get('CSVA')[i];

    if (row[0] === "") {
      continue;
    }

    const vals = {};
    const to = data.get('TO')[i].replace(/"/g, '').trim();
    let cHTML = data.get('HTML');
    let cTEXT = data.get('TEXT');

    row.forEach((val, k) => {
      vals[data.get('VARS')[k]] = val;
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

    data.push('MAILINGS', {
      html: cHTML,
      text: cTEXT,
      to,
    });
  }

  return data.get('MAILINGS').length;
}

function _positions (template) {
  const re = /{{([a-zA-Z0-9_]+)}}/g;
  const positions = template.match(re)
  res = (positions ? positions : []);

  return res;
}

var payload = `Subject: {{subject}}
TO: {{to}}
FROM: {{from}}
DATE: {{date}}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="{{mixedBoundary}}"


--{{mixedBoundary}}
MIME-Version: 1.0
Content-Type: multipart/related; boundary="{{relatedBoundary}}"


--{{relatedBoundary}}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="{{alternativeBoundary}}"


{{partText}}


{{partHtml}}

--{{alternativeBoundary}}--

{{partsInline}}

--{{relatedBoundary}}--

{{partsAttachment}}

--{{mixedBoundary}}--`; 

var partBlock = `--{{boundary}}
Content-Type: {{contentType}}; {{contentExtra}}
MIME-Version: 1.0
Content-Transfer-Encoding: {{encoding}}
{{dispositionHeader}}
{{contentId}}


{{content}}
`;