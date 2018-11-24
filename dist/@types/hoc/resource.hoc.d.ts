import * as React from 'react';
import { Resources } from '../scope/resource.scope';
export interface ResourceHOCInjectedProps {
    r?: Resources;
}
export declare function resource(ids: string[], Preloader?: React.ComponentType): <P extends ResourceHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
