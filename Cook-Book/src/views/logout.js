import auth from "../api/auth.js";

export default function logoutPage(ctx) {
    auth.logout()
        .finally(ctx.logout);
}
