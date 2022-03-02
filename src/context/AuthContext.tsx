import React, { useContext, useEffect, useState } from "react"
import { auth, firebase, db } from '../lib/firebase'
import { useNavigate } from 'react-router-dom';
const { themeChange } = require('theme-change');

interface IAuthContext {
    currentUser: any
    signup: (username: string, firstName: string, lastName: string, email: string, password: string) => Promise<firebase.auth.UserCredential>
    login: (email: string, password: string) => Promise<firebase.auth.UserCredential>
    loginWithGoogle: () => Promise<firebase.auth.UserCredential>
    logout: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    refreshData: () => void
}

const AuthContext = React.createContext<IAuthContext>({} as IAuthContext)

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: any) {

    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate()

    function makeid(length: number) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    const refreshData = () => setRefresh(!refresh);

    const signup = async (username: string, firstName: string, lastName: string, email: string, password: string) => {
        const response = await auth.createUserWithEmailAndPassword(email, password)
        db.collection('users').doc(response.user?.uid).set({
            username, email, firstName, lastName, appId: `#${makeid(5)}`
        })
        return response
    }

    const login = (email: string, password: string) => {
        return auth.signInWithEmailAndPassword(email, password)
    }

    const loginWithGoogle = () => {
        return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    }

    const logout = () => {
        return auth.signOut()
    }

    const resetPassword = (email: string) => {
        return auth.sendPasswordResetEmail(email)
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user: any) => {

            if (!user) {
                navigate('/login')
            }

            // get firestore user data
            if (user) {
                const response = await db.collection('users').doc(user.uid).get()
                let merged = { ...user._delegate, ...response.data() }
                setCurrentUser(merged)
                setLoading(false)
            }

            if (refresh) setRefresh(!refresh)

        })
        themeChange(false)

        return unsubscribe()
    }, [refresh])


    const value = {
        currentUser,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        refreshData
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}