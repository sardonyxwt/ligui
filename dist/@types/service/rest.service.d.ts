export interface RequestProps extends RequestInit {
    queryParams?: {
        [key: string]: string;
    };
}
export interface RestService {
    defaultProps: RequestInit;
    post(endpoint: string, options?: RequestProps): Promise<Response>;
    put(endpoint: string, options?: RequestProps): Promise<Response>;
    get(endpoint: string, options?: RequestProps): Promise<Response>;
    del(endpoint: string, options?: RequestProps): Promise<Response>;
    request(endpoint: string, options: RequestProps): Promise<Response>;
    buildUrl(endpoint: string, options: RequestProps): string;
}
export declare const restService: RestService;
