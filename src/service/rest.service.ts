export interface RequestProps extends RequestInit {
  queryParams?: { [key: string]: string }
}

const defaultProps: RequestProps = {
  credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

export class RestService {

  private static instance: RestService;

  private constructor() {
  }

  static get INSTANCE() {
    return this.instance || (this.instance = new RestService());
  }

  post(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(defaultProps, options, {
      method: 'POST'
    }));
  }

  put(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(defaultProps, options, {
      method: 'PUT'
    }));
  }

  get(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(defaultProps, options, {
      method: 'GET'
    }));
  }

  del(endpoint: string, options: RequestProps = {}) {
    return this.request(endpoint, Object.assign(defaultProps, options, {
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
