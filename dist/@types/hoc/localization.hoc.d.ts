import * as React from 'react';
import { Translator } from '../service/localization.service';
export interface LocalizationHOCInjectedProps {
    t?: Translator;
}
export declare function localization(id: string | string[], Preloader?: React.ComponentType): <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
