"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToken = saveToken;
exports.getToken = getToken;
exports.saveProject = saveProject;
exports.getProject = getProject;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const CONFIG_DIR = path_1.default.join(os_1.default.homedir(), '.white-label-ops');
const CONFIG_FILE = path_1.default.join(CONFIG_DIR, 'config.json');
function saveToken(token) {
    if (!fs_1.default.existsSync(CONFIG_DIR)) {
        fs_1.default.mkdirSync(CONFIG_DIR);
    }
    const config = getToken() ? JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf-8')) : {};
    config.token = token;
    fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
function getToken() {
    if (!fs_1.default.existsSync(CONFIG_FILE))
        return null;
    const config = JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf-8'));
    return config.token || null;
}
function saveProject(projectId, issueId) {
    const config = getToken() ? JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf-8')) : {};
    config.lastProject = projectId;
    config.lastIssue = issueId;
    fs_1.default.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
function getProject() {
    if (!fs_1.default.existsSync(CONFIG_FILE))
        return null;
    const config = JSON.parse(fs_1.default.readFileSync(CONFIG_FILE, 'utf-8'));
    if (!config.lastProject)
        return null;
    return { projectId: config.lastProject, issueId: config.lastIssue };
}
//# sourceMappingURL=config.js.map