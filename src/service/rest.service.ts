export interface RequestProps extends RequestInit {
  queryParams?: { [key: string]: string }
}

export class RestService {

  private _defaultProps: RequestInit;
  private static instance: RestService;

  private constructor() {
    this._defaultProps = {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new RestService());
  }

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
    return this.request(endpoint, Object.assign(this._defaultProps, options, {
      method: 'POST'
    }));
  }

  put(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(this._defaultProps, options, {
      method: 'PUT'
    }));
  }

  get(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(this._defaultProps, options, {
      method: 'GET'
    }));
  }

  del(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(this._defaultProps, options, {
      method: 'DELETE'
    }));
  }

  request(endpoint: string, options: RequestProps) {
    if (options.headers && options.headers['Content-Type'].includes('application/json')) {
      options.body = JSON.stringify(options.body);
    }
    return fetch(this.buildUrl(endpoint, options), options).then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    })
  }

  buildUrl(endpoint: string, options: RequestProps) {
    let url = endpoint;
    const queryParams = options.queryParams;
    if (queryParams) {
      url += '?';
      url += Object.keys(queryParams)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(queryParams[k]))
        .join('&');
    }
    return url;
  }

}
