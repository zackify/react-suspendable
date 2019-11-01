// import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './src/App';

//@ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.Suspense fallback={<div>Full app loader...</div>}>
    <App />
  </React.Suspense>
);
