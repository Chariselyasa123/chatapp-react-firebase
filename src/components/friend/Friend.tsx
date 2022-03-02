import OptionLayout from '../layout/OptionsLayout';
import { useAuth } from './../../context/AuthContext';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import { db } from '../../lib/firebase';
import { Link } from 'react-router-dom';
import avatar from '../../images/default-avatar.png';
import Loading from './../Loading';

interface IModalData {
    username: string | undefined,
    uid: string | undefined,
}

export default function Friend() {
    const { currentUser, refreshData } = useAuth()
    const [alertMessage, setAlertMessage] = useState('')
    const [messagePending, setMessagePending] = useState<string>('')
    const [messageRequest, setMessageRequest] = useState<string>('')
    const [messageFriends, setMessageFriends] = useState<string>('')
    const [refreshFriends, setRefreshFriends] = useState(false)
    const [pending, setPending] = useState<any[]>([])
    const [request, setRequest] = useState<any[]>([])
    const [friends, setFriends] = useState<any[]>([])
    const [modalData, setModalData] = useState<IModalData>({
        username: '',
        uid: '',
    })
    const [loading, setLoading] = useState(false)
    const pendingBtnToolTipRef = useRef() as React.RefObject<any>
    const requestAccBtnToolTipRef = useRef() as React.RefObject<any>
    const requestDecBtnToolTipRef = useRef() as React.RefObject<any>
    const modalDelFriendRef = useRef() as React.RefObject<any>
    const addFrienBtnTooltipRef = useRef() as React.RefObject<any>

    useEffect(() => {
        setMessagePending('')
        setMessageRequest('')
        setMessageFriends('')

        if (currentUser.friendsPending && currentUser.friendsPending.length > 0) {
            currentUser.friendsPending.forEach(async (id: any) => {
                const user = await db.collection('users').doc(id).get()
                setPending(state => [...state, { ...user.data(), uid: user.id }])
            })
        } else {
            setMessagePending('Tidak ada teman yang di undang')
        }

        if (currentUser.friendsInvited && currentUser.friendsInvited.length > 0) {
            currentUser.friendsInvited.forEach(async (id: any) => {
                const user = await db.collection('users').doc(id).get()
                setRequest(state => [...state, { ...user.data(), uid: user.id }])
            })
        } else {
            setMessageRequest('Tidak ada permintaan pertemanan')
        }

        if (currentUser.friends && currentUser.friends.length > 0) {
            currentUser.friends.forEach(async (id: any) => {
                const user = await db.collection('users').doc(id).get()
                setFriends(state => [...state, { ...user.data(), uid: user.id }])
            })
        } else {
            setMessageFriends('Tidak ada teman 😔')
        }

        if (refreshFriends) setRefreshFriends(false)

        return () => {
            setPending([])
            setRequest([])
            setFriends([])
        }
    }, [refreshFriends])

    function ucfirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const handleAccFriend = async (uid: string) => {
        setLoading(true)
        // for current user
        try {
            let friendRequest = currentUser.friendsInvited
            const indexRequest = friendRequest.indexOf(uid)
            if (indexRequest > -1) {
                friendRequest.splice(indexRequest, 1);
            }
            await db.collection('users').doc(currentUser.uid).update({
                friendsInvited: friendRequest
            })
            await db.collection('users').doc(currentUser.uid).set({
                friends: friends.length > 0 ? [...currentUser.friends, uid] : [uid]
            }, { merge: true })

            // For requested friend
            const response = await db.collection('users').doc(uid).get()
            const requestedFriend = response.data()

            let friendsPending = requestedFriend?.friendsPending
            const indexPeding = friendsPending.indexOf(currentUser.uid)
            if (indexPeding > -1) {
                friendsPending.splice(indexPeding, 1);
            }
            await db.collection('users').doc(uid).update({
                friendsPending
            })
            await db.collection('users').doc(uid).set({
                friends: requestedFriend?.friends.length > 0 ? [...requestedFriend?.friends, currentUser.uid] : [currentUser.uid]
            }, { merge: true })
            refreshData()
            setRefreshFriends(true)
            setLoading(false)
            setAlertMessage('Berhasil menyetujui permintaan pertemanan');
            window.location.reload()
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    const handleDelFriend = async (uid: string | undefined) => {
        setAlertMessage('')
        setLoading(true)
        // for current user
        try {
            let friendCurUser = currentUser.friends
            const index = friendCurUser.indexOf(uid)
            if (index > -1) {
                friendCurUser.splice(index, 1);
            }
            await db.collection('users').doc(currentUser.uid).update({
                friends: friendCurUser
            })

            // For deleted friend
            const response = await db.collection('users').doc(uid).get()
            const deletedFriend = response.data()

            let friendDeleted = deletedFriend?.friends
            const indexFriend = friendDeleted.indexOf(currentUser.uid)
            if (indexFriend > -1) {
                friendDeleted.splice(indexFriend, 1);
            }
            await db.collection('users').doc(uid).update({
                friends: friendDeleted
            })
            setLoading(false)
            modalDelFriendRef.current.classList.remove('modal-open')
            setAlertMessage('Berhasil menghapus pertemanan');
            refreshData()
            setRefreshFriends(!refreshFriends)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    const handleDelFriendModalBtn = (state: string, username?: string, uid?: string) => {
        setModalData({ username, uid })
        modalDelFriendRef.current.className = `modal ${state === 'open' ? "modal modal-open" : "modal"}`;
    }

    const handleCanclePendingFried = async (uid: string) => {
        setAlertMessage('')
        setLoading(true)
        // for current user
        try {
            let friendRequest = currentUser.friendsPending
            const indexRequest = friendRequest.indexOf(uid)
            if (indexRequest > -1) {
                friendRequest.splice(indexRequest, 1);
            }
            await db.collection('users').doc(currentUser.uid).update({
                friendsPending: friendRequest
            })

            // For requested friend
            const response = await db.collection('users').doc(uid).get()
            const requestedFriend = response.data()

            let friendsInvited = requestedFriend?.friendsInvited
            const indexPeding = friendsInvited.indexOf(currentUser.uid)
            if (indexPeding > -1) {
                friendsInvited.splice(indexPeding, 1);
            }
            await db.collection('users').doc(uid).update({
                friendsInvited
            })

            setLoading(false)
            setAlertMessage('Berhasil membatalkan permintaan pertemanan');
            refreshData()
            setRefreshFriends(true)
        } catch (error) {
            console.log(error);
        }
    }

    const handleDecFriendRequest = async (uid: string) => {
        setAlertMessage('')
        setLoading(true)
        try {
            // for current user
            let friendsInvited = currentUser.friendsInvited
            const indexRequest = friendsInvited.indexOf(uid)
            if (indexRequest > -1) {
                friendsInvited.splice(indexRequest, 1);
            }
            await db.collection('users').doc(currentUser.uid).update({
                friendsInvited
            })

            // For requested friend
            const response = await db.collection('users').doc(uid).get()
            const requestedFriend = response.data()

            let friendsPending = requestedFriend?.friendsPending
            const indexPeding = friendsPending.indexOf(currentUser.uid)
            if (indexPeding > -1) {
                friendsPending.splice(indexPeding, 1);
            }
            await db.collection('users').doc(uid).update({
                friendsPending
            })

            setLoading(false)
            setAlertMessage('Berhasil menolak permintaan pertemanan');
            refreshData()
            setRefreshFriends(true)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    return (
        <OptionLayout title="Teman">
            {alertMessage &&

                <div className="alert shadow-lg alert-success">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{alertMessage}</span>
                    </div>
                </div>
            }
            <div className='divider'>Pending</div>
            {messagePending && <p className='text-secondary-content text-sm text-center'>{messagePending}</p>}
            {pending && pending.map((user, idx: number) => {
                return (
                    <div className="w-full h-auto overflow-overlay flex justify-between py-2" key={idx}>
                        <div className='flex items-center'>
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={user.profilePictUrl ?? avatar} alt="avatar" width={100} />
                                </div>
                            </div>
                            <div className='ml-5 text-left'>
                                <h3 className='text-2xl normal-case'>{ucfirst(user.username)}</h3>
                                <p className='normal-case font-thin'>{user.email}</p>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <div className="tooltip tooltip-left" data-tip="Batalkan permintaan pertemanan ?" ref={pendingBtnToolTipRef}>
                                <button className={`btn btn-circle mr-4 hover:rotate-180 transition-all ${loading && "loading"}`}
                                    onMouseEnter={() => pendingBtnToolTipRef.current.class = 'tooltip-open'}
                                    onClick={() => handleCanclePendingFried(user.uid)}
                                >
                                    {!loading &&
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}

            <div className='divider'>Request</div>
            {messageRequest && <p className='text-secondary-content text-sm text-center'>{messageRequest}</p>}
            {request && request.map((user, idx: number) => {
                return (
                    <div className="w-full h-auto overflow-overlay flex justify-between py-2" key={idx}>
                        <div className='flex items-center'>
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={user.profilePictUrl ?? avatar} alt="avatar" width={100} />
                                </div>
                            </div>
                            <div className='ml-5 text-left'>
                                <h3 className='text-2xl normal-case'>{ucfirst(user.username)}</h3>
                                <p className='normal-case font-thin'>{user.email}</p>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <div className="tooltip tooltip-bottom" data-tip="Terima" ref={requestAccBtnToolTipRef}>
                                <button className={`btn btn-circle mr-4 hover:rotate-180 transition-all ${loading && 'loading'}`}
                                    onMouseEnter={() => requestAccBtnToolTipRef.current.class = 'tooltip-open'}
                                    onClick={() => handleAccFriend(user.uid)}
                                >
                                    {!loading &&
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    }
                                </button>
                            </div>
                            <div className="tooltip tooltip-bottom" data-tip="Tolak" ref={requestDecBtnToolTipRef}>
                                <button className={`btn btn-circle mr-4 hover:rotate-180 transition-all ${loading && 'loading'}`}
                                    onMouseEnter={() => requestDecBtnToolTipRef.current.class = 'tooltip-open'}
                                    onClick={() => handleDecFriendRequest(user.uid)}
                                >
                                    {!loading &&
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}

            <div className='divider'>Teman</div>
            {messageFriends && <p className='text-secondary-content text-sm text-center'>{messageFriends}</p>}
            {friends && friends.map((user: any, idx: number) => {
                return (
                    <div className="w-full h-auto overflow-overlay flex justify-between py-2" key={idx}>
                        <div className='flex items-center'>
                            <div className="avatar">
                                <div className="w-24 rounded-full">
                                    <img src={user.profilePictUrl ?? avatar} alt="avatar" width={100} />
                                </div>
                            </div>
                            <div className='ml-5 text-left'>
                                <h3 className='text-2xl normal-case'>{ucfirst(user.username)}</h3>
                                <p className='normal-case font-thin'>{user.email}</p>
                            </div>
                        </div>
                        <div className='flex items-center'>
                            <div className="tooltip tooltip-left" data-tip="Batalkan pertemanan ?" ref={pendingBtnToolTipRef}>
                                <button className="btn btn-circle mr-4 hover:rotate-180 transition-all"
                                    onMouseEnter={() => pendingBtnToolTipRef.current.class = 'tooltip-open'}
                                    onClick={() => handleDelFriendModalBtn('open', user.username, user.uid)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            })}

            {/* Tombol tambah teman */}
            <div className='fixed bottom-9 right-9'>
                <div className="tooltip tooltip-left" data-tip="Tambah Teman 👏" ref={addFrienBtnTooltipRef}>
                    <Link to="/teman/tambah-teman" className="btn btn-lg btn-circle relative" onClick={() => addFrienBtnTooltipRef.current.classList.add('tooltip-open')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 absolute top-0.5 right-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>

            {/* Modal untuk menghapus pertemanan */}
            <div className="modal" ref={modalDelFriendRef}>
                <div className="modal-box">
                    <h2 className="font-bold text-2xl flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Perhatian!
                    </h2>
                    <p className="py-4">Kamu akan membatalkan pertemanan dengan <strong>{modalData.username}</strong></p>
                    <div className="modal-action">
                        <button className='btn' onClick={() => handleDelFriend(modalData.uid)}>
                            {loading ? <Loading /> : 'Ya'}
                        </button>
                        <button className="btn btn-primary" onClick={() => handleDelFriendModalBtn('close')}>Batal</button>
                    </div>
                </div>
            </div>
        </OptionLayout>
    )
}
