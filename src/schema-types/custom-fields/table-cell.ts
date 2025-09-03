import { defineType } from 'sanity';

import externalLink from './external-link';
import internalLink from './internal-link';

export default defineType({
  name: 'tableCell',
  title: 'Table Cell',
  type: 'object',
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [externalLink, internalLink],
          },
          styles: [],
          lists: [],
        },
      ],
    },
  ],
  preview: {
    select: {
      content: 'content',
    },
    prepare: () => ({
      title: 'Cell',
    }),
  },
});
