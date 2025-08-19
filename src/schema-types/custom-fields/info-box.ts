import { defineField, defineType } from 'sanity';

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
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      variant: 'variant',
      content: 'content',
    },
    prepare: ({
      variant,
      content,
    }: {
      variant: 'info' | 'warning';
      content: Block[];
    }) => ({
      title: variant === 'warning' ? 'Warning' : 'Info',
      subtitle: portableTextToPlainText(content),
    }),
  },
});
