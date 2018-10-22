// tslint:disable:variable-name
import * as React from 'react';
import { getScope } from '@sardonyxwt/state-store';
import { uniqueId } from '@sardonyxwt/utils/generator';

export interface SubscribeScopeSetting {
  scopeName: string;
  actions?: string[];
}

interface SubscribeHOCState {
  $scopesUpdateCount: number;
}

interface ScopeActionTree {
  [scopeName: string]: {
    [subscriberName: string]: (actionName: string) => void
  }
}

const scopeActionTree: ScopeActionTree = {};

export function subscribe<T>(injectedScopeStates: (string | SubscribeScopeSetting)[]) {

  return <TOriginalProps extends {}>(
    Component: React.ComponentType<TOriginalProps>
  ) => {

    function resolveSetting(setting: string | SubscribeScopeSetting): SubscribeScopeSetting {
      return typeof setting === 'string'
        ? {scopeName: setting, actions: []}
        : setting;
    }

    class SubscribeHOC extends React.Component<TOriginalProps, SubscribeHOCState> {

      private subscriberId = uniqueId('ScopeActionTreeSubscriberId');
      static displayName = Component.displayName || Component.name;

      constructor(props) {
        super(props);
        this.state = {
          $scopesUpdateCount: 0
        };
      }

      componentDidMount() {
        injectedScopeStates.forEach(subscribeScopeSetting => {
          const {scopeName, actions} = resolveSetting(subscribeScopeSetting);
          if (!(scopeName in scopeActionTree)) {
            scopeActionTree[scopeName] = {};
            getScope(scopeName).subscribe((event) => {
              Object.getOwnPropertyNames(scopeActionTree[scopeName])
                .forEach(subscriberKey => scopeActionTree[scopeName][subscriberKey](event.actionName));
            });
          }
          scopeActionTree[scopeName][this.subscriberId] = (actionName: string) => {
            const isActionHit = actions.length === 0 || actions.findIndex(it => it === actionName) >= 0;
            if (isActionHit) {
              this.setState({$scopesUpdateCount: this.state.$scopesUpdateCount + 1});
            }
          };
        });
      }

      componentWillUnmount() {
        injectedScopeStates.forEach(subscribeScopeSetting => {
          const {scopeName} = resolveSetting(subscribeScopeSetting);
          delete scopeActionTree[scopeName][this.subscriberId];
        });
      }

      render() {
        return (
          <Component {...this.props} data-scope-update-count={this.state.$scopesUpdateCount}/>
        );
      }
    }

    Object.keys(Component).forEach(key => SubscribeHOC[key] = Component[key]);

    return SubscribeHOC as any;

  };

}
