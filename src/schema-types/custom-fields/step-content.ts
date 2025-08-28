import { defineType } from 'sanity';

import externalLink from './external-link';
import internalLink from './internal-link';

const stepContent = defineType({
  name: 'stepContent',
  title: 'Step Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
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
    },
    { type: 'infoBox' },
    { type: 'codeBlock' },
  ],
});
export default stepContent;
