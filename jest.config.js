module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: ["./jest-setup.js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "services/**/*.{ts,tsx}",
        "store/**/*.{ts,tsx}",
        "!**/*.d.ts",
        "!**/node_modules/**",
        "!**/babel.config.js",
        "!**/jest.config.js",
        "!**/coverage/**",
    ],
    transformIgnorePatterns: [
        "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|uuid)",
    ],
};
