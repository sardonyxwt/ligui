import { Container } from 'inversify';
export declare const createModuleHook: (container: Container) => <T = any>(key: string) => T;
