const { Router } = require("express");
const { User } = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BlacklistModel } = require("../model/blacklist");
const { TokenModel } = require("../model/token");
require("dotenv").config();
const userRouter = Router();

userRouter.post("/singup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email) {
            return res.json("enter all details")
        }
        if (!password) {
            return res.json("enter all details")
        }
        if (!name) {
            return res.json("enter all details")
        }

        const isUserPresent = await User.findOne({ email });

        if (isUserPresent) {
            return res.json("user already present ")
        }

        const hash = await bcrypt.hashSync(password, 8);

        const newUser = new User({ name, email, password: hash })
        await newUser.save();

        res.json("singup successful")

    } catch (error) {
        res.json(error.message)
    }
})

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email) {
            const isUserPresent = await User.findOne({ email });
            if (!isUserPresent) return res.json("User not find")
        }

        if (!password) {
            return res.json("fill all details")
        }
        const isUserPresent = await User.findOne({ email });
        if (!isUserPresent) return res.json("User not find");
        const isPasswordCorrect = await bcrypt.compareSync(password, isUserPresent.password);
        if (!isPasswordCorrect) return res.json("Invalid credentials");
        const token = await jwt.sign(
            { email, userId: isUserPresent._id, role: isUserPresent.role }, process.env.JWT_ACCESS_SECRET, { expiresIn: "1m" }
        );
        const refreshToken = await jwt.sign(
            { email, userId: isUserPresent._id, role: isUserPresent.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "5m" }
        );
        res.json({ msg: "login succes", token, refreshToken })
    } catch (error) {
        res.json(error.message)
    }
})


userRouter.get("/getnewtoken", async (req, res) => {

    const reftoken = req.headers.authorization.split(" ")[1];
    console.log(reftoken)
    if (!reftoken) return res.json({ msg: "please login" });

    jwt.verify(reftoken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.json({ msg: "please login" });
        else {
            const token = jwt.sign({ userId: decoded._id, role: decoded.role }, "token", { expiresIn: "1m" });
            res.json({ msg: "Login successful", token })
        }
    })
});

userRouter.get('/logout', async (req, res) => {
    try {
        // Add token to blacklist collection
        const token = req.headers.authorization?.split(' ')[1];
        const blacklistedToken = new BlacklistModel({ token });
        await blacklistedToken.save();

        res.status(200).json('Logged out successfully');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server error');
    }
});



module.exports = { userRouter }