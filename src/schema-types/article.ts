import { defineQuery } from 'groq';
import { defineField, defineType } from 'sanity';

import { env } from '@/config/env';
import { Article } from '@/generated/sanity.types';

export default defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
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
        'Used to sort articles within a category. Must be unique per category.',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .custom(async (order, { getClient, document }) => {
            const article = document as Article;
            const categoryRef = article?.category?._ref;

            if (!categoryRef) {
              return true; // No category selected yet
            }

            const client = getClient({ apiVersion: env.API_VERSION });
            const query = defineQuery(
              '*[_type == "article" && order == $order && category._ref == $categoryRef && _id != $documentId][0].title',
            );
            const params = { order, categoryRef, documentId: article._id };
            const existingArticle = await client.fetch(query, params);

            if (existingArticle) {
              return `Order must be unique per category. "${existingArticle}" is already using order ${order}`;
            }
            return true;
          }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.name',
    },
  },
});
