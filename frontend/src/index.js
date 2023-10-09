import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import 'react-chat-widget/lib/styles.css';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import Layout from './Layout';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Layout>
    </Layout>
  </Router>
);
