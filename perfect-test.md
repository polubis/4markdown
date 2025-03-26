# INSTRUCTIONS TO FOLLOW

1. NEVER test implementation details
2. Use black box testing - focus on behavior
3. Unattributable words like 'should' or 'correct', and similar are not allowed
4. Descriptions must be short
5. Descriptions must use only relevant words that explain the situation
6. First 'describe' block begins with a capital letter
7. Every 'it' block begins with a lowercase letter
8. Nested 'describe' block begins with a lowercase letter
9. There shouldn't be any duplication in test descriptions (use nested 'describe' block as in the example)
10. In names focus only on describing behaviors without dive into details of implementation

## NAMING CONVENTION

```
// Example of naming convention
describe("Pizza meets standards when", () => { 👍
  it("size is between 30-40cm", () => {}); 👍

  it("cake is brown", () => {}); 👍

  it("cheese is melted", () => {}); 👍

  it("cake is warm", () => {}); 👍

  it("plate is clean", () => {}); 👍

  describe("plate size is equal to", () => {
    it('30cm', () => {}); 👍

    it('40cm', () => {}); 👍
  })
});
```

## REAL TEST EXAMPLE

```
// Example of real test
import { renderHook, act } from '@testing-library/react';
import { useFeature } from './use-feature';

describe('Feature flags management works when', () => {
  it('allows to set data', () => {
    type User = { id: number };
    const { result } = renderHook(() => useFeature<User>());

    expect(result.current).toEqual(expect.objectContaining({ is: 'off' }));

    act(() => {
      result.current.on({ id: 0 });
    });

    expect(result.current).toEqual(
      expect.objectContaining({ is: 'on', data: { id: 0 } })
    );
  });

  it('sets initial visibility from calculation result', () => {
    const { result } = renderHook(() => useFeature(() => ({ is: `off` })));

    expect(result.current).toEqual(expect.objectContaining({ is: 'off' }));
  });

  it('is off by default', () => {
    const { result } = renderHook(() => useFeature());
    expect(result.current).toEqual(expect.objectContaining({ is: 'off' }));
  });

  it('resets to initial state', () => {
    const { result } = renderHook(() => useFeature({ is: 'on', data: 42 }));

    expect(result.current).toEqual(
      expect.objectContaining({ is: 'on', data: 42 })
    );

    act(() => {
      result.current.off();
    });

    expect(result.current).toEqual(expect.objectContaining({ is: 'off' }));

    act(() => {
      result.current.reset();
    });

    expect(result.current).toEqual(
      expect.objectContaining({ is: 'on', data: 42 })
    );
  });

  it('turns on the feature', () => {
    const { result } = renderHook(() => useFeature());

    act(() => {
      result.current.on(100);
    });

    expect(result.current).toEqual(
      expect.objectContaining({ is: 'on', data: 100 })
    );
  });

  it('turns off the feature', () => {
    const { result } = renderHook(() => useFeature({ is: 'on', data: 42 }));

    act(() => {
      result.current.off();
    });

    expect(result.current).toEqual(expect.objectContaining({ is: 'off' }));
  });

  it('allows to override', () => {
    const { result } = renderHook(() => useFeature());

    act(() => {
      result.current.set({ is: 'on', data: 'hello' });
    });

    expect(result.current).toEqual(
      expect.objectContaining({ is: 'on', data: 'hello' })
    );
  });
});
```

## CONVENTION FOR FILES

1. Put test inside **__tests__** folder