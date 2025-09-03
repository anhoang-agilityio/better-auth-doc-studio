import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'table',
  title: 'Table',
  type: 'object',
  fields: [
    defineField({
      name: 'headers',
      title: 'Table Headers',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) =>
        Rule.required().min(1).error('At least one header is required'),
    }),
    defineField({
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [{ type: 'tableRow' }],
      validation: (Rule) =>
        Rule.required().min(1).error('At least one row is required'),
    }),
    defineField({
      name: 'columnSizing',
      title: 'Column Sizing',
      type: 'string',
      options: {
        list: [
          { title: 'Auto (content-based)', value: 'auto' },
          { title: 'Custom widths', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'auto',
    }),
    defineField({
      name: 'customWidths',
      title: 'Custom Column Widths',
      type: 'array',
      of: [{ type: 'string' }],
      description:
        'Specify width for each column (e.g., "200px", "auto", "20%")',
      hidden: ({ parent }) => parent?.columnSizing !== 'custom',
    }),
  ],
  preview: {
    select: {
      headers: 'headers',
      rows: 'rows',
    },
    prepare: (selection: Record<string, any>) => {
      const headers = selection.headers || [];
      const rows = selection.rows || [];
      const title = headers.length > 0 ? headers.join(' | ') : 'Table';
      const subtitle = `${headers.length} columns, ${rows.length} rows`;

      return {
        title,
        subtitle,
      };
    },
  },
});
