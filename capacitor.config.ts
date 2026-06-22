import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'xyz.kwendi.app',
  appName: 'kwendi',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;