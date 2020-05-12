# Intro to Authentication
In this project, we have an auth-router. Inside this auth-router, we have a register and login as well as an empty logout endpoint.

In the users-router, it just gets a list of the users. 

In the middleware folder, there is a restrict file. It validates the user and password that are coming from headers. It uses bcrypt to hash and compare.

## Notes / Big Ideas

1. Data is protected by something that someone knows, something they have, or something they are. 
    
    * Passwords are the most common way (something they know)

    * Authentication using a key card like with the Google Authenticator app (something they have)

    * Biometrics such as finger prints, voice scans, or iris scans (something they are)

2. People are _always_ trying to get access through passwords. It is the most common way. 

    * If they are easy to guess, then they are vulnerable

    * If your password is stored in an insecure data store, or a single point of access store, they are vulnerable

3. In an effort to prevent password hacking, you should use password hashing. 

    * Store the hash, not the password

4. **_Hash_** - a value that is derived from an algorithm that a string is put through.  There are a number of different hashing algos available. Some are more secure than others. If you're interested, look into Cryptography.

    * When we're talking about a hash, we're talking about taking some string, running it through an algo and coming up with another string. 

    * Every time you use that same algo on the source string, you'll end up with the destination string so it can be repeated. 

    * Typically, you can run a hashing algorithm on strings of any length and it will still come up with a relatively unique hash.

        * Relatively unique - there are always possibilities for collisions. Meaning, two completely different texts can come up with the same hash but they are extremely rare. So rare, in fact, that they're considered not only statistically improbable but also statistically impossible.

    * If you have a hash, this is often used on the internet to validate that piece of information you downloaded has not been changed from the source.

        * When you download a binary file, you also get a hash of that binary that was generated using a particular method where you can regenerate the hash and compare it with the has that the author says you should get. If you get the same value then that means the file you downloaded has not been changed. 

    * We are _not_ encrypting the password here. When you encrypt the password, the encrypted version can be put back through the encryption algo to get back to the password. Encryption goes back and forth. A hash cannot.

    * Hashing algorithms go one way only. Once you put the text through it, you end up with a hash and you **_cannot_** ever get back to the original using that same algorithm or by using any other method.

    * Because you can't go back to the original, this is why we use hashes.

5. We are using **_bcryptjs_** to generate hashes (the JavaScript module for the bcrypt algorithms). BcryptJS is a JavaScript wrapper module around the Bcrypt methodology. We will use it to generate hashes.

6. Hash Workflow: whatever password guess is supplied in a login attempt is used to generate a hash, which is compared to the stored hash for the real password.

    * When a user registers, they tell us what password they're going to use

    * We create a hash for their password and store it

    * Every time the user tries to login, they're going to supply a password

    * We hash the password guess & compare that hash with the original hash

    * When the hashes match, we know the user gave us the correct password

7. Knowing the stored hash does not help. If you supply the hash, it's as good as the wrong password. 

8. **_Rainbow Tables_** are the hackers answer to hashing. 

    * Getting access to a database may not give them passwords, but if they happen to have a list of hashes that generated from possible passwords, they could take the hashes found in the database and compare them to the list they have. Every hash that's in their list is going to have with it, the password that was used to generate that hash. 

    * If they get access to the database and can see that there's a password hash in the database, they can just look it up on their own with a rainbow table. If they find it, the hash in the database they cracked is in the rainbow table. They'll know what password they used to generate that hash in the rainbow table. They know they can use that password to authenticate through the normal mechanisms. There would be no way the system would know they're not really the right person. 

    * This is where multi-factor authentication can help but in addition to that, there are other things we can do to help. This is why sufficiently complex passwords really help. In order to generate a list of possible hashes, they have to go through every possible password. 

    * The list of "every possible password" is governed by 2 things. There are 2 things that you can use to control the list of possible passwords. 

        * Increase the character set that's used. Make it big.

            * If all you use is lowercase characters, then there are only 26 characters that can be used. 
            
            * Use upper and lower, there are 52. 
            
            * Adding digits brings it up to 62. 

            * Using symbols to that, exponentially increases the possible set of passwords. It grows very quickly.  
                
                * It makes it so that it is complicatedly challenging for them to come up with every single hash. That being said, they only have to have the password for your hash once in order for it to be cracked; it doesn't matter how complex it is. It's not the only safeguard that users have but it is something that is important. 

        * Make your password length long. If you need help making sure you have a great password, check out [How Secure Is My Password](howsecureismypassword.net).

    * Additionally, methods like Bcrypt adds another safeguard: use an algorithm for generating hashes that is very complex and time consuming (i.e. _costly_), so that every generation take a long time.

    * Rainbow tables then have to contain an incredibly large data set that takes an incredibly long time to generate when we use Bcrypt. Bcrypt generates security for us.

