import * as React from 'react';
import { Translator } from '..';
export interface LocalizationHOCInjectedProps {
    t?: Translator;
}
export declare type LocalizationHocType = (keys: string[], Preloader?: React.ComponentType) => <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
export declare function LocalizationHoc(keys: string[], Preloader?: React.ComponentType): <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
