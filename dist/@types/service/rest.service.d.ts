export interface RequestProps extends RequestInit {
    queryParams?: {
        [key: string]: string;
    };
    pathParams?: {
        [key: string]: string;
    };
}
export interface RestMiddleware {
    onRequest?(url: string, props: RequestProps): RequestProps;
    onResponse?<T>(url: string, props: RequestProps, response: Response): any;
}
export interface RestService {
    defaultProps: RequestInit;
    readonly middleware: RestMiddleware[];
    addMiddleware(middleware: RestMiddleware): string;
    removeMiddleware(id: string): boolean;
    post(endpoint: string, options?: RequestProps): Promise<Response>;
    put(endpoint: string, options?: RequestProps): Promise<Response>;
    get(endpoint: string, options?: RequestProps): Promise<Response>;
    del(endpoint: string, options?: RequestProps): Promise<Response>;
    request(endpoint: string, options?: RequestProps): Promise<Response>;
    buildUrl(endpoint: string, options?: RequestProps): string;
}
export declare const restService: RestService;
