
import * as assert from 'assert';

import {setupBrowserHooks, getBrowserState} from './utils';

describe('App test', function () {
  setupBrowserHooks();
  it('is running', async function () {
    const {page} = getBrowserState();
    const element = await page.locator('::-p-text(jz-portfolio)').wait();

    assert.ok(element);

  });
});
