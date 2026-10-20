import jsonwebtoken from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    try {
        const token = req.cookies();
        console.log({token});

        const decode = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
        return;
    } catch (error) {
        res.redirect("/login")
        return;
    }
}