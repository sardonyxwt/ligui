import * as React from 'react';
import * as History from 'history';
import { LinkProps } from 'react-router-dom';
import { LocationDescriptorObject } from 'history';
import { resolveFunctionCall } from '@sardonyxwt/utils/function';
import { RouteContext } from './route.component';
import { eventTrap, isModifiedEvent } from '../service/jsx.service';

const normalizeToLocation = (
    to: History.LocationDescriptor | ((location: History.Location<any>) => History.LocationDescriptor<any>),
    currentLocation
) => {
    return typeof to === 'string'
        ? History.createLocation(to, null, currentLocation)
        : to;
};

export function Link(
    {
        to,
        replace,
        innerRef,
        onClick,
        ...anchorProps
    }: LinkProps
) {
    const {history, location} = React.useContext(RouteContext);

    const normalizedLocation = normalizeToLocation(to, location) as LocationDescriptorObject<any>;

    const href = normalizedLocation ? history.createHref(normalizedLocation) : '';

    const onAnchorClick = (evt: React.MouseEvent<HTMLAnchorElement>) => {
        try {
            resolveFunctionCall(onClick)(evt);
        } catch (err) {
            eventTrap(evt);
            throw err;
        }

        const { target } = anchorProps;

        const isTargetSelf = !target || target === '_self';
        const isLeftClick = evt.button === 0;
        const isNotPrevented = !evt.defaultPrevented;

        const useNavigation = isNotPrevented && isLeftClick && isTargetSelf && !isModifiedEvent(evt);

        if (useNavigation) {
            eventTrap(evt);
            replace
                ? history.replace(normalizedLocation)
                : history.push(normalizedLocation);
        }
    };

    return <a {...anchorProps} ref={innerRef} href={href} onClick={onAnchorClick}/>;
}
