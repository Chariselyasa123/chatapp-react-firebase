import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const app = firebase.initializeApp({
    apiKey: "AIzaSyA-Dgl_917_oCwX1ZYesMy80X-2pzHhHRE",
    authDomain: "react-chat-32ca4.firebaseapp.com",
    projectId: "react-chat-32ca4",
    storageBucket: "react-chat-32ca4.appspot.com",
    messagingSenderId: "405845022223",
    appId: "1:405845022223:web:823e20cb4e83babd9ff57a",
    measurementId: "G-SF2LQD24LT"
})

const auth = app.auth()
let db = firebase.firestore()
let storage = firebase.storage()

export { auth, firebase, db, storage }
export default app