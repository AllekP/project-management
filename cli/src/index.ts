#!/usr/bin/env node
import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import { saveToken, getToken } from './utils/config.js';
import chokidar from 'chokidar';

const program = new Command();
const API_URL = process.env.API_URL || 'http://localhost:3001';

program
  .name('wlo')
  .description('White Label Ops CLI for time tracking')
  .version('1.1.0');

program
  .command('login')
  .description('Login to the platform')
  .requiredOption('-e, --email <email>', 'Email')
  .requiredOption('-p, --password <password>', 'Password')
  .action(async (options) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: options.email,
        password: options.password,
      });
      saveToken(response.data.access_token);
      console.log(chalk.green('Logged in successfully!'));
    } catch (error: any) {
      console.error(chalk.red('Login failed:'), error.response?.data?.message || error.message);
    }
  });

program
  .command('watch')
  .description('Track active coding time in the current directory')
  .option('-i, --issue <issueId>', 'Issue ID to track time against')
  .action(async (options) => {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('Please login first using: wlo login'));
      return;
    }

    console.log(chalk.blue('Watching for file changes in the current directory...'));
    let startTime = Date.now();
    let totalSeconds = 0;
    let lastActive = Date.now();
    let lastSyncTime = Date.now();
    const IDLE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
    const SYNC_INTERVAL = 1 * 60 * 1000; // 1 minute

    const syncTime = async (seconds: number) => {
      if (seconds <= 0) return;
      try {
        await axios.post(`${API_URL}/time-logs`, {
          duration: seconds,
          startTime: new Date(lastSyncTime).toISOString(),
          endTime: new Date().toISOString(),
          issueId: options.issue,
          description: 'CLI active coding time (autosync)',
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(chalk.dim(`[Autosync] Synced ${seconds} seconds.`));
        lastSyncTime = Date.now();
        return true;
      } catch (error: any) {
        console.error(chalk.red('[Autosync] Failed to sync time:'), error.message);
        return false;
      }
    };

    const watcher = chokidar.watch('.', {
      ignored: [/(^|[\/\\])\../, '**/node_modules/**', '**/dist/**', '**/.next/**'],
      persistent: true
    });

    watcher.on('change', path => {
      const now = Date.now();
      const diff = now - lastActive;

      if (diff < IDLE_THRESHOLD) {
        totalSeconds += Math.floor(diff / 1000);
      }

      lastActive = now;
      console.log(chalk.gray(`Activity detected: ${path}. Total session time: ${Math.floor(totalSeconds / 60)}m ${totalSeconds % 60}s`));

      // Periodic sync
      if (now - lastSyncTime > SYNC_INTERVAL) {
        const secondsToSync = totalSeconds - Math.floor((now - lastSyncTime) / 1000); // Rough estimate
        // In a real app we'd track unsynced seconds more precisely
        syncTime(Math.floor((now - lastSyncTime) / 1000));
      }
    });

    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\nStopping watcher and performing final sync...'));
      const finalDiff = Math.min(Date.now() - lastActive, IDLE_THRESHOLD);
      const sessionTotal = totalSeconds + Math.floor(finalDiff / 1000);

      try {
        await axios.post(`${API_URL}/time-logs`, {
          duration: sessionTotal,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date().toISOString(),
          issueId: options.issue,
          description: 'CLI active coding time (final session sync)',
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(chalk.green(`Successfully synced total session: ${sessionTotal} seconds.`));
        process.exit(0);
      } catch (error: any) {
        console.error(chalk.red('Final sync failed:'), error.message);
        process.exit(1);
      }
    });
  });

program.parse(process.argv);
