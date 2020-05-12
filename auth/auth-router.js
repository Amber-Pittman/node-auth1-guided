const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")

const router = express.Router()

router.post("/register", (req, res, next) => {
    const user = req.body
    const hash = bcrypt.hashSync(user.password, 8)

    user.password = hash

    Users.add(user)
        .then(saved => {
            res.status(200).json({saved})
        })
        .catch(err => {
            res.status(500)json({
                message: "Problem with the DB", error: err
            })
        })
})

router.post("/login", (req, res) => {
    const {username, password} = req.body

    Users.findBy({username})        //lookup in the database
        // Make comparison between PW guess and actual PW
        .then(([user]) => {
            if (user && bcrypt.compareSync(password, user.password)) {
                req.session.user = username
                res.status(200).json({
                    message: "Welcome!"
                })
            } else {
                res.status(401).json({
                    message: "Invalid credentials"
                })
            }
        }) 
        .catch(err => {
            res.status(500).json({
                message: "problem with the db", error: err
            })
        })
})

// Logout using GET
router.get("/logout" (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.send("Unable to logout.")
        } else {
            res.send("Logged out.")
        }
    })
})

module.exports = router






//////////////////// JASON'S VERSION ///////////////////////////
// const express = require("express")
// const bcrypt = require("bcryptjs")
// const Users = require("../users/users-model")

// const router = express.Router()

// router.post("/register", async (req, res, next) => {
// 	try {
// 		const { username } = req.body
// 		const user = await Users.findBy({ username }).first()

// 		if (user) {
// 			return res.status(409).json({
// 				message: "Username is already taken",
// 			})
// 		}

// 		res.status(201).json(await Users.add(req.body))
// 	} catch(err) {
// 		next(err)
// 	}
// })

// router.post("/login", async (req, res, next) => {
// 	try {
// 		const { username, password } = req.body
// 		const user = await Users.findBy({ username }).first()

// 		// since bcrypt hashes generate different results due to the salting,
// 		// we rely on the magic internals to compare hashes rather than doing it
// 		// manually with "!=="
// 		const passwordValid = await bcrypt.compare(password, user.password)

// 		if (!user || !passwordValid) {
// 			return res.status(401).json({
// 				message: "Invalid Credentials",
// 			})
// 		}

// 		res.json({
// 			message: `Welcome ${user.username}!`,
// 		})
// 	} catch(err) {
// 		next(err)
// 	}
// })

// // router.get("/logout", restrict(), (req, res, next) => {
// // 	// destroy the session here
// // 	res.end()
// // })

// module.exports = router
