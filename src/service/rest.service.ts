export interface RequestProps extends RequestInit {
  queryParams?: { [key: string]: string }
  pathParams?: { [key: string]: string }
}

export interface RestService {
  defaultProps: RequestInit;
  post(endpoint: string, options?: RequestProps): Promise<Response>;
  put(endpoint: string, options?: RequestProps): Promise<Response>;
  get(endpoint: string, options?: RequestProps): Promise<Response>;
  del(endpoint: string, options?: RequestProps): Promise<Response>;
  request(endpoint: string, options?: RequestProps): Promise<Response>;
  buildUrl(endpoint: string, options?: RequestProps): string;
}

class RestServiceImpl implements RestService {

  private _defaultProps: RequestInit = {
    credentials: 'same-origin',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'pragma': 'no-cache',
      'cache-control': 'no-cache'
    }
  };

  get defaultProps() {
    return this._defaultProps;
  }

  set defaultProps(props: RequestInit) {
    if (typeof props !== 'object') {
      throw new Error('Props must not null');
    }
    this._defaultProps = props;
  }

  post(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'POST'
    }));
  }

  put(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'PUT'
    }));
  }

  get(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'GET'
    }));
  }

  del(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign({}, this._defaultProps, options, {
      method: 'DELETE'
    }));
  }

  request(endpoint: string, options: RequestProps = {}) {
    if (options.headers && options.headers['Content-Type'].includes('application/json')) {
      options.body = JSON.stringify(options.body);
    }
    return fetch(this.buildUrl(endpoint, options), options).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
      }
      return Promise.reject(response);
    })
  }

  buildUrl(endpoint: string, options: RequestProps = {}) {
    let url = endpoint;
    const { queryParams, pathParams } = options;
    if (pathParams) { // todo update logic and add exception
      Object.getOwnPropertyNames(pathParams).forEach(key => {
        url = url.replace(new RegExp(`{${key}}`, 'g'), pathParams[key]);
      });
    }
    url.replace(new RegExp('/{.*}', 'g'), '')
    if (queryParams) {
      let queryUrl = Object.getOwnPropertyNames(queryParams)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
        .join('&');
      if (queryUrl) url += `?${queryParams}`;
    }
    return url;
  }

}

export const restService: RestService = new RestServiceImpl();
