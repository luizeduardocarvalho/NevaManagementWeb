import { SearchPipe } from './search.pipe';

let pipe: SearchPipe;

beforeEach(() => {
  pipe = new SearchPipe();
});

describe('SearchPipe', () => {
  const items = [{ name: 'Name 1' }, { name: 'Name 2' }];
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('with no items should return empty array', () => {
    expect(pipe.transform([], '')).toEqual([]);
  });

  it('with no search text should return all items', () => {
    expect(pipe.transform(items, '')).toBe(items);
  });

  it('with search text to return correct items', () => {
    expect(pipe.transform(items, 'Name 1')).toEqual([items[0]]);
  })
});
