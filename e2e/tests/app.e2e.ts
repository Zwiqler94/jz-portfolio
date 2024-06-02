
import * as assert from 'assert';

import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  setupBrowserHooks();


  it('is has a title', async () => {
    const {page} = getBrowserState();
    const element = await page.waitForSelector('head > title');

    const title = await element?.evaluate(el => el.textContent);

    console.log(title)

    assert.ok(element);
    assert.equal(title, 'Jacob Zwickler')

  });

  it('is running', async () => {
    const {page} = getBrowserState();
    const element = await page.waitForSelector('app-root');

    assert.ok(element);

  });

  it('has JS disabled warning', async () => {
    const {page} = getBrowserState();
    const element = await page.waitForSelector('body > noscript:nth-child(3)');

    const noscriptWarning = await element?.evaluate(el => el.textContent);

    console.log(noscriptWarning)

    assert.ok(element);
    assert.equal(noscriptWarning, 'Please enable JavaScript to continue using this application.')
  });

  it('has GTag disabled warning', async () => {
    const {page} = getBrowserState();
    const element = await page.waitForSelector('body > noscript:nth-child(1)');

    const noscriptTagManager = (await element?.evaluate(el => el.textContent))?.replaceAll(/\s+/g,' ').trim();

    console.log(noscriptTagManager)

    assert.ok(element);
    assert.equal(noscriptTagManager, '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWH754TK"  height="0"  width="0" style="display: none; visibility: hidden" ></iframe >'.replaceAll(/\s+/g,' ').trim())
  });


it('has JS disabled warning', async () => {
    const {page} = getBrowserState();
    const element = await page.waitForSelector('body > noscript:nth-child(1)');

    const noscriptTagManager = (await element?.evaluate(el => el.textContent))?.replaceAll(/\s+/g,' ').trim();

    console.log(noscriptTagManager)

    assert.ok(element);
    assert.equal(noscriptTagManager, '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KWH754TK"  height="0"  width="0" style="display: none; visibility: hidden" ></iframe >'.replaceAll(/\s+/g,' ').trim())
  });



});