9. When keeping authentication status when a user logs in, the fact that they're logged in is stored on the server. In order to maintain that, that's going to require a **_session_**. 

    * Sessions are typically configured so that they have a limited lifetime. When a user logs in - even when they never explicitly say to log out - their session will eventually end. In some cases you want those sessions to be short (a few seconds) and in other cases you want them to be long (weeks or months long). 

    * When a user successfully passes an authentication challenge (supplied the correct username and password), a session is established and then a token is given back to the app. 

        * The token is just an identifier that the app can supply on behalf of the users so the users don't have to keep logging in. When they do that, the app validates the token against some local storage that they're using for session identifiers. 

        * Tokens have limited lifetimes, so we'll learn how to set that up and make it possible. 

    * When server-side sessions are used to validate tokens, the token is passed back and forth in a cookie (for HTTP applications). Sessions and Cookies are often _related_ but they are not necessarily the same thing. 

        * **_Session_** is a server-side understanding of your login state. 

        * **_Cookie_** is a mechanism for passing in the token, identifying that session back and forth. 

        * The server gives the session ID and the cookie to the app so that the app can then resend it back to the server with the next request. The server will then use that to look the session up and validate that the user is indeed logged in and that their login is still valid. 


## Code Along!

1. `npm install`

2. Let's create a different router that will allow us to manage all of our authentication methods.

    * `mkdir auth` and then `touch auth-router.js`.

3. In order to put our login method in this file, we need to have bcryptJS enabled. Go into the `users-router.js` file and copy it into the `auth-router` file. 

    * We need Express and the users-model file. 

        * Make sure you update the path of users-router since it's in a different folder. 

4. Instead of GET, we will create a POST method that will allow us to register a user. Inside the method create a variable to get the body. In the body, we will pass in the username and the password (later).

5. In order for us to create the hash for the password - we're going to want to store that along with the user - we need to bring in bcrypt.

6. Bcrypt has 2 methods using hash.    

    * The `.hashSync` method is synchronous. The flow of execution of our code is going to stop right on hashSync until that hash is finished creating.
    
    * The `.hash` method is asynchronous algorithm and it returns a promise, where we would have to create a .then handle once it's finished hashing. 

7. Once we have the Users object, then we can create a hash. We can do that be using the bcrypt module method called hashSync. 

    * We're going to hash a password object that is passed in. 
    
    * Then we're going to pass in a number. That number is referred to the number of "rounds." Rounds instruct bcrypt that we want to not only hash the password, but also hash the hash of that password.
    
    * Then it tells it to hash the hash of that hash. And then again.

    * BUT! We're not doing it just 8 times. We're doing it 2^8 times (256 times).

        * This is how we control computational difficulty. The bigger we make that number, the longer it takes to generate that hash. We can fine-tune this for our own system as well as making it difficult for others to use the same algorithm. 
        
        * Although they might know we're using bcrypt, in order for them to generate the correct hash for the password we hashed, then they're going to have to run it through that algorithm as many times as we did in order for it to come up properly.

        * We can make it a large enough number that we can make it really troublesome for rainbow table creators.  At the same time we want to make it small enough that we don't overtax our systems and it's not too difficult an experience for our users. 

        
    ```
    const express = require("express")
    const bcrypt = require("bcryptjs")
    const Users = require("../users/users-model")

    const router = express.Router()

    router.post("/register", (req, res, next) => {
        const user = req.body
        const hash = bcrypt.hashSync(user.password, 8)

        Users.find()
            .then(users => {
                res.json(users)
            })
            //.catch(err => res.send(err))
            .catch(next)
    })

    module.exports = router
    `

