import { useRef } from 'react'
import logo from '../../images/google-logo.png'
import { useAuth } from './../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loading from './../Loading';

export default function LoginGoogle({ setError, setLoading, loading }: any) {
    const googleButtonRef = useRef() as React.RefObject<any>
    const { loginWithGoogle }: any = useAuth()

    const navigate = useNavigate()

    const handleClick = async (e: any) => {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await loginWithGoogle()
            navigate('/chat')
        } catch (err) {
            setLoading(false)
            setError('Failed to login with Google')
        }
    }

    return (
        <div>
            <div ref={googleButtonRef} className="tooltip tooltip-bottom" data-tip="Login Dengan Google">
                <button onMouseEnter={() => googleButtonRef.current.class = "tooltip-open"} onClick={handleClick} disabled={loading}>
                    <img src={logo} alt="Logo" width="70" />
                </button>
            </div>
        </div>
    )
}
