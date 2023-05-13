#!/usr/bin/env node
const { spawnSync } = require('child_process');
const { resolve } = require('path');

const cmd = 'node --no-warnings ' + resolve(__dirname, 'cli.js');
const { status } = spawnSync(cmd, process.argv.slice(2), { stdio: 'inherit', shell: true });

process.exitCode = status;
