import { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Loading from './../Loading';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
    const usernameRef = useRef() as React.RefObject<any>
    const firstNameRef = useRef() as React.RefObject<any>
    const lastNameRef = useRef() as React.RefObject<any>
    const emailRef = useRef() as React.RefObject<any>
    const passwordRef = useRef() as React.RefObject<any>
    const passwordConfirmRef = useRef() as React.RefObject<any>
    const { signup }: any = useAuth()

    const [error, setError] = useState('')
    const [cfmPw, setcfmPw] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setcfmPw('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            await signup(usernameRef.current.value, firstNameRef.current.value, lastNameRef.current.value, emailRef.current.value, passwordRef.current.value, passwordConfirmRef.current.value)
            navigate('/chats')
        } catch (e) {
            console.log(e);
        }
        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Daftar</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input ref={usernameRef} type="text" placeholder="JhonDoe123" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">First Name</span>
                            </label>
                            <input ref={firstNameRef} type="text" placeholder="Jhon" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input ref={lastNameRef} type="text" placeholder="Doe" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                        </div>

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
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input ref={passwordConfirmRef} type="password" placeholder="Confirm Paswword" className={`input input-bordered w-full max-w-xs ${cfmPw && "input-error"}`} />
                            <label className="label">
                                {cfmPw && <span className="label-text-alt text-red-500">{cfmPw}</span>}
                            </label>
                        </div>
                        <div className="justify-end card-actions mt-5">
                            <button className="btn btn-primary" disabled={loading}>
                                {loading ? <Loading /> : 'Daftar'}
                            </button>
                        </div>
                    </form>
                    <div className="w-full text-center mt-3">
                        Sudah memiliki akun? <Link to="/login" className='hover:underline hover:text-accent-focus text-accent'>Log In</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup