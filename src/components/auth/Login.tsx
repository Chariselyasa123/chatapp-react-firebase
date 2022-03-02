import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading';
import LoginGoogle from './LoginGoogle';

function Login() {
    const emailRef = useRef() as React.RefObject<any>
    const passwordRef = useRef() as React.RefObject<any>
    const { login, refreshData }: any = useAuth()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            refreshData()
            navigate('/chats')
        } catch (err: any) {
            setLoading(false)
            if (err.code === 'auth/user-not-found') setError('User tidak terdaftar')
            if (err.code === 'auth/invalid-email') setError('Email tidak valid')
            if (err.code === 'auth/wrong-password') setError('Password salah')
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Login</h2>
                    {error && <p className="text-red-300 text-sm">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input ref={emailRef} type="email" placeholder="jhondoe@gmail.com" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input ref={passwordRef} type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                        </div>
                        <div className="justify-end card-actions mt-5">
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? <Loading /> : 'Login'}
                            </button>
                        </div>
                    </form>
                    <div className="w-full text-center mt-2">
                        <Link to="/lupa-password" className='hover:underline hover:text-accent-focus text-accent'>Lupa Password?</Link>
                    </div>
                    <div className="w-full text-center mt-3">
                        Tidak memiliki akun? <Link to="/daftar" className='hover:underline hover:text-accent-focus text-accent'>Daftar</Link>
                    </div>
                    <div className="divider">Atau</div>
                    <div className='flex justify-center items-center'>
                        <LoginGoogle setError={setError} setLoading={setLoading} loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login