import { useEffect, useLayoutEffect } from 'react';
import { isClient } from './ssr-csr';

const useIsomorphicLayoutEffect = isClient() ? useLayoutEffect : useEffect;

export { useIsomorphicLayoutEffect };
