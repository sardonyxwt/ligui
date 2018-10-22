/* tslint:disable:variable-name*/
import * as React from 'react';
import { localizationService, Translator } from '../service/localization.service';

export interface LocalizationHOCInjectedProps {
  t: Translator;
}

interface LocalizationHOCState {
  translator: Translator;
}

export function localization(id: string | string[]) {

  return <TOriginalProps extends {}>(
    Component: React.ComponentType<TOriginalProps & LocalizationHOCInjectedProps>
  ) => {

    class ContextHOC extends React.Component<TOriginalProps, LocalizationHOCState> {

      static displayName = Component.displayName || Component.name;

      state = {
        translator: null
      };

      componentDidMount() {
        const setup = () => {
          localizationService.loadLocalizations(id).then(() => {
            this.setState({translator: localizationService.translator})
          });
        };
        localizationService.onLocaleChange(setup.bind(this));
        setup();
      }

      render() {
        const {translator} = this.state;

        if (!translator) {
          return null;
        }

        return (
            <Component {...this.props} t={translator}/>
        );
      }
    };

    Object.keys(Component).forEach(key => ContextHOC[key] = Component[key]);

    return ContextHOC as any;

  };

}
