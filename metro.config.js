const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 禁用 Watchman，使用 Node.js 监听器以避免权限错误
if (config.server) {
    config.server.useWatchman = false;
} else {
    config.server = { useWatchman: false };
}

// 确保 resolver 也不会尝试使用 Watchman
config.resolver.useWatchman = false;

module.exports = config;
