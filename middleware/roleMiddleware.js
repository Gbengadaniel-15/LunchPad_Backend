
const roleMiddleware = (...roles) =>{
    return (req, res, next) => {

        //check if the user is logged in at all
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not loggedin",
                data: null
            })

        }

        if(!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Only ${roles.join(', ')} can do this`,
                data: null
            })
        }

        next()
    }
}

export default roleMiddleware