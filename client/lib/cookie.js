import Cookies from "js-cookie";

const fetchCookieDetails = async () => {
    const jwt = Cookies.get('jwt');
    console.log(jwt)
    if (jwt) {
        const response = await fetch(`http://localhost:3001/user/me`, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        });
        const data = await response.json();
        return data
    }
}

export default fetchCookieDetails