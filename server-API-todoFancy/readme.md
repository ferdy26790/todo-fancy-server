List of user routes:

Route | HTTP | Description
----- | ---- | -----------
/api/signup | POST | Sign up with new user info
/api/signin | POST | Sign in while get an access token based on credentials
/api/signin/fb | POST | Sign in with facebook while get an access token based on credentials
/api/users | GET | Get all the users (admin only)
/api/users/:id | GET | get a single user (admin and Authenticated user)
/api/users | POST | Create a user (admin only)
/api/users/:id | DELETE | Delete a user (admin only)
/api/users/:id | PUT | Update a user with new info (admin only)

List of todo routes (need token) :

Route | HTTP | Description
----- | ---- | -----------
/api/todo | GET | get all todo user
/api/todo | POST | add todo to user
/api/todo/:id | GET | get a single todo
/api/todo/:id | PUT | edit todo user
/api/todo/:id | DELETE | delete todo
