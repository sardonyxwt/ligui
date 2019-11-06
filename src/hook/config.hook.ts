import * as React from 'react';
import { Container } from 'inversify';
import { ConfigService } from '../service/config.service';
import { LIGUI_TYPES } from '../types';

let ConfigKeyContext: React.Context<string> = null;

if (!!React) {
    ConfigKeyContext = React.createContext<string>(undefined);
}

export { ConfigKeyContext };

export const createConfigHook = (
    container: Container
) => <T extends {}>(
    configUnitKey: string, context?: string
): T => {
    const configService = container.get<ConfigService>(LIGUI_TYPES.CONFIG_SERVICE);

    const configContext = context || React.useContext(ConfigKeyContext);

    function prepareConfig() {
        return configService.getConfigUnitData({key: configUnitKey, context}) as T;
    }

    const [config, setConfig] = React.useState<T>(prepareConfig);

    React.useEffect(() => {
        if (config) {
            return;
        }
        configService.loadConfigUnitData({
            key: configUnitKey, context: configContext
        }).then(() => setConfig(prepareConfig));
    }, []);

    return config;
};
