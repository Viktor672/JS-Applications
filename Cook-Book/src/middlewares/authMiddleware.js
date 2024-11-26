import page from "//unpkg.com/page/page.mjs";


export const auth = (ctx, next) => {
    const token = localStorage.getItem('accessToken');
    const email = localStorage.getItem('email');

    ctx.isAuthenticated = Boolean(token);
    ctx.email = email;

    ctx.setUserData = (userData) => {
        localStorage.setItem('accessToken', userData.accessToken);
        localStorage.setItem('email', userData.email);
        localStorage.setItem('_id', userData._id);
    };

    ctx.logout = () => {
        localStorage.clear();

        page.redirect('/');
    };

    next();
};
