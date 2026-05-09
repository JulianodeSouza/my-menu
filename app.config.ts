import { ConfigContext, ExpoConfig } from "expo/config";
require("dotenv").config();

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "my-menu",
  slug: "my-menu",
  version: "1.0.0",
  scheme: "my-menu",
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-web-browser",
    [
      "expo-build-properties",
      {
        android: {
          usesCleartextTraffic: true,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true,
  },
  orientation: "default",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#fafafa",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#F5F5F5",
    },
    package: "com.mymenu",
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "d9b06a10-fed1-4c89-a3fb-f197ffeb6ec6",
    },
    // Variáveis de ambiente disponíveis no app
    appEnv: process.env.APP_ENV || "development",
    apiUrl: process.env.API_URL || undefined, // Usado apenas em produção
    apiPort: process.env.API_PORT || 3000,
  },
});
