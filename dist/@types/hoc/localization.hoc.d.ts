import * as React from 'react';
import { Translator } from '../service/localization.service';
export interface LocalizationHOCInjectedProps {
    t: Translator;
}
export declare function localization(id: string | string[]): <TOriginalProps extends {}>(Component: React.ComponentType<TOriginalProps & LocalizationHOCInjectedProps>) => React.ComponentType<TOriginalProps>;
