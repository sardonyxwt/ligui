import React from 'react';

/**
 * @var ModuleContext
 * @description Define default context of module.
 */
let ModuleContext: React.Context<string> = null;

if (!!React) {
    ModuleContext = React.createContext<string>(undefined);
}

export { ModuleContext };
