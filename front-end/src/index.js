import React from 'react'
import ReactDOM from 'react-dom/client'
import SignIn from './pages/backoffice/SignIn'
import Home from './pages/backoffice/Home'

import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'

const router = createBrowserRouter ([
  {
    path: '/',
    element: <SignIn />
  },
  {
    path: '/home',
    element: <Home />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router}/>
);
