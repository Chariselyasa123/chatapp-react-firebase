import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../Loading';

function LupaPassword() {
    const emailRef = useRef() as React.RefObject<any>
    const { resetPassword }: any = useAuth()

    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            setError('')
            setMessage('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Lihat email anda untuk melakukan reset password')
        } catch (err: any) {
            setLoading(false)
            if (err.code === 'auth/user-not-found') setError('Email tidak terdaftar')
            if (err.code === 'auth/invalid-email') setError('Email tidak valid')
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Rest Password</h2>
                    {error && <p className="text-red-300 text-sm">{error}</p>}
                    {message && <p className="text-green-300 text-sm">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input ref={emailRef} type="email" placeholder="jhondoe@gmail.com" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                        </div>
                        <div className="justify-end card-actions mt-5">
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? <Loading /> : 'Rest Password'}
                            </button>
                        </div>
                    </form>
                    <div className="w-full text-center mt-2">
                        <Link to="/login" className='hover:underline hover:text-red-500 text-red-200'>Kembali</Link>
                    </div>
                    <div className="w-full text-center mt-3">
                        Tidak memiliki akun? <Link to="/daftar" className='hover:underline hover:text-red-500 text-red-200'>Daftar</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LupaPassword