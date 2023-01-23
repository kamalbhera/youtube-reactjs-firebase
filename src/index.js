// react
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './reset.css';
// redux
import store from './redux/store';
import { Provider } from 'react-redux';
// components
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import App from './App';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
