/* tslint:disable:variable-name*/
import * as React from 'react';
import { resourceService, Resources } from '..';

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
        if (resourceService.isResourcesLoaded(ids)) {
          this.state = {resources: resourceService.resources};
        }
      }

      componentDidMount() {
        if (this.props.r) {
          return;
        }
        const setup = () => {
          resourceService.loadResources(ids).then((resources) => {
            this.setState({resources});
          });
        };
        resourceService.onSetResource(setup.bind(this));
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
