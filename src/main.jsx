import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
import './styles/buttons.css'

// eslint-disable-next-line react-refresh/only-export-components
const MySpaceRetroView = lazy(() => import('./pages/MySpaceRetroView'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/retro"
            element={
              <Suspense fallback={null}>
                <MySpaceRetroView />
              </Suspense>
            }
          />
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
