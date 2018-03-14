import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ligui } from '@core';
import { reactJsxService } from './service/react.jsx.service';

ligui.jsx = reactJsxService;

export * from '@core';
export {React, ReactDOM}
