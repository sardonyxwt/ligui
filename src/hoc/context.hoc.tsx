/* tslint:disable:variable-name*/
import * as React from 'react';

export interface ContextHOCInjectedProps<TContext> {
  context?: TContext;
}

export type ContextHocType = <TContext>(Consumer: React.Consumer<TContext>) =>
  <P extends ContextHOCInjectedProps<TContext>, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;

export function createContextHocInstance(): ContextHocType {
  return function <TContext>(Consumer: React.Consumer<TContext>) {

    return <P extends ContextHOCInjectedProps<TContext>, C extends React.ComponentType<P> = React.ComponentType<P>>(
      Component: C
    ) => {

      class ContextHOC extends React.Component<P> {

        static displayName = Component.displayName || Component.name;

        render() {
          const RenderComponent = Component as any;

          return (
            <Consumer>
              {context => <RenderComponent {...this.props} context={this.props.context || context}/>}
            </Consumer>
          );
        }
      }

      Object.keys(Component).forEach(key => ContextHOC[key] = Component[key]);

      return ContextHOC as C;

    };

  }
}
