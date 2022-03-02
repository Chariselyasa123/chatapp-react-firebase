import Navbar from "./../Navbar"
import { useAuth } from '../../context/AuthContext';
import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../../images/default-avatar.png';
import { db } from "../../lib/firebase";

function Chat() {
    const { currentUser }: any = useAuth()
    const addChatBtnTooltipRef = useRef() as React.RefObject<any>
    const [chatList, setChatList] = useState<any>()
    const navigate = useNavigate()

    useEffect(() => {

        let isMounted = true;

        const chatList = currentUser.chats.map(async (chat: any) => {
            const dataChat = await db.collection('chats').doc(chat).get()
            const friend = dataChat?.data()?.members.find((member: any) => member !== currentUser.uid)
            const friendData = await db.collection('users').doc(friend).get()

            return { ...dataChat.data(), id: chat, ...friendData.data() }
        })

        Promise.all(chatList).then(results => {
            results.sort((a, b) => (a.lastMessageTimestamp > b.lastMessageTimestamp) ? 1 : ((b.lastMessageTimestamp > a.lastMessageTimestamp) ? -1 : 0))
            if (isMounted) setChatList(results)
        })

        return () => {
            isMounted = false;
        };

    }, [db])


    function ucfirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const handlChatClick = (id: string) => {
        navigate(`/chat/${id}`)
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-wrap flex-row">
                <div className="divider w-full my-0 h-0"></div>
                {chatList && chatList.map((chat: any) => {
                    const today = new Date()
                    const yesterday = new Date()
                    yesterday.setDate(today.getDate() - 1)

                    const msgListTime = new Date(chat.lastMessageTimestamp)

                    let time;

                    if (msgListTime.getDate() === yesterday.getDate()) time = 'Kemmrin'
                    if (msgListTime.getDate() < yesterday.getDate()) time = `${('0' + msgListTime.getDate()).slice(-2)}/${('0' + (msgListTime.getMonth() + 1)).slice(-2)}/${msgListTime.getFullYear().toString().slice(-2)}`
                    if (msgListTime.getDate() > yesterday.getDate()) time = `${('0' + msgListTime.getHours()).slice(-2)}:${('0' + msgListTime.getMinutes()).slice(-2)}`

                    return (
                        <div key={chat.id} className="w-full">
                            <button className="btn btn-ghost h-auto w-full overflow-overlay justify-between py-2 rounded-none"
                                onClick={() => handlChatClick(chat.id)}
                            >
                                <div className='flex items-center'>
                                    <div className="avatar online">
                                        <div className="w-20 rounded-full">
                                            <img src={chat.profilePictUrl || avatar} alt="avatar" width={100} />
                                        </div>
                                    </div>
                                    <div className='ml-5 text-left'>
                                        <h3 className='text-2xl normal-case'>{ucfirst(chat.username)}</h3>
                                        <p className='normal-case font-thin'>{chat.lastMessage}</p>
                                    </div>
                                </div>
                                <div className='flex items-center'>
                                    <h3 className='font-thin mr-2'>{time}</h3>
                                </div>
                            </button>
                            <div className="divider w-full my-0 h-0"></div>
                        </div>
                    )
                })}
            </div>
            {/* <div className="text-center">
                <h1 className="text-3xl">Your email is</h1>
                <strong>{currentUser.email}</strong>
            </div> */}

            {/* Tombol tambah chat */}
            <div className='fixed bottom-9 right-9'>
                <div className="tooltip tooltip-left" data-tip="Tambah Teman 👏" ref={addChatBtnTooltipRef}>
                    <Link to="/chats/cari-teman" className="btn btn-lg btn-circle relative" onMouseEnter={() => addChatBtnTooltipRef.current.class = "tooltip-open"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute top-0.5 right-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Chat