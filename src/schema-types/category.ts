import { defineQuery } from 'groq';
import { defineField, defineType } from 'sanity';

import { env } from '@/config/env';
import { Category } from '@/generated/sanity.types';

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'file',
      options: {
        accept: 'image/svg+xml',
      },
      description: 'SVG icon for the category',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to sort categories. Must be unique.',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .custom(async (order, { getClient, document }) => {
            const category = document as Category;
            const client = getClient({ apiVersion: env.API_VERSION });

            const currentId = category._id || '';
            const publishedId = currentId.replace(/^drafts\./, '');
            const draftId = currentId.startsWith('drafts.')
              ? currentId
              : `drafts.${currentId}`;

            const query = defineQuery(
              '*[_type == "category" && order == $order && !(_id in [$draftId, $publishedId])][0].name',
            );
            const params = { order, draftId, publishedId };
            const existingCategory = await client.fetch(query, params);

            if (existingCategory) {
              return `Order must be unique. "${existingCategory}" is already using order ${order}`;
            }

            return true;
          }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
    },
  },
});
