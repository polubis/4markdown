import { act, renderHook } from '@testing-library/react';
import { useMap } from './use-map';
import { expect } from '@jest/globals';

describe(`Mapping works when`, () => {
  it(`supports overloaded initialization`, () => {
    const { result: result1 } = renderHook(() => useMap<string, number>());
    const entries = [
      [`key1`, 10],
      [`key2`, 20],
    ] as const;

    const { result: result2 } = renderHook(() =>
      useMap<string, number>(entries),
    );

    const { result: result3 } = renderHook(() =>
      useMap<string, number>(() => entries),
    );

    expect([...result1.current.entries()]).toEqual([]);
    expect([...result2.current.entries()]).toEqual(entries);
    expect([...result3.current.entries()]).toEqual(entries);
  });

  it(`sets a key-value`, () => {
    const entries = [[`key1`, 10]] as const;

    const { result } = renderHook(() => useMap<string, number>(entries));

    act(() => {
      result.current.set(`key2`, 20);
    });

    expect([...result.current.entries()]).toEqual([
      [`key1`, 10],
      [`key2`, 20],
    ]);
    expect(result.current.get(`key2`)).toBe(20);
  });

  it(`removes`, () => {
    const entries = [
      [`key1`, 10],
      [`key2`, 20],
    ] as const;

    const { result } = renderHook(() => useMap<string, number>(entries));

    act(() => {
      result.current.remove(`key1`);
    });

    expect([...result.current.entries()]).toEqual([[`key2`, 20]]);
    expect(result.current.has(`key1`)).toBe(false);
  });

  it(`checks if exists`, () => {
    const entries = [
      [`key1`, 10],
      [`key2`, 20],
    ] as const;

    const { result } = renderHook(() => useMap<string, number>(entries));

    expect(result.current.has(`key1`)).toBe(true);
    expect(result.current.has(`key3`)).toBe(false);
  });

  it(`retrieves values`, () => {
    const entries = [
      [`key1`, 10],
      [`key2`, 20],
    ] as const;

    const { result } = renderHook(() => useMap<string, number>(entries));

    expect(result.current.get(`key1`)).toBe(10);
    expect(result.current.get(`key3`)).toBeUndefined();
  });

  it(`allows to read`, () => {
    const entries = [
      [`key1`, 10],
      [`key2`, 20],
    ] as const;

    const { result } = renderHook(() => useMap<string, number>(entries));

    expect([...result.current.keys()]).toEqual([`key1`, `key2`]);
    expect([...result.current.values()]).toEqual([10, 20]);
  });

  it(`clears the map`, () => {
    const entries = [
      [`key1`, 10],
      [`key2`, 20],
    ] as const;

    const { result } = renderHook(() => useMap<string, number>(entries));

    act(() => {
      result.current.clear();
    });

    expect([...result.current.entries()]).toEqual([]);
    expect([...result.current.keys()]).toEqual([]);
    expect([...result.current.values()]).toEqual([]);
  });
});