8. If you look in the users-model, we have a method called `add(user)` that takes the username and a password. Back in the auth-router file, get rid of the Users.find method. We want to use the add method on Users instead. 

    * The problem with this if we left it like it is, without anything else, what we're adding to the database is the username and the password. 

    * Instead, we want to replace the password with our new hash before we save it to the database. That way, when it is saved to the DB, it is the hash that's saved and not the password.

9. Run the server. Create a POST request in Insomnia `POST localhost:5000/api/auth/register`. For the JSON body, use `{"username": "username", "password": "password"}`. 

    * When you run the request, you will see in the Preview a `saved` object with an ID, the username, and a hash in place of the actual password.

    * To get technical, it's actually a string with the hash placed somewhere inside that string.

    * It shows:

        * Our version (Blowfish based)

        * The cost parameter

        * The salt (we'll discuss what this is later)

        * And the hash itself

    * You can read about ["Versioning History"](https://en.wikipedia.org/wiki/Bcrypt#Versioning_history) to understand the hash strings better. We are using the "Blowfish-based" encryption.

    * Even though there's all that information in the hash string, it's still good to have it. It prevents hackers from doing a rainbow lookup as the hash string isn't going to match any passwords unless they used the exact same salt, with the exact same version, with the exact same cost. There are _a lot_ of parameters they have to go through.

    * **_Salt_** is a value that is added to the password before the hash is generated. You can provide your own salt value using Bcrypt or you can let Bcrypt generate a randomized salt that is different every single time you call the hash or the hashSync method. When it comes to Bcrypt, the salt is automatically built right in there.

    * You can use the [Bcrypt Generator](https://bcrypt-generator.com/).

        * Using this generator, you could use the same exact password and the same number or rounds and get a completely different hash at the end of the generated string. 

        * This happens because there's an entirely different salt that is used. 

10. Recap:

    * When we get the data from the request (the user req.body), we generate a hash using bcrypt (hash bcrypt.hashSync(...)). 
    
    * Passed in the password the user gave us and then passed in a cost algorithm (8). 

        * Normally, the cost algorithm would be something we'd probably retrieve from our environments rather than have anything hard-coded. 

    * We're replacing the password that was passed in the user object with a hash (user.password = hash) and that is what we're saving to the database.

    ```
    const express = require("express")
    const bcrypt = require("bcryptjs")
    const Users = require("../users/users-model")

    const router = express.Router()

    router.post("/register", (req, res) => {
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

    module.exports = router
    ```

11. We need to create a login endpoint using POST since we're passing information in. 

    * We're going to get the username and password from the body.

    * We're going to use the username to do a _lookup in the database_ to see if that username exists. Pass in an object that contains the username property (it will be converted into a WHERE clause). If it does exist, we get the hash. 

        * The .findBy method returns an array, as there could be more than one thing that matches our criteria. In our case, we only care about one. If there is more than one then that's a problem in our database; we'll need to add a constraint that says the username is unique and we'll need to look at cleaning that up.

        * We'll assume for now that the user is found, then it's going to come back as the only element in an array. 

        * Regarding `Users.findBy({username})`, as a feature of Knex, you can pass in an object with curly brackets. It sort of acts as a reversed destructuring. When Knex receives the long-form object, it makes it a where statement with whatever the value of username is. 

        ```
        // Long Form 

        const queryObject = {
            username: username
        }

        Users.findBy(queryObject) {...}

        // Short Form
        
        {username}

        // BONUS: Knex's Translation
        
        const queryObject = {
            username: username
        }

        where username = "//whatever the value of username is//"
 
        ```

    * We will destructure that array to get that object into a variable for us. 

        * To do that, we will destructure it using this syntax on the array delimiters in parentheses because it's what's being returned to us.  `.then(([user]))`

    * At this point we want to check to see if the user exists (defined). If it is defined, we are going to add to our test and call from bcrypt with compareSync. Right now, we're not generating a hash, we're comparing.

        * What we're going to pass into compareSync is the password guess that the user sends us with the body and then the password value that comes from our database.

        * Really, if we were to go back in and recreate our database, we might change that password to hash. What's being brought back in the `[user]` object when we do a query in the database is an object with a username and a password (but the password value is really a hash that we saved earlier). 

            * `([user])` is a destructured JavaScript array. When you do this syntax, you can put 1+ variables are comma delimited in here. Whatever is in the array will be assigned to the variables in the array in order. The first value will be assigned to the first variable and the second value will be assigned to the second variable. 

            * Reminder, this is just part of JavaScript. Nothing exclusive to bcryptjs. 

            * Without the parens around the square brackets, JavaScript becomes confused.

            ```
            // Example

            .then(([userVariable, anotherVariable]) => {...})
            ```

        * This `bcrypt.compareSync(...)` will compare the "guessed" password against the password we have in our database.

    * Then, we're going to use that password and that hash to confirm whether or not the password guess is the same as the original password. 

    * If that succeeds, we can return a success HTTP code to the login requestor.

    * Else, if the passwords don't match, we can assume the user doesn't exist or the password was wrong. We will return a 401 error status to the requestor. 

    * Now that the login endpoint was made for a new user, test it in Insomnia. `POST http://localhost:5000/api/auth/login` and create a JSON body with a username and password.
        
        * Type in your correct password, and you should get the welcome message.

        * Otherwise, you'll get your 401 message. 

        * Same is true for your username.

    ```
    // auth-router.js

    router.post("/login", (req, res) => {
        const {username, password} = req.body

        Users.findBy({username})        //lookup in the database
            // Make comparison between PW guess and actual PW
            .then(([user]) => {
                if (user && bcrypt.compareSync(password, user.password)) {
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

    module.exports = router
    ```

12. Sessions and Cookies

    * We want to be able to not force the user to have to authenticate every time they've made a request. 

    * Now, if we look at our method for retrieving users (look in the users-router), there's nothing in the get request that cares about whether or not the user is authenticated or logged in. We're _not_ currently secure. **_NOTHING_** is secure at this point. Our 1 method in the users-router is entirely unprotected, allowing anyone to retrieve our users list with their real passwords. 

    * We can protect this endpoint by using login state.

    * What we could do in the auth-router is when a user successfully logs in, we could make the request object (the `[user]`) that has a property called loggedIn and set it to true. 

        * But the problem with that is we're going to respond and then the next request that comes in will not have this property. And if that next request is routed to the users-router where we try to do a search for the loggedIn property before doing the all the things or return an error, that request is not going to have that logged in value. 

    * We need to come up with a different method. When we log in, we store that logged in information and have our application send it on behalf of the user without having the user log in every time. This is where Sessions come into play.

    * **_Session_** - something in the server's memory that keeps track of what users are in a logged in state. Sessions can be used to track other information about users. It can be very complex. 

        * When we store that information in a server, we have a server that is considered to be "stateful." Meaning, the server is keeping track of state for an individual user. 
        
        * That's not necessarily inappropriate architecture, but when it comes to **scalability** - if you intend for your app to scale very large - that could be a problem because a typical method for scaling web apps (in particular) is to make them horizontally scalable. 

        * Horizontal Scaling - to increase capacity, you just spin up new servers. The servers themselves don't necessarily have to be powerful because you can have many of them. Because they could be virtualized, they can be instantiated and spun up very quickly as well as be spun back down - AKA elasticity. You can grow and shrink your servers to meet demand at the moment.

        * One of the key things that makes that work is called a _load balancer_. When the request comes in, the load balancer determines which server to send the request to. 
            
            * If the loggedIn state of the user happens to be in Server #3 but the load balancer sends the next request to Server #38, Server #38 does not have that state in its memory. You'd have to get complicated in storing session information in a database that's essentially shared. That can be done as well, but then there's another whole level of scalability that you have to be concerned about when it comes to that. 

        * Creating Stateless Applications is an answer to that, where you can have truly scalable applications that don't have to worry about the complexities of state management on the backend.

            * Again, being stateful is not necessarily a bad thing. It's a very simple way to get up and running quickly. For many applications, it's totally acceptable and it's a good tradeoff for a lot of the complexity you would have otherwise. 

        * In our case, our application is stateful, so we need a way to store the loggedIn state of the user locally. Then we'll want to send a token back to the application that the app can then use to indicate that the user is already logged in again. Then it will authenticate what the user has the right (or privileges) to do within the app. 

    * We're going to use a session management package/module called `express-session`. In order to use it, in our server.js file, we want to import/require it and then use it as part of our global middleware stack. 

        * Since session itself is a method that takes a configuration object, we need to create a config object

        * Just above the global middleware section, create the sessionConfig object.

        * In [Express-Session's documentation](https://www.npmjs.com/package/express-session#api), you can see there are different options that can be passed in. For example, there's a cookie option. We could specify different properties of the cookie that basically gives us control of what the browser does in both creating and providing access to the cookie. 

            * `secret` is what we use to secure/encrypt the cookie. It is a _required option_. Even though it can be seen, it can't really be understood. 

        * Give the cookie a name. 
        
        * Specify a secret. In this lecture, we're hard coding it in but you actually want to have the secret coming from elsewhere. You also want it to have a larger charset.

        * Inside the sessionConfig object, we have a cookie object. Here, we can specify values about the cookie itself. 
            
            * For example, how long a cookie should last before it's considered expired (maxAge). This will be in milliseconds so if we wanted it to last an hour, we'd need 3600 milliseconds. Multiply 3600 by 1000 milliseconds.

                * When we set a cookie expiration, it automatically sets the session expiration as well.

            * We can specify whether a cookie can only be used by secure connections (http) or all. 

            * From our server's perspective, we can control if we even accept HTTP requests. Right now we are accepting them, because we don't support HTTPS in our application, as that would require minting a certificate and configuring it and a bit more involved than what we want to do here. It's not difficult but it is involved.

                * The secure property should be set to true in production. However, it is fine as false during development. 

            * We should also have `httpOnly` as this tells the browser to not provide access to the cookie from a JavaScript application running in the browser's memory. It forces the browser to only provide access to the server that created this cookie over HTTP, rather than allowing a JS application to have access to it.  

                * It can't be accessed by other domains or by JavaScript running in the browser.

        * We also need to set the resave option. When it comes to storing information in databases, this is a good one to keep false.

        * For GDPR purposes, you need to provide the option of `saveUninitialized`. Basically, what it's telling the browser is whether or not it can save a cookie before a user has given their permission. European laws require all countries to get their users permission before saving cookies.

    * Now that we have the sessionConfig object, we are going to pass into the session object, which we get from express-session. Because the session object is global on the `.use` method, it's applying it to every single request - no matter what the HTTP method is nor what the path is. 

        * The HTTP request is going to go through this session middleware, which will add a session object to the request object that will contain information about the session.

        * When information comes in, either that session object is going to be populated with actual session information (assuming the user passed a cookie in with a valid ID) or it will be a brand new session object that does not have valid session information in it until we populate it.

        * The only thing that comes back is the session identifier on the browser. It's encrypted in the cookie contents and is only accessible by the server that created it.

    * Every request that comes in, the req object (session) is going to have a sub-object (sessionConfig) on it that we'll use to store information on. Then, when we end the request by doing a return (by calling .json, .send, or .end), that session information will be committed to our store - by default, that's just in memory. Then our session ID will be sent inside the cookie back to the browser.

    * Now that we've got our session middleware initialized and we're using it, we're able to have sessions created for our users whenever a request comes in.

        ```
        // index.js

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
        ```

13. Login Sessions - What we want to do at this point in our login method, we want to do something that will allow us to remember/keep track of this user's loggedIn state. There will already be a session object because we're already adding it to every single request that comes through (by using the sessionConfig object in our global middleware). 
    
    * We can a user property to the request session and assign the username to it. 

    * We can use whatever we want here on the session object, but we're choosing the username.

    * It will be saved to the store as we create it using JSON.

    * All we need is something to indicate that we were in this part of code inside the login endpoint and we got past the comparison test.

        * The user existed in the database so now we can use this `req.session.user` object here.

        * Whereas, if it fails, we don't do anything in the else statement.

        * By adding this to the session object when it saved to the database, the next time a request comes in, the ID of this session will be populated from the database (or memory, depending on where the store is). The express-session middleware will look the session data up and then populate the `req.session.user` object on the request object. This will include our custom data that we added.

        * That means that now, when every other request comes in, we have the option of checking for that.

    ```
    // auth-router.js

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
    ```

    * As an example of checking for the user session, go to the users-router file. 

        * Check to see if the session object exists and then check to see if the user has been populated

        * If they aren't, we can send a res status of 401 and a message to the user that they are not logged in

        * Test the users-router endpoint in Insomnia `GET http://localhost:5000/api/users/`

        * Before, you could see an ID and a username. But now, you'll see a "Not logged in" message. 

            * This is because when you send your request message out, the request did not have the cookie header that was needed.

            * We have the cookie header now. If you look in the preview section, under Cookies, you'll see the chocolate-chip cookie name with an encrypted value.

            * The middleware when we did the response took the session that it created for the request, saved it to memory, and then returned to the session ID. 
            
            * That is not enough to get the session ID to work. It's not enough because when we make a request, we're sending in the cookie value, the server on our side is looking up the session that matches this encrypted ID and is finding a session. BUT!!! That session does not have `.user` on it because from that client (an application - in our case, Insomnia), we have not gone through the `req.session.user = username` code in our login endpoint found in the auth-router.

            * In order for that to work, go back into Insomnia and login with a valid username and password. You'll see the expected welcome message. It has gone through the necessary part of the code, meaning our session object now has a user object with a username value in it. The server gave back to us a cookie value that contains this session.

            * While still in the login endpoint, review the Cookies tab in the Preview section. You will now see the chocolate-chip cookie with an encrypted value.

            * Try testing the users endpoint again. In the Headers, you will now see a required cookie in it. Then look inside your Preview section and you'll see the cookie again. If it matches up, you can run the request over and over and over again until the cookie expires. Then you'll have to login again.

    ```
    // users-router.js

    router.get("/", async (req, res, next) => {
        if (req.session && req.session.user) {
        Users.find()
            .then(users => {
                res.json(users)
            })
            .catch(error => res.send(error))
        } else {
            res.status(401).json({
                message: "Not logged in."
            })
        }
    })

    module.exports = router
    ```

    * So far, we've added this check but it hasn't been done in a DRY fashion. We can already see what's going to start to happen as our endpoints grow and we have other routers with endpoints that needs to be secured. Not everything needs this; you shouldn't have to be logged in to be logged in, right? Or registered, for that matter.

        * Let's apply the same logic to everything that needs to be secured by extracting this logic into some middleware and put in a new folder called middleware. We can call the file `restrict.js`.

        * Export a piece of middleware function that's compatible with Express (meaning, it receives a req, a response object, and a next method). We can then call this middleware function to allow processing to continue.

            * Check to see if the session object exists and that there is a user object exists on that session.

                * If so, we're going to go ahead and call next().

                * If not, then we can do what we're doing on the users endpoint with a 401 message.

                * That's really all that's needed here.

        * Now, get rid of the redundant logic in the users router and add the restricted middleware directly inside the router.get call. 
            
            * Don't forget to import it into the users-router file. 

            * Then add `restrict` just before the homies.

            * After that, everything is just processed in order.

            * Validate that it's still working. You'll probably get a message saying you're not logged in because you saved your file while the server is running so it restarted it completely over. When the server restarted, all of its memory was lost, including all the sessions that were in memory (_which is why we would be interested in storing sessions in a database_).

            * Running everything again produces a new cookie ID (as expected) and then you'll get your list of users again. 

        ```
        // restrict.js

        module.exports = (req, res, next) => {
            if (req.session && req.session.user) {
                next()
            } else {
                res.status(401).json({
                    message: "Not logged in."
                })
            }
        }


        // users-router

        router.get("/", restrict, (req, res, next) => {
            Users.find()
                .then(users => {
                    res.json(users)
                })
                .catch(error => res.send(error))
            }
        )

        module.exports = router
        ```

        * We could take this one step further and make it global.

            * In index.js, we could use `server.use()` and add it in there. Then make it global so that it applies to everything.

            * You'll notice our authentication methods are not impacted because we don't have it in there.

            ```
            // index.js
            
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
            ```

14. Logout Sessions
```
Video at 1:39:34
```