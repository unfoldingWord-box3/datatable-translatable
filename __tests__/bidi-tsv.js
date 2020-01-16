import { parseDataTable, stringify } from "../src/core/datatable";
import fs from 'fs';
import path from 'path';

describe('Bidirectional TSV Tests', () => {

  it('should convert en_tn_57-TIT tsv string to JSON and back', () => {
    generateTest('en_tn_57-TIT')
  });
})

function generateTest(fileName) {
  const delimiters = { row: '\n', cell: '\t' };
  const tsv = fs.readFileSync(path.join(__dirname, './fixtures', `${fileName}.tsv`), { encoding: 'utf-8' });
  const parsedTable = parseDataTable({ table: tsv, delimiters });
  expect(parsedTable).toMatchSnapshot();
  const { columnNames, rows } = parsedTable;
  expect(stringify({ columnNames, rows, delimiters })).toBe(tsv);
}