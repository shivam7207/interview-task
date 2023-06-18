import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import cookieDetails from '../../lib/cookie'
import Link from 'next/link';

const RegisterForm = () => {
    const route = useRouter()
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [description, setDescription] = useState('');
    const [socialMediaHandleName, setSocialMediaHandleName] = useState('');
    const [socialMediaHandleUrl, setSocialMediaHandleUrl] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [documents, setDocuments] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('description', description);
        formData.append('social_media_handle_name', socialMediaHandleName);
        formData.append('social_media_handle_url', socialMediaHandleUrl);
        formData.append('phone_number', phoneNumber);
        if (profileImage) {
            formData.append('profile_image', profileImage);
        }
        documents.forEach(document => {
            formData.append('documents', document);
        });

        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                route.replace('/login')
            }
            const data = await response.json();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        async function check() {
            const isUserAlreadyRegistered = await cookieDetails()
            if (isUserAlreadyRegistered) {
                route.replace('/')
            }
        }
        check()
    }, [])

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input type="text" value={username} onChange={event => setUsername(event.target.value)} />
            </label>
            <br />
            <label>
                Name:
                <input type="text" value={name} onChange={event => setName(event.target.value)} />
            </label>
            <br />
            <label>
                Email:
                <input type="email" value={email} onChange={event => setEmail(event.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
            </label>
            <br />
            <label>
                Description:
                <textarea value={description} onChange={event => setDescription(event.target.value)} />
            </label>
            <br />
            <fieldset>
                <legend>Social Media Handle:</legend>
                <input type="text" placeholder="Handle Name" value={socialMediaHandleName} onChange={event => setSocialMediaHandleName(event.target.value)} />
                <input type="url" placeholder="Profile URL" value={socialMediaHandleUrl} onChange={event => setSocialMediaHandleUrl(event.target.value)} />
            </fieldset>
            <br />
            <label>
                Phone Number:
                <input type="tel" value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} />
            </label>
            <br />
            <label>
                Profile Image:
                {profileImage && (
                    <>
                        <br />
                        <img src={URL.createObjectURL(profileImage)} alt="Profile Preview" style={{ maxWidth: '100%' }} />
                    </>
                )}
                <input type="file" onChange={event => setProfileImage(event.target.files[0])} />
            </label>
            <br />
            <label>
                Documents:
                {documents.map((document, index) => (
                    document.type.startsWith('image/') && (
                        <>
                            <br key={`br-${index}`} />
                            <img key={`img-${index}`} src={URL.createObjectURL(document)} alt={`Document Preview ${index + 1}`} style={{ maxWidth: '100%' }} />
                        </>
                    )
                ))}
                <input type="file" multiple onChange={event => setDocuments([...documents, ...Array.from(event.target.files)])} />
            </label>
            <br />
            <button type="submit">Register</button>
        </form>
        <span>if you are already registered </span><span><Link href="/login" style={{color: 'blue'}}>click here to sign in</Link></span>
        </>
    );
};

export default RegisterForm;
