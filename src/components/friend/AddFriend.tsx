import { useState, useRef } from 'react';
import OptionLayout from '../layout/OptionsLayout';
import Loading from '../Loading';
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext';

export default function AddFriend() {
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const userIdRef = useRef() as React.RefObject<any>
    const { currentUser, refreshData } = useAuth()

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        // invite friend from userIdRef.current.value to firestore
        try {
            setError('')
            setSuccess('')
            setLoading(true)

            const invitedAppId = await db.collection('users').where('appId', '==', userIdRef.current.value).get()
            const invitedId = invitedAppId.docs[0].id
            const invitedUser = await db.collection('users').doc(invitedId).get()

            if (invitedId === currentUser.uid) {
                setError('Tidak bisa mengundang diri sendiri')
                setLoading(false)
                return
            }

            let friendsInvited;
            if (invitedUser.data()?.friendsPending) {
                if (invitedUser.data()?.friendsPending?.includes(currentUser.uid)) {
                    setError('Sudah melakukan invitasi untuk user ini. Sedang menunggu untuk menerima permintaan pertemanan')
                    setLoading(false)
                    return;
                }
                friendsInvited = [...invitedUser.data()?.friendsPending, currentUser.uid]
            } else {
                friendsInvited = [currentUser.uid]
            }

            await db.collection('users').doc(invitedId).set({ friendsInvited }, { merge: true })

            const thisUser = await db.collection('users').doc(currentUser.uid).get()

            let friendsPending;
            if (thisUser.data()?.friendsPending) {
                if (thisUser.data()?.friendsPending?.includes(invitedId)) {
                    setError('Sudah melakukan invitasi untuk user ini. Sedang menunggu untuk menerima permintaan pertemanan')
                    setLoading(false)
                    return;
                }
                friendsPending = [...thisUser.data()?.friendsPending, invitedId]
            } else {
                friendsPending = [invitedId]
            }

            await db.collection('users').doc(currentUser.uid).set({ friendsPending }, { merge: true })
            refreshData()
            setLoading(false)
            setSuccess('Berhasil mengundang teman')
        } catch (e) {
            setLoading(false)
            setError('Gagal mengundang teman')
            console.log(e);
        }
    }

    return (
        <OptionLayout title="Tambah Teman">
            <div className="flex justify-center items-center h-screen">
                <div className="card w-96 bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Tambah Teman</h2>
                        {error && <p className="text-error text-sm">{error}</p>}
                        {success && <p className="text-success text-sm">{success}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-control w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">User id</span>
                                </label>
                                <input ref={userIdRef} type="text" placeholder="#T0PPQ" className="input input-bordered w-full max-w-xs" autoComplete="false" />
                            </div>

                            <div className="justify-end card-actions mt-5">
                                <button className="btn btn-primary" disabled={loading}>
                                    {loading ? <Loading /> : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </OptionLayout>
    )
}
