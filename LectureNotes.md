# Intro to Authentication
In this project, we have an auth-router. Inside this auth-router, we have a register and login as well as an empty logout endpoint.

In the users-router, it just gets a list of the users. 

In the middleware folder, there is a restrict file. It validates the user and password that are coming from headers. It uses bcrypt to hash and compare.

## Notes

1. 