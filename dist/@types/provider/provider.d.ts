export declare abstract class Provider<Service, Config> {
    private service;
    private config;
    getService(): Service;
    configure(config: Config): void;
    abstract createService(config: Config): Service;
}
