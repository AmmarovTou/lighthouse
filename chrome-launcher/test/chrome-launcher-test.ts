/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

import {Launcher} from '../chrome-launcher';

import * as assert from 'assert';

const log = require('../../lighthouse-core/lib/log');

describe('Launcher', () => {
  it('accepts and uses a custom path', () => {
    log.setLevel('error');
    const chromeInstance = new Launcher({
      userDataDir: 'some_path'
    });

    assert.equal(chromeInstance.userDataDir, 'some_path');
  });

  it('defaults to genering a tmp dir when no data dir is passed', () => {
    log.setLevel('error');
    const chromeInstance = new Launcher();
    const originalMakeTmp = chromeInstance.makeTmpDir;
    chromeInstance.makeTmpDir = () => 'tmp_dir'
    assert.equal(chromeInstance.userDataDir, 'tmp_dir');

    // Restore the original fn.
    chromeInstance.makeTmpDir = originalMakeTmp;
  });

  it('doesn\'t fail when killed twice', () => {
    log.setLevel('error');
    const chromeInstance = new Launcher();
    return chromeInstance.launch().then(() => {
      log.setLevel();
      return Promise.all([chromeInstance.kill(), chromeInstance.kill()]);
    });
  });

  it('doesn\'t launch multiple chrome processes', () => {
    log.setLevel('error');
    const chromeInstance = new Launcher();
    let pid: number;
    return chromeInstance.launch()
        .then(() => {
          pid = chromeInstance.chrome!.pid;
          return chromeInstance.launch();
        })
        .then(() => {
          log.setLevel();
          assert.strictEqual(pid, chromeInstance.chrome!.pid);
          return chromeInstance.kill();
        });
  });
});
