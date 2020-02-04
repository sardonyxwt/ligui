import * as React from 'react';
import { Redirect as BrowserRedirect, } from 'react-router-dom';
import { Redirect as MemoryRedirect, RedirectProps } from 'react-router';
import { useRouterType } from './router.component';

export { RedirectProps };

export function Redirect(props: RedirectProps) {
    const ReactRedirect = useRouterType() === 'browser' ? BrowserRedirect : MemoryRedirect;
    return <ReactRedirect {...props}/>
}
