import { render as renderAsString } from 'preact-render-to-string';
import { ligui } from './ligui';

ligui.ssr = renderAsString;

export * from './ligui';
