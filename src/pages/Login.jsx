import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { HardHat, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'demo@marblepro.com',
      password: 'demo1234'
    }
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    const success = await login(data.email, data.password)
    setLoading(false)
    if (success) {
      navigate('/')
    }
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden font-sans">

      {/* Dynamic Animated Background Blobs */}
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute rounded-full mix-blend-screen filter blur-[120px] opacity-60 transition-transform duration-1000 hidden md:block"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.8) 0%, rgba(124,58,237,0) 70%)',
            width: '600px', height: '600px',
            left: `${mousePosition.x - 300}px`,
            top: `${mousePosition.y - 300}px`,
          }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/40 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between px-4 py-8 sm:p-8 lg:p-6 gap-8 lg:gap-12">

        {/* Left Side: Brand & Copy */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-left">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/20 border border-white/10 backdrop-blur-sm">
            <HardHat className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 tracking-tight leading-[1.1] mb-6">
            Refine your business operations.
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-lg leading-relaxed">
            Experience the next generation of business management.
          </p>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="w-full lg:w-[450px]">
          <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-sm mb-8">Please enter your details to sign in.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white outline-none transition-all placeholder:text-gray-600 font-medium"
                  placeholder="name@company.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-400 ml-1 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Password is required' })}
                    className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white outline-none transition-all placeholder:text-gray-600 font-medium pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-400 ml-1 mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-white text-black hover:bg-gray-100 rounded-2xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-white hover:text-blue-400 font-semibold transition-colors">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
