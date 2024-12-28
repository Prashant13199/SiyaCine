import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeContext from './Services/ThemeContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThemeContext>
        <App />
    </ThemeContext>
);
serviceWorkerRegistration.unregister();
reportWebVitals();
