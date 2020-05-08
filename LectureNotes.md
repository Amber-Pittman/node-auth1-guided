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

        * Our version

        * The cost parameter

        * The salt (we'll discuss what this is later)

        * And the hash itself

10. When we get the data from the request (the user req.body), we generate a hash using bcrypt (hash bcrypt.hashSync(...)) and passing in the password the user gave us and then passed in a cost algorithm (8). 

    * Normally, the cost algorithm would be something we'd probably retrieve from our environments. 



    ```
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

    module.exports = router
    ```

