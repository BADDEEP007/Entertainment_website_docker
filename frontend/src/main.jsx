import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './Components/Error_boundary.jsx'

createRoot(document.getElementById('root')).render(
 <ErrorBoundary>

    <App />
 </ErrorBoundary>
 
    
  
)
