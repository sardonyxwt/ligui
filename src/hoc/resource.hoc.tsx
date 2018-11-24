/* tslint:disable:variable-name*/
import * as React from 'react';
import { resourceLoader } from '../loader/resource.loader';
import { resourceScope, Resources } from '../scope/resource.scope';

export interface ResourceHOCInjectedProps {
  r?: Resources;
}

interface ResourceHOCState {
  resources: Resources;
}

export function resource(ids: string[], Preloader?: React.ComponentType) {

  return <P extends ResourceHOCInjectedProps, C extends React.ComponentType<P> = React.ComponentType<P>>(
    Component: C
  ) => {

    class ContextHOC extends React.Component<P, ResourceHOCState> {

      static displayName = Component.displayName || Component.name;

      state = {
        resources: null
      };

      constructor(props) {
        super(props);
        if (resourceScope.isResourcesLoaded(ids)) {
          this.state = {resources: resourceScope.resources};
        }
      }

      componentDidMount() {
        if (this.props.r) {
          return;
        }
        const setup = () => {
          resourceLoader.loadResources(ids).then((resources) => {
            this.setState({resources});
          });
        };
        resourceScope.onSetResource(setup.bind(this));
        if (!this.state.resources) {
          setup();
        }
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
