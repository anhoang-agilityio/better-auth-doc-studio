import { codeInput } from '@sanity/code-input';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { env } from '@/config/env';
import { resolve } from '@/libs/resolve';
import { schemaTypes } from '@/schema-types';

export default defineConfig({
  title: 'better-auth-doc',

  projectId: env.PROJECT_ID,
  dataset: env.DATASET,

  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
    presentationTool({
      previewUrl: env.PREVIEW_URL,
      resolve,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
});
