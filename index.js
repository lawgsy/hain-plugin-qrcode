'use strict'

const QRCode = require('qrcode');
const fs     = require('fs');
const path   = require('path');

module.exports = () => {
  const template = fs.readFileSync(path.join(__dirname, 'output.html'), 'utf8');
  let html       = "";

  function search (query, res) {
    const query_trim = query.trim();
    if(query_trim.length === 0) {
      html = "Your QR Code will appear here.";

      res.add({
        id:      'QR Code',
        title:   'QR Code will appear on the right, please enter input',
        desc:    `Generate QR code`
      });
      return;
    }

    QRCode.toDataURL(query_trim, function (err, url) {
      html = template.replace('%qrcode%', url);
      html = html.replace('%plaintext%', query_trim);
    })

    res.add({
      id:      query_trim,
      title:   'QR Code',
      desc:    `<b>${query_trim}</b>`,
      preview: true
    });
  }

  function renderPreview(id, payload, render) {
    render(html);
  }

  return { search, renderPreview }
}
