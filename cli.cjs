#!/usr/bin/env node
const { spawnSync } = require('child_process');
const { resolve } = require('path');

const args = [resolve(__dirname, 'cli.js'), ...process.argv.slice(2)];
const { status } = spawnSync(process.execPath, args, { stdio: 'inherit' });

process.exitCode = status;
