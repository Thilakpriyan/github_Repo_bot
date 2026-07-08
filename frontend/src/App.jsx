import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Spinner from './components/Spinner'

const HomePage  = lazy(() => import('./pages/HomePage'))
const ChatPage  = lazy(() => import('./pages/ChatPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <Spinner size="lg" className="text-slate-400" />
    </div>
  )
}

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <Navbar />
      {children}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Login has its own full-page layout (no Navbar) */}
            <Route path="/login" element={<LoginPage />} />

            {/* All other pages share the Navbar layout */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            <Route
              path="/chat"
              element={
                <Layout>
                  <ChatPage />
                </Layout>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
