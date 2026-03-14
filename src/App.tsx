import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TaskProvider } from './store/taskStore';
import { StabilityProvider } from './store/stabilityStore';
import { AuthProvider } from './store/authStore';

function App() {
    return (
        <AuthProvider>
            <StabilityProvider>
                <TaskProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            
                            {/* Define a route that wraps actual app content and requires auth (simplified for now) */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Dashboard />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            } />
                            <Route path="/tasks" element={
                                <ProtectedRoute>
                                    <DashboardLayout>
                                        <Tasks />
                                    </DashboardLayout>
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </BrowserRouter>
                </TaskProvider>
            </StabilityProvider>
        </AuthProvider>
    );
}

export default App;
