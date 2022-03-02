import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';

const PrivateRoute = () => {
    const { currentUser }: any = useAuth()


    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute