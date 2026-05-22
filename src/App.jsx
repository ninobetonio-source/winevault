import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Wines from './pages/Wines'
import WineDetails from './pages/WineDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import TrackOrder from './pages/TrackOrder'
import DebugSupabase from './pages/DebugSupabase'
import Login from './pages/Login'
import About from './pages/About'
import Header from './components/Header'
import Footer from './components/Footer'
import AdminLayout from './dashboard/AdminLayout'
import ManageWines from './dashboard/ManageWines'
import ManageOrders from './dashboard/ManageOrders'
import ManageUsers from './dashboard/ManageUsers'
import Analytics from './dashboard/Analytics'
import StaffLayout from './dashboard/StaffLayout'
import StaffOverview from './dashboard/StaffOverview'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'

function Protected({ children, role }) {
  const { user, authLoading } = useAuth()
  if (authLoading) return <div className="h-screen flex items-center justify-center bg-[#0b0b0d] text-gold animate-pulse">Initializing Auth...</div>
  if (!user) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/login" replace />
  return children
}

import toast, { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Toaster 
            position="bottom-center" 
            toastOptions={{ 
              style: { 
                background: '#0b0b0d', 
                color: '#fff', 
                border: '1px solid #d4af37',
                boxShadow: '0 0 20px rgba(212,175,55,0.2)'
              } 
            }} 
          />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wines" element={<Wines />} />
              <Route path="/about" element={<About />} />
              <Route path="/wines/:id" element={<WineDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/debug-supabase" element={<DebugSupabase />} />

              <Route path="/admin" element={<Protected role="admin"><AdminLayout /></Protected>}>
                <Route index element={<Navigate to="wines" replace />} />
                <Route path="wines" element={<ManageWines />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="analytics" element={<Analytics />} />
              </Route>
              
              <Route path="/staff" element={<Protected role="staff"><StaffLayout /></Protected>}>
                <Route index element={<StaffOverview />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="store" element={<ManageWines />} />
              </Route>

              <Route path="*" element={<div className="p-12 text-center text-gray-400 font-light">Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}
