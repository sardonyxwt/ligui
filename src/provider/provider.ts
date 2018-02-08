export abstract class Provider<Service, Config> {

  private service: Service;
  private config: Config;

  getService() {
    if (!this.config) {
      throw new Error('Before get service first configure it.');
    }
    if (!this.service) {
      this.service = this.createService(this.config);
    }
    return this.service;
  }

  configure(config: Config) {
    if (this.config) {
      throw new Error('Configuration must call once.');
    }
    this.config = config;
  }

  protected abstract createService(config: Config): Service;

}
