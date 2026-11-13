import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [registered, setRegistered] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const { handleRegister, handleResendVerificationEmail } = useAuth()

  const handleSubmit = async(event) => {
    event.preventDefault()

    try {
      await handleRegister({username,email,password})
      setRegistered(true)
      setStatus('Account created. Check your email for a verification link.')
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to create your account. Please try again.')
    }
  }

  const handleResend = async() => {
    setIsResending(true)
    try {
      const response = await handleResendVerificationEmail(email)
      setStatus(response.message)
    } catch (error) {
      setStatus(error.response?.data?.message || 'Unable to resend the verification email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <main className="relative flex h-screen items-start justify-center overflow-x-hidden overflow-y-auto bg-[#070b18] px-4 py-4 text-slate-100 sm:px-6 sm:py-8">
     
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-[-22rem] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute bottom-[-24rem] left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 my-auto w-full max-w-md">
        <header className="mb-6 text-center sm:mb-8">
          <div className="mb-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-200">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-indigo-300" aria-hidden="true">
              <path d="M3.75 6.75h16.5v10.5H3.75z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="m4.5 7.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Nexo AI
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.28em] text-indigo-200/70">Email automation</p>
          <h1 className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
            Get started
          </h1>
          <p className="mt-3 text-sm text-slate-400">
            Create an account to automate your emails.
          </p>
        </header>

        <section className="rounded-2xl border border-white/[0.09] bg-[#0c1222]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex items-center justify-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700/80 bg-slate-800/60 text-slate-300">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <h2 className="mb-6 text-center text-base font-medium text-slate-200">Create your Nexo AI account</h2>

          <form className="space-y-4" onSubmit={registered ? (event) => {
            event.preventDefault()
            handleResend()
          } : handleSubmit}>
            {!registered && <>
            <div>
              <label htmlFor="username" className="mb-2 block text-xs font-medium text-slate-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setStatus('')
                }}
                placeholder="Choose a username"
                className="w-full rounded-lg border border-slate-700/80 bg-[#090e1b] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/15"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-xs font-medium text-slate-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setStatus('')
                }}
                placeholder="name@example.com"
                className="w-full rounded-lg border border-slate-700/80 bg-[#090e1b] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/15"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-xs font-medium text-slate-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setStatus('')
                }}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-slate-700/80 bg-[#090e1b] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-400/15"
              />
            </div>
            </>}

            <button
              type="submit"
              disabled={isResending}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-300/20 bg-indigo-400/10 px-4 py-3 text-sm font-medium text-indigo-100 transition hover:border-indigo-300/40 hover:bg-indigo-400/15 focus:outline-none focus:ring-2 focus:ring-indigo-300/30"
            >
              {registered ? (isResending ? 'Sending…' : 'Resend verification email') : 'Create account'}
              {!registered && <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>}
            </button>
            {status && (
              <p className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-3.5 py-3 text-sm text-amber-200" role="status">
                {status}
              </p>
            )}
          </form>

          <p className="mt-6 border-t border-white/[0.07] pt-5 text-center text-xs text-slate-500">
            Already using Nexo AI?{' '}
            <Link to="/login" className="font-medium text-indigo-200 transition hover:text-white">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  )
}

export default Register
