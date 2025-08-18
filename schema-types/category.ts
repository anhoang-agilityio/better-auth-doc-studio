import { defineField, defineType } from 'sanity';

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
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to sort categories. Must be unique.',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .custom(async (order, { getClient }) => {
            const client = getClient({ apiVersion: '2025-08-18' });
            const query = '*[_type == "category" && order == $order][0].name';
            const params = { order };
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
