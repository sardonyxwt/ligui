import * as React from 'react';
export declare type RefHookType = <T>(initialValue?: T | null) => [React.RefObject<T>, T];
export declare function useRef<T>(initialValue?: T | null): [React.RefObject<T>, T];
