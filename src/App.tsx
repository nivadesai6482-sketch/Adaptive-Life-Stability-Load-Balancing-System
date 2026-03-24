import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TaskProvider } from './store/taskStore';
import { StabilityProvider } from './store/stabilityStore';
import { AuthProvider } from './store/authStore';
import { ToastProvider } from './store/toastStore';
import { ThemeProvider } from './store/themeStore';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <ToastProvider>
                    <AuthProvider>
                        <StabilityProvider>
                            <TaskProvider>
                                <BrowserRouter>
                                    <Routes>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />

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
                                        <Route path="/settings" element={
                                            <ProtectedRoute>
                                                <DashboardLayout>
                                                    <Settings />
                                                </DashboardLayout>
                                            </ProtectedRoute>
                                        } />
                                        <Route path="/profile" element={
                                            <ProtectedRoute>
                                                <DashboardLayout>
                                                    <Profile />
                                                </DashboardLayout>
                                            </ProtectedRoute>
                                        } />
                                    </Routes>
                                </BrowserRouter>
                            </TaskProvider>
                        </StabilityProvider>
                    </AuthProvider>
                    <ToastContainer />
                </ToastProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
