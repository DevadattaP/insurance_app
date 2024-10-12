import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Custom styles
import App from './App'; // Main App component
import reportWebVitals from './reportWebVitals'; // Performance measuring
import { AppProvider } from './AppContext'; // Contract context provider
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS for styling

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <App />
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
