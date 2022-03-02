import {useNavigate, useParams} from "react-router-dom"
import {useEffect, useRef, useState} from 'react';
import {db, firebase} from "../../lib/firebase";
import {useAuth} from '../../context/AuthContext';
import avatar from '../../images/default-avatar.png';
import Loading from './../Loading';
import MsgBox from "./partials/MsgBox";


export default function UserChat() {
    let {id} = useParams()
    const {currentUser} = useAuth()
    const [messages, setMessages] = useState<any>()
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [friendData, setFriendData] = useState<any>()
    const inputMessageRef = useRef() as React.RefObject<any>
    const btnBackRef = useRef() as React.RefObject<any>
    const msgElement = useRef() as React.RefObject<any>
    const scrollBtmRef = useRef() as React.RefObject<any>
    const navigation = useNavigate()

    useEffect(() => {
        let isMounted = true;
        // get friends data
        const getFriendsData = async (friend: string) => {
            const friendData = await db.collection('users').doc(friend).get()
            return {...friendData.data(), uid: friendData.id}
        }

        // get chats data
        const getChats = async () => {
            const chats = await db.collection('chats').doc(id).get()
            const friend = chats?.data()?.members?.find((member: any) => member !== currentUser.uid)
            const friendData = await getFriendsData(friend)
            if (isMounted) setFriendData(friendData)
        }
        getChats()

        return () => {
            isMounted = false;
        };

    }, [])

    useEffect(() => {
        console.log('ok')

        // get messages
        const unsubscribe = db.collection('chatMessages').doc(id).onSnapshot(quertSnapshot => {
            const data = quertSnapshot;
            if (data.exists) {

                // @ts-ignore
                let chatData = Object.keys(data.data()).map((k) => {
                    // @ts-ignore
                    return {...data.data()[k], id: k}
                })

                chatData.sort((a, b) => (a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0))
                setMessages(chatData)
            } else {
                setMessages(data.data())
            }

        })
        if (messages) {
            msgElement.current.addEventListener('DOMNodeInserted', (event: any) => {
                const {currentTarget: target} = event;
                target.scroll({top: target.scrollHeight, behavior: 'smooth'});
            });

            // scroll to bottom when dom loaded
            msgElement.current.scroll({top: msgElement.current.scrollHeight, behavior: 'smooth'});
        }

        return unsubscribe

    }, [db])


    function ucfirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
    }

    const handleSendMessage = async () => {

        await db.collection('users').doc(friendData.uid).set({
            chats: firebase.firestore.FieldValue.arrayUnion(id)
        }, {merge: true})

        await db.collection('chats').doc(id).set({
            lastMessage: inputMessageRef.current.value,
            lastMessageTimestamp: Date.now(),
        }, {merge: true})

        await db.collection('chatMessages').doc(id).set({
            [currentUser.uid.slice(0, 5) + Date.now()]: {
                message: inputMessageRef.current.value,
                sender: currentUser.uid,
                timestamp: Date.now(),
                type: 'text'
            }
        }, {merge: true})

        inputMessageRef.current.value = ''
    }

    const handleInputEnter = async (e: any) => {
        if (e.key === 'Enter') {
            await handleSendMessage()
            inputMessageRef.current.value = ''
        }
    }

    const handleBtnScrollToBottom = () => {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: 'smooth',
        });
        msgElement.current.scroll({top: msgElement.current.scrollHeight, behavior: 'smooth'});
    }

    const onScroll = () => {
        if (msgElement.current) {
            const {scrollTop, scrollHeight, clientHeight} = msgElement.current;
            if (scrollTop + clientHeight >= scrollHeight * 0.85) {
                if (showScrollButton) {
                    setShowScrollButton(false);
                }
            } else {
                if (!showScrollButton) {
                    setShowScrollButton(true);
                }
            }
        }
    };

    return (
        <div className="relative">
            {!friendData ?
                <div className="flex w-screen h-screen justify-center items-center">
                    <Loading/>
                </div>
                :
                <>
                    <nav className="navbar bg-base-100 shadow-xl fixed top-0 left-0 right-0 z-10">
                        <div className="flex-1">
                            <div className='flex items-center'>
                                <button className="mr-3 hidden" ref={btnBackRef} onClick={() => navigation(-1)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                         fill="currentColor">
                                        <path fillRule="evenodd"
                                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                              clipRule="evenodd"/>
                                    </svg>
                                </button>
                                <div className="avatar online"
                                     onMouseEnter={() => btnBackRef.current.classList.remove('hidden')}
                                >
                                    <div className="w-20 rounded-full">
                                        <img src={friendData.profilePictUrl ?? avatar} alt="avatar" width={100}/>
                                    </div>
                                </div>
                                <div className='ml-5 text-left'>
                                    <h3 className='text-2xl normal-case'>{ucfirst(friendData.username)}</h3>
                                    <p className='normal-case font-thin'>status</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-none">
                            <button className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     className="inline-block w-5 h-5 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                                </svg>
                            </button>
                        </div>
                    </nav>
                    <div className="overflow-hidden">
                        <div className="h-screen w-screen flex flex-col mt-28 mb-14 overflow-x-auto" onScroll={onScroll}
                             ref={msgElement}>
                            {messages && messages.map((msg: any, idx: number) => {
                                const position = msg.sender === currentUser.uid ? 'right' : 'left'

                                return (
                                    <div key={msg.id}>
                                        <MsgBox
                                            position={position}
                                            date={msg.timestamp}
                                            message={msg.message}
                                        />
                                    </div>
                                )
                            })
                            }
                        </div>
                    </div>

                    <div ref={scrollBtmRef}></div>

                    {showScrollButton &&
                        <button className="btn btn-circle fixed bottom-14 right-9"
                                style={{transition: "ease-in-out 1s"}} onClick={handleBtnScrollToBottom}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20"
                                 fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                    }

                    <div className="form-control fixed bottom-0 left-0 right-0 z-10">
                        <div className="input-group">
                            <input onKeyDown={handleInputEnter} type="text" placeholder="Tulis Disini…"
                                   className="input input-bordered w-full focus:outline-0" ref={inputMessageRef}/>
                            <button className="btn btn-square" onClick={handleSendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}
