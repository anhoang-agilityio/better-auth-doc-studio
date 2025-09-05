import article from './article';
import category from './category';
import codeBlock from './custom-fields/code-block';
import infoBox from './custom-fields/info-box';
import portableContent from './custom-fields/portable-content';
import stepContent from './custom-fields/step-content';
import steps from './custom-fields/steps';
import table from './custom-fields/table';
import tableCell from './custom-fields/table-cell';
import tableRow from './custom-fields/table-row';
import subgroup from './subgroup';

export const schemaTypes = [
  article,
  category,
  subgroup,
  infoBox,
  codeBlock,
  steps,
  stepContent,
  portableContent,
  table,
  tableCell,
  tableRow,
];
