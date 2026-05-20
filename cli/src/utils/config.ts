import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.white-label-ops');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function saveToken(token: string) {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR);
  }
  const config = getToken() ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) : {};
  config.token = token;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getToken(): string | null {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  return config.token || null;
}

export function saveProject(projectId: string, issueId: string) {
  const config = getToken() ? JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8')) : {};
  config.lastProject = projectId;
  config.lastIssue = issueId;
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function getProject(): { projectId: string, issueId: string } | null {
  if (!fs.existsSync(CONFIG_FILE)) return null;
  const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  if (!config.lastProject) return null;
  return { projectId: config.lastProject, issueId: config.lastIssue };
}
