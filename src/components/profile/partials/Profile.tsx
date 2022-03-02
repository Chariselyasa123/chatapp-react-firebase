import OptionLayout from './../../layout/OptionsLayout';
import { useAuth } from './../../../context/AuthContext';
import avatar from './../../../images/default-avatar.png';
import { useRef } from 'react';
import { useState } from 'react';
import { storage, db } from '../../../lib/firebase';
import Loading from '../../Loading';

export default function Profile() {
    const { currentUser } = useAuth();
    const imageInputRef = useRef() as React.RefObject<any>
    const usernameRef = useRef() as React.RefObject<any>
    const firstNameRef = useRef() as React.RefObject<any>
    const lastNameRef = useRef() as React.RefObject<any>
    const phoneNumberRef = useRef() as React.RefObject<any>
    const [picture, setPicture] = useState<any>();
    const [imgData, setImgData] = useState<any>();
    const [loading, setLoading] = useState(false)

    const onChangePicture = (e: any) => {
        if (e.target.files[0]) {
            console.log("picture: ", e.target.files);
            setPicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImgData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault()

        setLoading(true)
        const ref = storage.ref(`images/${Date.now()}`);
        const uploadTask = ref.put(picture);
        uploadTask.on("state_changed", console.log, console.error, async () => {
            const imgUrl = await ref.getDownloadURL();
            setImgData(imgUrl);
            console.log("imgUrl: ", imgUrl);

            await db.collection('users').doc(currentUser.uid).set({
                username: usernameRef.current.value,
                firstName: firstNameRef.current.value,
                lastName: lastNameRef.current.value,
                phoneNumber: phoneNumberRef.current.value,
                profilePictUrl: imgUrl
            }, { merge: true })
            setLoading(false)
        })
    }

    return (
        <OptionLayout title="profile">
            <form onSubmit={handleSubmit}>
                <div className='flex py-4 justify-center'>
                    <div>
                        <div className='mask mask-circle container-overlay'>
                            {imgData ? <img src={imgData} alt="avatar" width={160} /> : <img src={currentUser.profilePictUrl ?? avatar} alt="avatar" width={160} />}
                            <div className="overlay hover:cursor-pointer" onClick={() => imageInputRef.current.click()}>
                                <div className="text-overlay text-sm">Ganti Foto</div>
                            </div>
                        </div>
                        <input className='hidden' type="file" ref={imageInputRef} onChange={onChangePicture} />
                    </div>
                </div>

                <div className='flex py-4 justify-center'>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text mr-3">Username</span>
                        </label>
                        <input ref={usernameRef} type="text" placeholder="JohnDoe123" className="input input-bordered w-full max-w-xs" defaultValue={currentUser.username || ''} />
                    </div>
                </div>

                <div className='flex py-4 justify-center'>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text mr-3">First Name</span>
                        </label>
                        <input ref={firstNameRef} type="text" placeholder="John" className="input input-bordered w-full max-w-xs" defaultValue={currentUser.firstName || ''} />
                    </div>
                </div>

                <div className='flex py-4 justify-center'>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text mr-3">Last Name</span>
                        </label>
                        <input ref={lastNameRef} type="text" placeholder="Doe" className="input input-bordered w-full max-w-xs" defaultValue={currentUser.lastName || ''} />
                    </div>
                </div>

                <div className='flex py-4 justify-center'>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text mr-3">Phone Number</span>
                        </label>
                        <input ref={phoneNumberRef} type="text" placeholder="0812xxxxxxx" className="input input-bordered w-full max-w-xs" defaultValue={currentUser.phoneNumber || ''} />
                    </div>
                </div>

                <div className='flex py-4 justify-center'>
                    <button className='btn btn-primary' disabled={loading}>{loading ? <Loading /> : 'edit'}</button>
                </div>
            </form>
        </OptionLayout>
    )
}
