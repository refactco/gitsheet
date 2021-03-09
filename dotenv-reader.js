const { join } = require('path');
const { readFileSync } = require('fs');

const raw = readFileSync(join(__dirname, '.env'), { encoding: 'utf8' });
const env = raw
  .split('\n')
  .filter((item) => item)
  .reduce((obj, item) => {
    const [key, value] = item.split('=');
    // eslint-disable-next-line no-param-reassign
    obj[key] = value;

    return obj;
  }, {});

module.exports = { env };
