/* tslint:disable:variable-name*/
import * as React from 'react';
import { localizationService, Translator } from '../service/localization.service';

export interface LocalizationHOCInjectedProps {
  t?: Translator;
}

interface LocalizationHOCState {
  translator: Translator;
}

export function localization(id: string | string[], Preloader?: React.ComponentType) {

  return <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(
    Component: C
  ) => {

    class ContextHOC extends React.Component<P, LocalizationHOCState> {

      static displayName = Component.displayName || Component.name;

      state = {
        translator: null
      };

      componentDidMount() {
        if (this.props.t) {
          return;
        }
        const setup = () => {
          localizationService.loadLocalizations(id).then((translator) => {
            this.setState({translator})
          });
        };
        localizationService.onLocaleChange(setup.bind(this));
        setup();
      }

      render() {
        const {t} = this.props;
        const {translator} = this.state;

        if (!(t || translator)) {
          return Preloader ? <Preloader/> : null;
        }

        const RenderComponent = Component as any;

        return (
            <RenderComponent {...this.props} t={t || translator}/>
        );
      }
    }

    Object.keys(Component).forEach(key => ContextHOC[key] = Component[key]);

    return ContextHOC as any as C;

  };

}
