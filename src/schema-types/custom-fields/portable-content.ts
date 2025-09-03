import { defineType } from 'sanity';

import externalLink from './external-link';
import internalLink from './internal-link';

const portableContent = defineType({
  name: 'portableContent',
  title: 'Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Heading 5', value: 'h5' },
        { title: 'Heading 6', value: 'h6' },
        { title: 'Quote', value: 'blockquote' },
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
    { type: 'steps' },
    { type: 'table' },
  ],
});

export default portableContent;
