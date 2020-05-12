const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const session = require("express-session")
const restrict = require("./middleware/restrict")
const knexSessionStore = require("connect-session-knex")(session)

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
	store: new knexSessionStore(
		{
			knex: require("../database/config.js"),
			tableName: "sessions",
			sidfieldname: "sid",
			createTable: true,
			clearInterval: 3600 * 1000
		}
	)
}

// Global middleware
server.use(cors())
server.use(helmet())
server.use(express.json())
server.use(session(sessionConfig))

server.use("/auth", authRouter)
server.use("/users", restrict, usersRouter)

server.get("/", (req, res, next) => {
	res.json({
		message: "Welcome to our API",
	})
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