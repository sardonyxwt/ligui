import { Scope } from '@sardonyxwt/state-store';
export interface NavigationServiceScope {
}
export interface NavigationServiceConfig {
}
export interface NavigationService {
    navigate(routeName: string, params: any): any;
    goBack(steps: number): any;
    getScope(): Scope<NavigationServiceScope>;
    getParam(): any;
    getLocation(): string;
    configure(config: NavigationServiceConfig): void;
}
export declare const navigationService: NavigationService;
