import { createScope, Scope } from '@sardonyxwt/state-store';

export interface NavigationServiceScope {

}

export interface NavigationServiceConfig {

}

export interface NavigationService {
  navigate(routeName: string, params);
  goBack(routeName?: string);
  getScope(): Scope<NavigationServiceScope>;
  getParam();
  getLocation(): string;
  configure(config: NavigationServiceConfig): void;
}

class NavigationServiceImpl implements NavigationService {

  navigate(routeName: string, params) {
  }

  goBack(routeName?: string) {
  }

  getScope(): Scope<NavigationServiceScope> {
    return undefined;
  }

  getParam() {
  }

  getLocation(): string {
    return undefined;
  }

  configure(config: NavigationServiceConfig): void {
  }

}

export const navigationService: NavigationService = new NavigationServiceImpl();

