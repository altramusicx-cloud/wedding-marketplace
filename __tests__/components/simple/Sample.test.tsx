// __tests__/components/simple/Sample.test.tsx
// Simple test untuk verify Jest works

test('simple math test', () => {
  expect(1 + 1).toBe(2);
  expect('hello').toBe('hello');
});

test('array operations', () => {
  const arr = [1, 2, 3];
  expect(arr.length).toBe(3);
  expect(arr.map(x => x * 2)).toEqual([2, 4, 6]);
});

describe('Sample describe block', () => {
  it('should work with it() syntax', () => {
    expect(true).toBe(true);
  });
});
