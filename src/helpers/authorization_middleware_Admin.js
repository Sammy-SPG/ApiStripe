module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ message: "Sorry, you don't have permission" });
    else {
        const tokenBody = token.split(" ");
        const bererToken = tokenBody[1];
        req.token = bererToken;
        next();
    }
}