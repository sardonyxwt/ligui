import * as React from 'react';

export const useRef = <T>(
  initialValue?: T | null
): [React.RefObject<T>, T] => {
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
};
