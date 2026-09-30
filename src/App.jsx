import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { InvoiceProvider } from './context/InvoiceContext';
import Home from './pages/Home';
import Workspace from './pages/Workspace';

function App() {
    return (
        <HelmetProvider>
            <InvoiceProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/workspace" element={<Workspace />} />
                    </Routes>
                </Router>
            </InvoiceProvider>
        </HelmetProvider>
    );
}

export default App;
