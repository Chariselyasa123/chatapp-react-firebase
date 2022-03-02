import { useNavigate } from 'react-router-dom';

export default function OptionLayout({ children, title }: any) {
    const navigation = useNavigate()

    return (
        <div>
            <nav className="navbar bg-base-100 mb-8 shadow-xl rounded-box">
                <div className="navbar-start">
                    <button className="btn btn-ghost btn-circle" onClick={() => navigation(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className="navbar-center">
                    <a className="btn btn-ghost normal-case text-xl">{title}</a>
                </div>
                <div className="navbar-end">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                </div>
            </nav>
            {children}

        </div>
    )
}
