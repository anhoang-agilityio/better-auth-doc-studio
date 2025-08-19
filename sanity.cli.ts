import { defineCliConfig } from 'sanity/cli';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineCliConfig({
  api: {
    projectId: '0gl88wwy',
    dataset: 'production',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,

  vite: {
    plugins: [tsconfigPaths()],
  },
});
