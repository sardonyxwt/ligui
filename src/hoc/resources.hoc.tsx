/* tslint:disable:variable-name*/
import * as React from 'react';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';
import {
  Resources,
  ResourceScopeState,
  ResourceScopeAddResourceActionProps,
  ScopeEvent,
  ScopeListener,
  resourceService
} from '..';

export interface ResourceHOCInjectedProps {
  r?: Resources;
}

interface ResourceHOCState {
  resources: Resources;
}

export type ResourcesHocType = (keys: string[], Preloader?: React.ComponentType) =>
  <P extends ResourceHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(Component: C) => C;

const subscribers: {[key: string]: ScopeListener<ResourceScopeState>} = {};
const resourcesHocListenerIdGenerator = createUniqueIdGenerator('ResourcesHoc');

resourceService.onSetResource(e =>
  Object.getOwnPropertyNames(subscribers).forEach(key => subscribers[key](e)));

export function withResources(keys: string[], Preloader?: React.ComponentType) {

  return <P extends ResourceHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(
    Component: C
  ) => {

    class ContextHOC extends React.Component<P, ResourceHOCState> {

      static displayName = Component.displayName || Component.name;

      private listenerId = resourcesHocListenerIdGenerator();

      state = {
        resources: null
      };

      constructor(props) {
        super(props);
        if (resourceService.isResourcesLoaded(keys)) {
          this.state = {resources: resourceService.resources};
        }
      }

      componentDidMount() {
        if (this.props.r) {
          return;
        }
        subscribers[this.listenerId] = (e: ScopeEvent<ResourceScopeState>) => {
          const {key} = e.props as ResourceScopeAddResourceActionProps;
          if (!!keys.find(it => it === key)) {
            this.setState({resources: resourceService.resources});
          }
        };
        if (!this.state.resources) {
          resourceService.loadResources(keys).then((resources) => {
            this.setState({resources});
          });
        }
      }

      componentWillUnmount() {
        delete subscribers[this.listenerId];
      }

      render() {
        const {r} = this.props;
        const {resources} = this.state;

        if (!(resources || r)) {
          return Preloader ? <Preloader/> : null;
        }

        const RenderComponent = Component as any;

        return (
          <RenderComponent {...this.props} t={resources || r}/>
        );
      }
    }

    Object.keys(Component).forEach(key => ContextHOC[key] = Component[key]);

    return ContextHOC as any as C;

  };

}
