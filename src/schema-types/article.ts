import { defineField, defineType } from 'sanity';

import { API_VERSION } from '@/config/constants';
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
      name: 'icon',
      title: 'Icon',
      type: 'file',
      options: {
        accept: 'image/svg+xml',
      },
      description: 'SVG icon for the article',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableContent',
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
      name: 'subgroup',
      title: 'Subgroup',
      type: 'reference',
      to: [{ type: 'subgroup' }],
      description: 'Optional subgroup within the category',
      options: {
        filter: ({ document }) => {
          const article = document as Article;
          const categoryRef = article?.category?._ref;
          return categoryRef
            ? {
                filter: 'category._ref == $categoryRef',
                params: { categoryRef },
              }
            : { filter: '_id == null' }; // Hide all if no category selected
        },
      },
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Used to sort articles within a category or subgroup. Must be unique per category/subgroup.',
      validation: (Rule) =>
        Rule.required()
          .integer()
          .positive()
          .custom(async (order, { getClient, document }) => {
            const article = document as Article;
            const categoryRef = article?.category?._ref;
            const subgroupRef = article?.subgroup?._ref;

            if (!categoryRef) {
              return true; // No category selected yet
            }

            const client = getClient({ apiVersion: API_VERSION });

            const currentId = article._id || '';
            const publishedId = currentId.replace(/^drafts\./, '');
            const draftId = currentId.startsWith('drafts.')
              ? currentId
              : `drafts.${currentId}`;

            // Check uniqueness within the same category and subgroup context
            let query: string;
            let params: Record<string, unknown>;

            if (subgroupRef) {
              // If article has a subgroup, check uniqueness within that subgroup
              query =
                '*[_type == "article" && order == $order && category._ref == $categoryRef && subgroup._ref == $subgroupRef && !(_id in [$draftId, $publishedId])][0].title';
              params = {
                order,
                categoryRef,
                subgroupRef,
                draftId,
                publishedId,
              };
            } else {
              // If article has no subgroup, check uniqueness among other articles without subgroup in the same category
              query =
                '*[_type == "article" && order == $order && category._ref == $categoryRef && !defined(subgroup) && !(_id in [$draftId, $publishedId])][0].title';
              params = { order, categoryRef, draftId, publishedId };
            }

            const existingArticle = await client.fetch(query, params);

            if (existingArticle) {
              const context = subgroupRef ? 'subgroup' : 'category';
              return `Order must be unique per ${context}. "${existingArticle}" is already using order ${order}`;
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
