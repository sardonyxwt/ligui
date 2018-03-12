import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ligui } from '../common';
import { reactJsxService } from './service/react.jsx.service';

ligui.jsx = reactJsxService;

export * from '../common';
export {React, ReactDOM}
