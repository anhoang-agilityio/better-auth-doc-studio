import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'steps',
  title: 'Steps',
  type: 'object',
  fields: [
    defineField({
      name: 'headingLevel',
      title: 'Heading Level',
      type: 'number',
      description: 'Heading level for step titles (1-6)',
      initialValue: 3,
      validation: (Rule) => Rule.required().integer().min(1).max(6),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'content',
              title: 'Content',
              type: 'portableContent',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      items: 'items',
    },
    prepare: ({ items }: { items?: Array<{ title?: string }> }) => {
      const count = items?.length ?? 0;
      const firstTitle =
        items && items[0] && items[0].title ? ` – ${items[0].title}` : '';
      return {
        title: `Steps (${count})${firstTitle}`,
        subtitle:
          count > 1 ? `${count} steps` : count === 1 ? '1 step' : 'No steps',
      };
    },
  },
});
