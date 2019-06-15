import { Container } from 'inversify';
export declare const createResourceHook: (container: Container) => <T = any>(key: string) => T;
