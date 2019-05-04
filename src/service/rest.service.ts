import { injectable } from 'inversify';
import { createUniqueIdGenerator } from '@sardonyxwt/utils/generator';

export interface RequestProps extends RequestInit {
  queryParams?: { [key: string]: string | number };
  pathParams?: { [key: string]: string | number };
}

export interface RestMiddleware {
  onRequest?(url: string, props: RequestProps): RequestProps;
  onResponse?<T>(url: string, props: RequestProps, response: Response);
}

export interface RestService {
  addMiddleware(middleware: RestMiddleware): string;
  removeMiddleware(id: string): boolean;
  post(endpoint: string, options?: RequestProps): Promise<Response>;
  put(endpoint: string, options?: RequestProps): Promise<Response>;
  get(endpoint: string, options?: RequestProps): Promise<Response>;
  del(endpoint: string, options?: RequestProps): Promise<Response>;
  request(endpoint: string, options?: RequestProps): Promise<Response>;
  buildUrl(endpoint: string, options?: RequestProps): string;
}

const restMiddlewareIdGenerator = createUniqueIdGenerator('Middleware');

@injectable()
export class RestServiceImpl implements RestService {

  private _defaultProps: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'pragma': 'no-cache',
      'cache-control': 'no-cache'
    }
  };

  private _middleware: {[id: string]: RestMiddleware} = {};

  addMiddleware(middleware: RestMiddleware): string {
    const id = restMiddlewareIdGenerator();
    this._middleware[id] = middleware;
    return id;
  }

  removeMiddleware(id: string): boolean {
    return delete this._middleware[id];
  }

  buildUrl(endpoint: string, options?: RequestProps): string {
    let url = endpoint;
    const { queryParams, pathParams } = options;
    if (pathParams) { // todo update logic and add exception
      Object.getOwnPropertyNames(pathParams).forEach(key => {
        url = url.replace(new RegExp(`{${key}}`, 'g'), `${pathParams[key]}`);
      });
    }
    url.replace(new RegExp('/{.*}', 'g'), '');
    if (queryParams) {
      let queryUrl = Object.getOwnPropertyNames(queryParams)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(`${queryParams[k]}`))
        .join('&');
      if (queryUrl) url += `?${queryUrl}`;
    }
    return url;
  }

  request(endpoint: string, options?: RequestProps): Promise<Response> {
    let requestProps = options;

    const url = this.buildUrl(endpoint, requestProps);

    Object.getOwnPropertyNames(this._middleware).map(key => this._middleware[key])
      .filter(it => !!it.onRequest)
      .forEach(it => requestProps = it.onRequest(url, requestProps));

    return fetch(url, requestProps).then(response => {

      Object.getOwnPropertyNames(this._middleware).map(key => this._middleware[key])
        .filter(it => !!it.onResponse)
        .forEach(it => requestProps = it.onResponse(url, requestProps, response));

      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      }

      return Promise.reject(response);
    });
  }

  get(endpoint: string, options?: RequestProps): Promise<Response> {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'GET'
    }));
  }

  post(endpoint: string, options?: RequestProps): Promise<Response> {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'POST'
    }));
  }

  put(endpoint: string, options?: RequestProps): Promise<Response> {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'PUT'
    }));
  }

  del(endpoint: string, options?: RequestProps): Promise<Response> {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'DELETE'
    }));
  }

}
