import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ApplyForm from './pages/ApplyForm';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-mesh">
                <Navbar />
                <Routes>
                    <Route path="/"            element={<Home />}      />
                    <Route path="/apply"       element={<ApplyForm />} />
                    <Route path="/result/:id"  element={<Result />}    />
                    <Route path="/dashboard"   element={<Dashboard />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}