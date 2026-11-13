import jwt from 'jsonwebtoken'


export async function AuthUser(req, res, next) {

    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: 'Token not provided'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRECT)

        req.user = decoded.id

        next()

    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
}