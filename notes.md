we can assume that if you pass a token to a protected route, 
you will have a req.userId in the endpoint

- we have auth routes 
    POST/auth/signup --> email and password
        responds with token
    POST/auth/signin --> email and password
        responds with token
- put the token in the header under Authorization
- add /api/ to your routes in order to trigger the auth middleware
- if all of this is done, you have access to req.userId in your endpoint definitions. Use it to make cooler SQL queries

after figuring out current issues...
Run your database scripts to fully drop, recreate, and seed your database.
Verify that your GET /todos endpoint works and shows the seed todos
Commit your changes
