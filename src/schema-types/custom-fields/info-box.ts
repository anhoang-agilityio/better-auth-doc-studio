import { defineField, defineType } from 'sanity';

import externalLink from './external-link';
import internalLink from './internal-link';

type SpanChild = {
  _type: 'span';
  text: string;
} & Record<string, unknown>;

type Block = {
  _type: 'block';
  children: SpanChild[];
} & Record<string, unknown>;

const portableTextToPlainText = (blocks: Block[] | undefined): string => {
  if (!Array.isArray(blocks)) return '';
  return blocks
    .map((block) => block.children.map((child) => child.text).join(''))
    .join(' ')
    .trim();
};

export default defineType({
  name: 'infoBox',
  title: 'Info Box',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Info', value: 'info' },
          { title: 'Warning', value: 'warning' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
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
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
      content: 'content',
    },
    prepare: (selection: Record<string, any>) => ({
      title: selection.variant === 'warning' ? 'Warning' : 'Info',
      subtitle: portableTextToPlainText(selection.content),
    }),
  },
});
