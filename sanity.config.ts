import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { env } from '@/config/env';
import { schemaTypes } from '@/schema-types';

export default defineConfig({
  title: 'better-auth-doc',

  projectId: env.PROJECT_ID,
  dataset: env.DATASET,

  plugins: [structureTool(), visionTool(), codeInput()],

  schema: {
    types: schemaTypes,
  },
});
