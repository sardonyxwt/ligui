/* tslint:disable:variable-name*/
import * as React from 'react';
import { localizationService, Translator } from '../service/localization.service';

export interface LocalizationHOCInjectedProps {
  t?: Translator;
}

interface LocalizationHOCState {
  translator: Translator;
}

export function localization(ids: string[], Preloader?: React.ComponentType) {

  return <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(
    Component: C
  ) => {

    class ContextHOC extends React.Component<P, LocalizationHOCState> {

      static displayName = Component.displayName || Component.name;

      state = {
        translator: null
      };

      constructor(props) {
        super(props);
        if (localizationService.isLocalizationsLoaded(ids)) {
          this.state = {translator: localizationService.translator};
        }
      }

      componentDidMount() {
        if (this.props.t) {
          return;
        }
        const setup = () => {
          localizationService.loadLocalizations(ids).then((translator) => {
            this.setState({translator});
          });
        };
        localizationService.onLocaleChange(setup.bind(this));
        if (!this.state.translator) {
          setup();
        }
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
