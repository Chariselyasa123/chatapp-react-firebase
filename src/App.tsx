import Signup from './components/auth/Signup';
import {AuthProvider} from './context/AuthContext';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/auth/Login';
import PrivateRoute from './components/PrivateRoute';
import LupaPassword from './components/auth/LupaPassword';
import Settings from './components/profile/Settings';
import AddFriend from './components/friend/AddFriend';
import Profile from './components/profile/partials/Profile';
import Friend from './components/friend/Friend';
import Chat from './components/chat/Chat';
import SearchFriendChat from './components/chat/SearchFriendChat';
import UserChat from './components/chat/UserChat';
import Home from './components/Home';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path='/chats' element={<PrivateRoute/>}>
                        <Route path='/chats' element={<Chat/>}/>
                    </Route>
                    <Route path='/chats/cari-teman' element={<PrivateRoute/>}>
                        <Route path='/chats/cari-teman' element={<SearchFriendChat/>}/>
                    </Route>
                    <Route path='/chat/:id' element={<PrivateRoute/>}>
                        <Route path='/chat/:id' element={<UserChat/>}/>
                    </Route>
                    <Route path='/settings' element={<PrivateRoute/>}>
                        <Route path='/settings' element={<Settings/>}/>
                    </Route>
                    <Route path='/settings/profile' element={<PrivateRoute/>}>
                        <Route path='/settings/profile' element={<Profile/>}/>
                    </Route>
                    <Route path='/teman' element={<PrivateRoute/>}>
                        <Route path='/teman' element={<Friend/>}/>
                    </Route>
                    <Route path='/teman/tambah-teman' element={<PrivateRoute/>}>
                        <Route path='/teman/tambah-teman' element={<AddFriend/>}/>
                    </Route>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path="/daftar" element={<Signup/>}/>
                    <Route path="/lupa-password" element={<LupaPassword/>}/>
                </Routes>
            </AuthProvider>
        </Router>
    )
}

export default App
