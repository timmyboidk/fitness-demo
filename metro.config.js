const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable Watchman and use Node.js watcher to avoid permission errors
if (config.server) {
    config.server.useWatchman = false;
} else {
    config.server = { useWatchman: false };
}

// Ensure resolver also doesn't try to use it
config.resolver.useWatchman = false;

module.exports = config;
