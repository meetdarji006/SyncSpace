import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import SelectOrganization from './pages/SelectOrganization'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/select-organization"
                    element={
                        // <ProtectedRoute>
                            <SelectOrganization />
                        // </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    )
}
