import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import cookieDetails from '../../lib/cookie'

function UserProfile() {
  const [user, setUser] = useState(null);
  const router = useRouter()
  useEffect(() => {
    async function check() {
      const isUserAlreadyRegistered = await cookieDetails()
      if (isUserAlreadyRegistered) {
        let data = isUserAlreadyRegistered
        setUser(data)
      } else {
        router.replace('/register')
      }
    }
    check()
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>User Profile</h1>
      <label>Profile picture</label>
      <img src={`http://localhost:3001/${user.profile_image}`} alt="Profile Image" />
      <p>Username: {user.username}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Description: {user.description}</p>
      <p>Social Media Handle Name: {user.social_media_handle_name}</p>
      <p>Social Media Handle URL: {user.social_media_handle_url}</p>
      <p>Phone Number: {user.phone_number}</p>
      <h2>Documents</h2>
      {user.documents.map(document => (
        <img key={document} src={`http://localhost:3001/${document}`} alt="Document" />
      ))}
    </div>
  )

}

export default UserProfile;
