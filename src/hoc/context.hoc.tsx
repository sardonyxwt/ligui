/* tslint:disable:variable-name*/
import * as React from 'react';

export interface ContextHOCInjectedProps<TContext> {
  context?: TContext;
}

export function context<TContext>(Consumer: React.Consumer<TContext>) {

  return <TOriginalProps extends {}>(
    Component: React.ComponentType<TOriginalProps & ContextHOCInjectedProps<TContext>>
  ) => {

    class ContextHOC extends React.Component<TOriginalProps> {

      static displayName = Component.displayName || Component.name;

      render() {
        return (
          <Consumer>
            {context => <Component {...this.props} context={context}/>}
          </Consumer>
        );
      }
    }

    Object.keys(Component).forEach(key => ContextHOC[key] = Component[key]);

    return ContextHOC as any;

  };

}
