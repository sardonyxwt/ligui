import * as React from 'react';
import { Switch as BrowserSwitch } from 'react-router-dom';
import { Switch as MemorySwitch, SwitchProps } from 'react-router';
import { useRouterType } from './router.component';

export { SwitchProps };

export function Switch(props: SwitchProps) {
    const ReactSwitch = useRouterType() === 'browser' ? BrowserSwitch : MemorySwitch;
    return <ReactSwitch {...props} />
}
