import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { useRouter } from "next/router";
import cookieDetails from '../../lib/cookie'

function Login() {
    const route = useRouter()
    const [usernameOrEmail, setUsernameOrEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:3001/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameOrEmail.includes('@') ? undefined : usernameOrEmail,
                email: usernameOrEmail.includes('@') ? usernameOrEmail : undefined,
                password
            })
        });
        if (response.ok) {
            route.replace('/')
        }
        const data = await response.json();
        console.log(data)
        if (data.jwt) {
            Cookies.set('jwt', data.jwt);
        }
    }

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
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    name='username or email'
                    title='username or email'
                    type='text'
                    value={usernameOrEmail}
                    onChange={event => setUsernameOrEmail(event.target.value)}
                />
                <input
                    title='password'
                    type='password'
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                />
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default Login
