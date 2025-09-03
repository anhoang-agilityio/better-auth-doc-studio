import { defineType } from 'sanity';

export default defineType({
  name: 'tableRow',
  title: 'Table Row',
  type: 'object',
  fields: [
    {
      name: 'cells',
      title: 'Cells',
      type: 'array',
      of: [{ type: 'tableCell' }],
    },
  ],
  preview: {
    select: {
      cells: 'cells',
    },
    prepare: (selection: Record<string, any>) => {
      const cells = selection.cells || [];
      return {
        title: `Row with ${cells.length} cells`,
      };
    },
  },
});
