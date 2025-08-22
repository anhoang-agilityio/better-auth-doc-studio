import { defineField, defineType } from 'sanity';

// Shared language alternatives and code options
const languageAlternatives = [
  { title: 'Javascript', value: 'tsx' },
  { title: 'HTML', value: 'html' },
  { title: 'CSS', value: 'css' },
  { title: 'Typescript', value: 'tsx' },
  { title: 'JSON', value: 'json' },
  { title: 'YAML', value: 'yaml' },
  { title: 'Markdown', value: 'markdown' },
  { title: 'SQL', value: 'sql' },
  { title: 'Shell', value: 'sh' },
];

const codeFieldOptions = {
  withFilename: true,
  languageAlternatives,
};

export default defineType({
  name: 'codeBlock',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({
      name: 'useTabs',
      title: 'Use Tabs',
      type: 'boolean',
      description: 'Enable to show multiple code examples in tabs',
      initialValue: false,
    }),
    defineField({
      name: 'tabs',
      title: 'Tabs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Tab Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'code',
              title: 'Code',
              type: 'code',
              options: codeFieldOptions,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              code: 'code',
            },
            prepare: ({ title, code }) => ({
              title: title || 'Untitled Tab',
              subtitle: code?.code
                ? `${code.language || 'text'}: ${code.code}...`
                : 'No code',
            }),
          },
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (context as any)?.parent;
          if (parent?.useTabs) {
            return Array.isArray(value) && value.length > 0
              ? true
              : 'At least one tab is required when "Use Tabs" is enabled';
          }
          return true;
        }),
      hidden: ({ parent }) => !parent?.useTabs,
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'code',
      options: codeFieldOptions,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = (context as any)?.parent;
          if (!parent?.useTabs) {
            return value?.code
              ? true
              : 'Code is required when tabs are disabled';
          }
          return true;
        }),
      hidden: ({ parent }) => parent?.useTabs,
    }),
  ],
  preview: {
    select: {
      useTabs: 'useTabs',
      title: 'title',
      code: 'code',
      tabs: 'tabs',
    },
    prepare: ({
      useTabs,
      title,
      code,
      tabs,
    }: {
      useTabs: boolean;
      title?: string;
      code?: any;
      tabs?: any[];
    }) => {
      if (useTabs && tabs && tabs.length > 0) {
        return {
          title: title || 'Code Block with Tabs',
          subtitle: `${tabs.length} tab(s): ${tabs.map((tab) => tab.title).join(', ')}`,
        };
      }

      return {
        title: code?.filename || 'Code Block',
        subtitle: code?.code
          ? `${code.language || 'text'}: ${code.code}`
          : 'No code',
      };
    },
  },
});
