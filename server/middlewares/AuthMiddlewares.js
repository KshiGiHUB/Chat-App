import jwt from "jsonwebtoken"

export const verifyToken = (request, response, next) => {
    // console.log('first', request.cookies)
    const token = request.cookies.jwt;
    // console.log('second', { token })

    if (!token) return response.status(401).send("You are not Authorized")
    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) return response.status(403).send("Token is not valid")
        request.userId = payload.userId;
        next();
    })
}