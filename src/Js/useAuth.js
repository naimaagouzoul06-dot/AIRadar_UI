export function getUser() {
    const user = localStorage.getItem('user') 
              || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('user');
}

export function isLoggedIn() {
    return getUser() !== null;
}