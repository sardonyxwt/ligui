import * as React from 'react';

export type RefHookType = <T>(initialValue?: T | null) => [React.RefObject<T>, T];

export function useRef<T>(initialValue?: T | null): [React.RefObject<T>, T] {
  const [el, setEl] = React.useState(initialValue);

  const refProxy: React.RefObject<T> = {
    set current(el) {
      setEl(el);
    },
    get current() {
      return el;
    }
  };

  return [refProxy, el];
}
