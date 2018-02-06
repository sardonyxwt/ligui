abstract class Provider<Service, Config> {

  private service: Service;
  private config: Config;

  getService() {
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

  abstract createService(config: Config): Service;

}
