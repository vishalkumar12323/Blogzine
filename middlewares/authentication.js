import { getToken } from "./token-services.js"

const authentication = async (req, res, next) => {
    req.user = null;
    const { token } = req.cookies;
    if (!token) return res.redirect("/login");
    try {
        const user = getToken(token);
        req.user = user;
        next();
    } catch (e) {
        console.log('authentication error', e);
        return res.redirect("/login");
    }
}

const checkUserAuth = (req, res, next) => {
    const { token } = req.cookies;
    const user = getToken(token);
    req.user = user;
    next();
}
export { authentication, checkUserAuth };