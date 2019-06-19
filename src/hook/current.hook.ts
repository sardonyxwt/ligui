import * as React from 'react';

export const useCurrent = <T>(
  valueProvider: () => T
): [T, (newValue: T) => void] => {
  const valueRef = React.useRef<T>(null);

  valueRef.current = valueProvider();

  return [
    valueRef.current,
    newValue => valueRef.current = newValue
  ];
};
