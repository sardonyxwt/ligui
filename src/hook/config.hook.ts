import * as Container from 'bottlejs';
import * as React from 'react';
import { ConfigService } from '../service/config.service';
import { LIGUI_TYPES } from '../types';
import { ConfigData, ConfigId, ConfigStore } from '../store/config.store';

let ConfigKeyContext: React.Context<string> = null;

if (!!React) {
    ConfigKeyContext = React.createContext<string>(undefined);
}

export { ConfigKeyContext };

export const createConfigHook = (
    container: Container.IContainer
) => <T extends ConfigData = ConfigData>(
    key: string, context?: string
): T => {
    const configStore = container[LIGUI_TYPES.CONFIG_STORE] as ConfigStore;
    const configService = container[LIGUI_TYPES.CONFIG_SERVICE] as ConfigService;

    const configContext = context || React.useContext(ConfigKeyContext);

    const id: ConfigId = {key, context: configContext};

    const prepareConfigData = () => {
        if (configStore.isConfigExist(id)) {
            return configStore.findConfigById<T>(id).data;
        }
        const config = configService.loadConfig<T>(id);
        return config instanceof Promise ? null : config.data;
    };

    const [config, setConfig] = React.useState<T>(prepareConfigData);

    React.useEffect(() => {
        if (config) {
            return;
        }
        Promise.resolve(configService.loadConfig<T>(id)).then(
            config => setConfig(() => config.data)
        );
    }, [config]);

    return config;
};
