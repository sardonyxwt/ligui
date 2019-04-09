// tslint:disable:variable-name
import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import { storeService, Scope } from '..';

export interface StateHOCInjectedProps<T extends {} = {}> {
  state?: T;
}

interface ScopeActionTree {
  [scopeName: string]: {
    [listenerId: string]: (actionName: string) => void
  }
}

export type StateHocType = <T>(scope: string | Scope<T>, actions?: string[], retention?) =>
  <P extends {}, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C

const scopeActionTree: ScopeActionTree = {};
const stateHocListenerIdGenerator = createUniqueIdGenerator('StateHoc');

export function withState<T>(scope: string | Scope<T>, actions: string[] = null, retention = 0) {

  return <P extends {}, C extends React.ComponentType<P> = React.ComponentType<P>>(
    Component: C
  ) => {

    class SubscribeHOC extends React.Component<P & StateHOCInjectedProps> {

      static displayName = Component.displayName || Component.name;

      private listenerId = stateHocListenerIdGenerator();
      private timeoutId: number;
      private scope = typeof scope === 'string' ? storeService.getScope(scope) : scope;

      constructor(props) {
        super(props);
        this.state = {}
      }

      componentDidMount() {
        const {scope, timeoutId, listenerId} = this;
        if (!(scope.name in scopeActionTree)) {
          const scopeSubscribers = scopeActionTree[scope.name] = {};
          scope.subscribe(e =>
            Object.getOwnPropertyNames(scopeSubscribers).forEach(key => scopeSubscribers[key](e.actionName)));
        }
        scopeActionTree[scope.name][listenerId] = (actionName) => {
          if (actions && !actions.find(it => it === actionName)) {
            return;
          }
          if (retention && retention > 0) {
            clearTimeout(timeoutId);
            this.timeoutId = global.setTimeout(() => this.setState(scope.state), retention) as any as number;
            return;
          }
          this.setState(scope.state);
        };
      }

      componentWillUnmount() {
        delete scopeActionTree[this.scope.name][this.listenerId];
      }

      render() {
        const {props, scope} = this;
        const {state = {}} = props;

        const RenderComponent = Component as any;

        return (
          <RenderComponent {...props} state={{...state, [scope.name]: scope.state}}/>
        );
      }
    }

    Object.keys(Component).forEach(key => SubscribeHOC[key] = Component[key]);

    return SubscribeHOC as any as C;

  };

}
