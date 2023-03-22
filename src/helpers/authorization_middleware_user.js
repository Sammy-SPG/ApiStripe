module.exports = (req, res, next) => {
    console.log("autorization middleware user");
    const token = req.headers['authorization'];
    if(!token && !req.params.id) res.status(401).send({ message: "Sorry, you don't have permission" });
    else {
        const tokenBody = token.split(" ");
        const bererToken = tokenBody[1];
        req.token = bererToken;
        next();
    }
}