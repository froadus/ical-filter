const HTTPS = require('https');

module.exports = async function getData(url) {
  return new Promise((resolve, reject) => {
    HTTPS.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}
