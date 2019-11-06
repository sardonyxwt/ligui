import * as React from 'react';
import { Container } from 'inversify';
import { ConfigService, Configurator } from '../service/config.service';
import { LIGUI_TYPES } from '../types';

let ConfigKeyContext: React.Context<string> = null;

if (!!React) {
    ConfigKeyContext = React.createContext<string>(undefined);
}

export { ConfigKeyContext };

export type ConfiguratorHookReturnType = [Configurator, boolean];

export const createConfiguratorHook = (
    container: Container
) => (
    configUnitKey: string, context?: string
): ConfiguratorHookReturnType => {
    const configService = container.get<ConfigService>(LIGUI_TYPES.CONFIG_SERVICE);

    const configContext = context || React.useContext(ConfigKeyContext);

    function getConfigurator(): Configurator {
        const configurator = configService.getConfigurator(configContext);

        return <T = string>(key: string, defaultValue?: T) => configurator<T>(`${configUnitKey}.${key}`, defaultValue);
    }

    function checkIsConfigUnitLoaded() {
        return configService.isConfigUnitLoaded({
            key: configUnitKey, context: configContext
        });
    }

    function prepareConfigurator() {
        return checkIsConfigUnitLoaded() ? getConfigurator() : null;
    }

    const [configurator, setConfigurator] = React.useState<Configurator>(prepareConfigurator);

    React.useEffect(() => {
        if (configurator) {
            return;
        }
        configService.loadConfigUnitData({
            key: configUnitKey, context: configContext
        }).then(() => setConfigurator(() => getConfigurator()));
    }, [configurator]);

    return [
        configurator || (<T>(id, defaultValue) => defaultValue as T), !!configurator
    ];
};
