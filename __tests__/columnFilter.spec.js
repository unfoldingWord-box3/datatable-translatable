import { filterLogic } from '../src/components/column-filter/helpers';

describe('Column Filter Helpers', () => {
  it('should test column filter logic', () => {
    const data = {
      value: undefined,
      filters: ['Chapters', 'Support Reference'],
      delimiters: { row: '\n', cell: '\t' },
    };
    expect(() => filterLogic(data)).not.toThrow();
  });
});