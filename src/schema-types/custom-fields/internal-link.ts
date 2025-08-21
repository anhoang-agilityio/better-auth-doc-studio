import { defineField } from 'sanity';

const internalLink = {
  name: 'internalLink',
  title: 'Internal Link',
  type: 'object',
  fields: [
    defineField({
      name: 'article',
      title: 'Article',
      type: 'reference',
      to: [{ type: 'article' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
};

export default internalLink;
