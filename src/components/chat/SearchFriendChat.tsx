
import OptionLayout from './../layout/OptionsLayout';
import { useAuth } from './../../context/AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';
import { db, firebase } from '../../lib/firebase';
import avatar from '../../images/default-avatar.png';
import { useNavigate, Link } from 'react-router-dom';

export default function SearchFriendChat() {

    const { currentUser } = useAuth()
    const [firends, setFriends] = useState<any[]>([])
    const [messageFriends, setMessageFriends] = useState('')
    const navigate = useNavigate()

    useEffect(() => {

        if (currentUser.friends && currentUser.friends.length > 0) {
            currentUser.friends.forEach(async (id: any) => {
                const user = await db.collection('users').doc(id).get()
                setFriends(state => [...state, { ...user.data(), uid: user.id }])
            })
        } else {
            setMessageFriends('Tidak ada teman 😔')
        }

        return () => {
            setFriends([])
        }
    }, [])

    function ucfirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const handleAddNewChat = async (uid: string) => {
        // create chat collection
        const chatId = currentUser.uid.slice(0, 4) + uid.slice(0, 4)
        await db.collection('chats').doc(chatId).set({
            lastMessageSent: '',
            members: [currentUser.uid, uid],
        })

        // insert chat id to user collection
        await db.collection('users').doc(currentUser.uid).update({
            chats: firebase.firestore.FieldValue.arrayUnion(chatId)
        })

        navigate(`/chat/${chatId}`)
    }


    return (
        <OptionLayout title="Cari Teman untuk Memulai Chat">
            <input type="text" placeholder="Cari Teman Kamu Di sini 👋" className="input input-ghost w-full max-w-x mb-3" />
            <div className='divider my-0 h-0'></div>
            {messageFriends && <p className='text-secondary-content text-sm text-center'>{messageFriends}</p>}
            {firends.map((friend: any, idx: number) => {
                return (
                    <div key={idx}>
                        <button className="btn btn-ghost w-full h-auto overflow-overlay justify-between py-2"
                            onClick={() => handleAddNewChat(friend.uid)}
                        >
                            <div className='flex items-center'>
                                <div className="avatar">
                                    <div className="w-24 rounded-full">
                                        <img src={friend.profilePictUrl ?? avatar} alt="avatar" width={100} />
                                    </div>
                                </div>
                                <div className='ml-5 text-left'>
                                    <h3 className='text-2xl normal-case'>{ucfirst(friend.username)}</h3>
                                    <p className='normal-case font-thin'>{friend.email}</p>
                                </div>
                            </div>
                            <div className='flex items-center'>
                                <h3 className='text-2xl mr-2'>ID</h3>
                                <kbd className='kbd kbd-lg hover:cursor-default'>{friend.appId}</kbd>
                            </div>
                        </button>
                        <div className='divider my-0 h-0'></div>
                    </div>
                )
            })}
        </OptionLayout>
    )
}
