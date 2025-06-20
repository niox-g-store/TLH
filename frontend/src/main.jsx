/**
 * main - entry point for application
 */

import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { APP_MODE } from './constants';

import './styles/_index.scss'

import Application from './Components/Application';


if (APP_MODE === 'dev') {
  createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
        <Application />
    </BrowserRouter>
  </StrictMode>,
  )
} else {
  createRoot(document.getElementById('root')).render(
      <Application />,
    )
}
