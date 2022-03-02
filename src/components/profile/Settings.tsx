import {useAuth} from './../../context/AuthContext';
import avatar from './../../images/default-avatar.png'
import {useState, useEffect} from 'react';
import {useNavigate, Link, Outlet} from 'react-router-dom';
import OptionLayout from '../layout/OptionsLayout';

const {themeChange} = require('theme-change');

export default function Settings() {
    const {currentUser, logout} = useAuth();
    const [error, setError] = useState('')
    const [theme, setTheme] = useState<any>('dark')
    const navigation = useNavigate()

    useEffect(() => {
        themeChange(false)
        const data = localStorage.getItem('theme')
        setTheme(data)
    }, [setTheme])


    const handleLogout = async () => {
        setError('')

        try {
            await logout()
            navigation('/login')
        } catch (error) {
            setError('Failed to logout')
        }
    }

    const handleThemeChange = (e: any) => {
        setTheme(e.target.attributes[1].value)
    }

    function ucfirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    return (
        <OptionLayout title="Settings">
            {error && <div className="error">{error}</div>}
            <div className="flex py-4">
                <Link to="/settings/profile"
                      className="btn btn-ghost w-full h-auto overflow-overlay justify-between py-2">
                    <div className='flex items-center'>
                        <div className="avatar">
                            <div className="w-24 rounded-full">
                                <img src={currentUser.profilePictUrl ?? avatar} alt="avatar" width={100}/>
                            </div>
                        </div>
                        <div className='ml-5 text-left'>
                            <h3 className='text-2xl normal-case'>{ucfirst(currentUser.username)}</h3>
                            <p className='normal-case font-thin'>{currentUser.email}</p>
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <h3 className='text-2xl mr-2'>ID</h3>
                        <kbd className='kbd kbd-lg hover:cursor-default'>{currentUser.appId}</kbd>
                    </div>
                </Link>
            </div>

            <div className="divider mt-0 mb-0"></div>

            <div className="flex py-4">
                <label htmlFor='theme-modal' className='btn btn-ghost w-full overflow-overlay justify-start px-14 h-24'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                    </svg>
                    <div className='ml-14 text-left'>
                        <h3 className='text-2xl normal-case'>Tema</h3>
                        <p className='normal-case font-thin'>{ucfirst(theme)}</p>
                    </div>
                </label>
            </div>

            <input type="checkbox" id="theme-modal" className="modal-toggle"/>
            <div className="modal">
                <div className="modal-box text-center">
                    <h2 className="font-bold text-2xl">Pilih Tema</h2>
                    <button className='btn btn-ghost w-full mt-2' data-set-theme="dark" data-act-class="active"
                            onClick={handleThemeChange}>🌚 Dark
                    </button>
                    <button className='btn btn-ghost w-full' data-set-theme="light" data-act-class="active"
                            onClick={handleThemeChange}>🌝 Light
                    </button>
                    <button className='btn btn-ghost w-full' data-set-theme="retro" data-act-class="active"
                            onClick={handleThemeChange}>👴 Retro
                    </button>
                    <button className='btn btn-ghost w-full' data-set-theme="cyberpunk" data-act-class="active"
                            onClick={handleThemeChange}>🤖 Cyberpunk
                    </button>
                    <button className='btn btn-ghost w-full' data-set-theme="valentine" data-act-class="active"
                            onClick={handleThemeChange}>🌸 Valentine
                    </button>
                    <div className="modal-action">
                        <label htmlFor="theme-modal" className="btn">Close</label>
                    </div>
                </div>
            </div>

            <div className="divider mt-0 mb-0"></div>

            <div className='w-full h-20 flex justify-center items-center my-10'>
                <button className="btn btn-ghost" onClick={handleLogout}>
                    Keluar Aplikasi
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-error ml-2" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </button>
            </div>

            <Outlet/>
        </OptionLayout>
    )
}
