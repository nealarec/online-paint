const path = require("path");
const { getDefaultConfig } = require("@expo/metro-config");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(__dirname, "..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.sourceExts = ["js", "json", "ts", "tsx", "mjs"];

// Esto evita que Metro intente resolver dos veces React o React Native
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Opcional: decirle a Metro qué extensiones compilar
config.resolver.sourceExts.push("cjs");

module.exports = config;
