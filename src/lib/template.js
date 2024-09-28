
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
    let subject = data.get('SUBJECT');
    let dlinks = data.get('LINKS');
    let links = [];

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
      _positions(subject).forEach((pos) => {
        if (pos == iw) {
          subject = subject.replace(pos, v);
        }
      });

      links = dlinks.map(link => {
        _positions(link).forEach((pos) => {
          if (pos == iw) {
            link = link.replace(pos, v);
          }
        });
        return link;
      });
    });

    data.push('MAILINGS', {
      html: cHTML,
      text: cTEXT,
      to,
      subject,
      links
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


function _links(template) {
  res = [];
  var imgs = /<img\s[^>]*?src=(["']?)([^\s]+?)\1[^>]*?>/ig;
  template.replace(imgs, function (_anchor, _quote, url) {
    res.push(url);
  });
  return res;
}


var payload = `{{headers}}
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