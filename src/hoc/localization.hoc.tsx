/* tslint:disable:variable-name*/
import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import { localizationService, Translator } from '..';

export interface LocalizationHOCInjectedProps {
  t?: Translator;
}

interface LocalizationHOCState {
  translator: Translator;
}

export type LocalizationHocType = (keys: string[], Preloader?: React.ComponentType) =>
  <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C

const subscribers: {[key: string]: Function} = {};
const localizationHocListenerIdGenerator = createUniqueIdGenerator('LocalizationHoc');

localizationService.onChangeLocale(() =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key]()));

export function LocalizationHoc(keys: string[], Preloader?: React.ComponentType) {

  return <P extends LocalizationHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(
    Component: C
  ) => {

    class ContextHOC extends React.Component<P, LocalizationHOCState> {

      static displayName = Component.displayName || Component.name;

      private listenerId = localizationHocListenerIdGenerator();

      state = {
        translator: null
      };

      constructor(props) {
        super(props);
        if (localizationService.isLocalizationsLoaded(keys)) {
          this.state = {translator: localizationService.translate};
        }
      }

      componentDidMount() {
        if (this.props.t) {
          return;
        }
        const setup = () => {
          localizationService.loadLocalizations(keys).then((translator) => {
            this.setState({translator});
          });
        };
        subscribers[this.listenerId] = setup;
        if (!this.state.translator) {
          setup();
        }
      }

      componentWillUnmount() {
        delete subscribers[this.listenerId];
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
