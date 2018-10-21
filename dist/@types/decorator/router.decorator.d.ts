import { match } from 'react-router';
import { History, Location } from 'history';
export { History, Location, match as Match };
export declare function Routed<T extends {
    new (...args: any[]): {};
}>(constructor: T): {
    new (...args: any[]): {};
} & T;
export declare function RoutedMatch(proto: any, prop: string): any;
export declare function RoutedLocation(proto: any, prop: string): any;
export declare function RoutedHistory(proto: any, prop: string): any;
