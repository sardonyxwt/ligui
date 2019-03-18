import * as React from 'react';
import { Resources } from '..';
export interface ResourceHOCInjectedProps {
    r?: Resources;
}
export declare type ResourcesHocType = (keys: string[], Preloader?: React.ComponentType) => <P extends ResourceHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
export declare function withResources(keys: string[], Preloader?: React.ComponentType): <P extends ResourceHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
