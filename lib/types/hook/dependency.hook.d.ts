import * as Container from 'bottlejs';
export declare const createDependencyHook: (container: Container.IContainer) => <T = any>(id: string) => T;