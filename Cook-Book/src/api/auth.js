const baseUrl = 'http://localhost:3030/users';

function login(email, password) {
    return fetch(`${baseUrl}/login`, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.code >= 400) {
                throw new Error('Something went wrong');
            }

            return data;
        })
}

function register(email, password) {
    return fetch(`${baseUrl}/register`, {
        method: 'POST',
        body: JSON.stringify({
            email,
            password,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.code >= 400) {
                throw new Error('Something went wrong');
            }

            return data;
        });
}

function logout() {
    const token = localStorage.getItem('accessToken');

    return fetch(`${baseUrl}/logout`, {
        headers: {
            'X-Authorization': token,
        }
    });
}

const auth = {
    login,
    register,
    logout,
}

export default auth;
