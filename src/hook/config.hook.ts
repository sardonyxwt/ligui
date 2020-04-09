import * as React from 'react';
import { Container } from 'inversify';
import { ConfigService } from '../service/config.service';
import { LIGUI_TYPES } from '../types';
import { ConfigData, ConfigId, ConfigStore } from '../store/config.store';

let ConfigKeyContext: React.Context<string> = null;

if (!!React) {
    ConfigKeyContext = React.createContext<string>(undefined);
}

export { ConfigKeyContext };

export const createConfigHook = (
    container: Container
) => <T extends ConfigData = ConfigData>(
    key: string, context?: string
): T => {
    const configStore = container.get<ConfigStore>(LIGUI_TYPES.CONFIG_STORE);
    const configService = container.get<ConfigService>(LIGUI_TYPES.CONFIG_SERVICE);

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
