const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")

const authRouter = require("./auth/auth-router")
const usersRouter = require("./users/users-router")

const server = express()
const port = process.env.PORT || 5000

// Session Config Object
const sessionConfig = {
	name: "chocolate-chip",
	secret: "myspeshulsecret",
	cookie: {
		maxAge: 3600 * 1000,
		secure: false,  // set to TRUE in production; false in development
		httpOnly: true,
	},
	resave: false,
	saveUninitialized: false,
}

// Global middleware
server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(session(sessionConfig))

server.use("/auth", authRouter)
server.use("/users", usersRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
	})
})

// Make the Restrict Middleware Global
server.use((req, res, next) => {
	if (req.session && req.session.user) {
		next()
	} else {
		res.status(401).json({
			message: "Not logged in."
		})
	}
})

server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "Something went wrong",
	})
})

server.listen(port, () => {
	console.log(`Running at http://localhost:${port}`)
})