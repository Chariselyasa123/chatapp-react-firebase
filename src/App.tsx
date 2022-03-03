import {AuthProvider} from './context/AuthContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Login from "./components/auth/Login";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/login' element={<Login/>}/>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
