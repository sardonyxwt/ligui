import { Scope } from '@sardonyxwt/state-store';
export interface NavigationState {
    routeName: string;
    params: any;
}
export interface NavigationServiceState {
    stack: NavigationState[];
}
export interface NavigationServiceConfig {
    initState: NavigationServiceState;
}
export interface NavigationService {
    navigate(routeName: string, params: any, stepBack?: number): Promise<NavigationServiceState>;
    goBack(stepBack?: number): Promise<NavigationServiceState>;
    getScope(): Scope<NavigationServiceState>;
    getParams(): any;
    getLocation(): string;
    getCurrentNavigationState(): NavigationState;
    configure(config: NavigationServiceConfig): void;
}
export declare const NAVIGATION_SCOPE_NAME = "NAVIGATION_SCOPE";
export declare const NAVIGATION_SCOPE_ACTION_CHANGE = "CHANGE_NAVIGATION";
export declare const navigationService: NavigationService;
