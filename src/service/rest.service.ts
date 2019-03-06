import { uniqueId } from '@sardonyxwt/utils/generator';

export interface RequestProps extends RequestInit {
  queryParams?: { [key: string]: string | number };
  pathParams?: { [key: string]: string | number };
}

export interface RestMiddleware {
  onRequest?(url: string, props: RequestProps): RequestProps;
  onResponse?<T>(url: string, props: RequestProps, response: Response);
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

export function createRestServiceInstance(): RestService {
  const middleware: {[id: string]: RestMiddleware} = {};

  let defaultProps: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'pragma': 'no-cache',
      'cache-control': 'no-cache'
    }
  };

  return Object.freeze({
    get middleware() {
      return Object.keys(middleware).map(key => middleware[key]);
    },
    get defaultProps() {
      return defaultProps;
    },
    set defaultProps(props: RequestInit) {
      if (typeof props !== 'object') {
        throw new Error('Props must not null');
      }
      defaultProps = props;
    },
    addMiddleware(newMiddleware: RestMiddleware) {
      const id = uniqueId('RestMiddlewareId');
      middleware[id] = newMiddleware;
      return id;
    },
    removeMiddleware(id: string) {
      return delete middleware[id];
    },
    post(endpoint: string, options: RequestProps = {}) {
      return this.request(endpoint, Object.assign({}, defaultProps, options, {
        method: 'POST'
      }));
    },
    put(endpoint: string, options: RequestProps = {}) {
      return this.request(endpoint, Object.assign({}, defaultProps, options, {
        method: 'PUT'
      }));
    },
    get(endpoint: string, options: RequestProps = {}) {
      return this.request(endpoint, Object.assign({}, defaultProps, options, {
        method: 'GET'
      }));
    },
    del(endpoint: string, options: RequestProps = {}) {
      return this.request(endpoint, Object.assign({}, defaultProps, options, {
        method: 'DELETE'
      }));
    },
    request(endpoint: string, options: RequestProps = {}): Promise<Response> {
      let requestProps = options;

      const url = this.buildUrl(endpoint, requestProps);

      this.middleware
        .filter(it => !!it.onRequest)
        .forEach(it => requestProps = it.onRequest(url, requestProps));

      return fetch(url, requestProps).then(response => {

        this.middleware
          .filter(it => !!it.onResponse)
          .forEach(it => requestProps = it.onResponse(url, requestProps, response));

        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response)
        }

        return Promise.reject(response);
      });
    },
    buildUrl(endpoint: string, options: RequestProps = {}) {
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
  });
}


