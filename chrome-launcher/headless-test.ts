const lighthouse = require('../lighthouse-core/index');

import {launch} from './chrome-launcher';

async function runLighthouse(url: string) {
  const opts = {
    chromeFlags: ['--headless'],
  };
  const chrome = await launch(opts);
  const flags = {
    output: 'json',
    port: chrome.port,
  };

  const results = await lighthouse(url, flags);

  process.on('uncaughtException', (e: any) => {
    console.log(e);
  });

  await chrome.kill();
  return results;
}

runLighthouse('https://example.com');
