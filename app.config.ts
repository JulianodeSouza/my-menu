import { ExpoConfig, ConfigContext } from "expo/config";

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
    backgroundColor: "#121212",
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
    apiUrl: process.env.API_URL,
    apiPort: process.env.API_PORT,
  },
});
