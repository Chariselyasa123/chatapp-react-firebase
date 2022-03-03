import {AuthProvider} from './context/AuthContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/Home';

function App() {
    return (
        <Router>
            {/*<AuthProvider>*/}
            <Routes>
                <Route path='/' element={<Home/>}/>
            </Routes>
            {/*</AuthProvider>*/}
        </Router>
    )
}

export default App
