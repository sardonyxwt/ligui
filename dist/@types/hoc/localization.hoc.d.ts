import * as React from 'react';
import { LocalizationService, Translator } from '..';
export interface LocalizationHOCInjectedProps {
    t?: Translator;
}
export declare type LocalizationHocType = (keys: string[], Preloader?: React.ComponentType) => <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;
export declare function createLocalizationHocInstance(localizationService: LocalizationService): LocalizationHocType;
