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

    * We are _not_ encrypting the password here. 