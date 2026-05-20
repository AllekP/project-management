#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./utils/config");
const chokidar_1 = __importDefault(require("chokidar"));
const program = new commander_1.Command();
const API_URL = process.env.API_URL || 'http://localhost:3001';
program
    .name('wlo')
    .description('White Label Ops CLI for time tracking')
    .version('1.0.0');
program
    .command('login')
    .description('Login to the platform')
    .requiredOption('-e, --email <email>', 'Email')
    .requiredOption('-p, --password <password>', 'Password')
    .action(async (options) => {
    try {
        const response = await axios_1.default.post(`${API_URL}/auth/login`, {
            email: options.email,
            password: options.password,
        });
        (0, config_1.saveToken)(response.data.access_token);
        console.log(chalk_1.default.green('Logged in successfully!'));
    }
    catch (error) {
        console.error(chalk_1.default.red('Login failed:'), error.response?.data?.message || error.message);
    }
});
program
    .command('watch')
    .description('Track active coding time in the current directory')
    .option('-i, --issue <issueId>', 'Issue ID to track time against')
    .action(async (options) => {
    const token = (0, config_1.getToken)();
    if (!token) {
        console.error(chalk_1.default.red('Please login first using: wlo login'));
        return;
    }
    console.log(chalk_1.default.blue('Watching for file changes in the current directory...'));
    let startTime = Date.now();
    let totalSeconds = 0;
    let lastActive = Date.now();
    const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const watcher = chokidar_1.default.watch('.', {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });
    watcher.on('change', path => {
        const now = Date.now();
        const diff = now - lastActive;
        if (diff < IDLE_THRESHOLD) {
            totalSeconds += Math.floor(diff / 1000);
        }
        lastActive = now;
        console.log(chalk_1.default.gray(`Activity detected: ${path}. Total active time: ${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`));
    });
    process.on('SIGINT', async () => {
        console.log(chalk_1.default.yellow('\nStopping watcher and syncing time...'));
        try {
            await axios_1.default.post(`${API_URL}/time-logs`, {
                duration: totalSeconds,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date().toISOString(),
                issueId: options.issue,
                description: 'CLI active coding time',
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(chalk_1.default.green(`Synced ${totalSeconds} seconds of active work.`));
            process.exit(0);
        }
        catch (error) {
            console.error(chalk_1.default.red('Failed to sync time:'), error.message);
            process.exit(1);
        }
    });
});
program.parse(process.argv);
//# sourceMappingURL=index.js.map