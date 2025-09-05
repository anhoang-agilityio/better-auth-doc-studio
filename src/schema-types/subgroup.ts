import { defineField, defineType } from 'sanity';

import { API_VERSION } from '@/config/constants';
import { Subgroup } from '@/generated/sanity.types';

export default defineType({
  name: 'subgroup',
  title: 'Subgroup',
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
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Used to sort subgroups within a category. Must be unique per category.',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .custom(async (order, { getClient, document }) => {
            const subgroup = document as Subgroup;
            const categoryRef = subgroup?.category?._ref;

            if (!categoryRef) {
              return true; // No category selected yet
            }

            const client = getClient({ apiVersion: API_VERSION });

            const currentId = subgroup._id || '';
            const publishedId = currentId.replace(/^drafts\./, '');
            const draftId = currentId.startsWith('drafts.')
              ? currentId
              : `drafts.${currentId}`;

            const query =
              '*[_type == "subgroup" && order == $order && category._ref == $categoryRef && !(_id in [$draftId, $publishedId])][0].name';
            const params = { order, categoryRef, draftId, publishedId };
            const existingSubgroup = await client.fetch(query, params);

            if (existingSubgroup) {
              return `Order must be unique per category. "${existingSubgroup}" is already using order ${order}`;
            }
            return true;
          }),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category.name',
    },
  },
});
