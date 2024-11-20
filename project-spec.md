# Project Spec

[Class Project Directions](https://lecturer-russ.appspot.com/classes/cs337/fall24/projects/final_project/)

## Team

- Matthew Song
- Bao
- Claire
- Eli Schillinger

## Requirements

- Project needs to be big enough to required at least 20 hours of work per week

- Budget of 60 group hours

- Website needs:

  - [ ] User accounts

  - [ ] No passwords (unless we want to study that)

  - [ ] Interaction between users

  - [ ] Client-side js making API calls to Server-side js

  - [ ] Client-side code should us DOM to update page without reloading

  - [ ] Server-side must use nodejs, express, mongoDB, and mongoose

  - [ ] Database must have three different and meaningful document types

  - [ ] Web app must have a help/guide for the web app

## Design

### Overview

Our idea is a web server called Achat, which stands for AnonymousChat, that
allows for anonymous messaging and polling between group members. All users in
the chat will be completely anonymous allowing for more open communication and
expression of opinions without worrying about judgment. Both users and guests
can create and join an anonymous group chat wherein users can send messages and
create polls that other users can vote in.

#### What is it

Anonymous group chat / poll system

#### Features

- Anonymous profiles

- Anonymous polls

- Anonymous groups

- Past group chats accessible via user

- Quick temporary chats (Delete after usage)

#### Future implementations:

- User should have a random profile picture when a guest

- User should be able to change their profile picture

- User should be able to change their vote

- Handle 404, 500, etc. errors

### Frontend

#### Homepage Features

- Login/Signup button -> redirects to the Login/Signup page

- Create button -> Chat page

- Join button -> Chat page

#### Login/Signup Features

- Text Field to input username

- Login Button -> Profile page

- Signup Button -> Profile page

#### Join room page Features

- Text Field for room join code

- Button to start a chat room, or join if code is given.

#### Chat page Features

- Text Field for user to input messages into

- Button to publish message to the chat board

#### Profile page Features

- Displays player username

- Displays list of user’s chat history

#### Help page Features

- Description of how the website works

#### Settings/Config page

### Backend

#### Objects

##### User

- user_id: int

- user_name: string

- room_owner: boolean

- has_account: boolean

##### Chat

- chat_id: i64

- users: collection (array of User)

- messages: array of Message

- polls: array of polls

##### Message

- message_id: i64

- author_id: int (user_id)

- chat_id: i64

- content: string

- date_time: i64

##### Poll

- poll_id: i64

- poll_title: string

- options: array of Poll_Option

- users_voted: array of user_id

##### Poll_Option

- poll_option_id: i64

- option_name: string

- vote_count: i64

#### Modules

- UUID for easy unique user ids

- MongoDB for database

- Mongoose for patching into database

- dotenv: for database URL/API keys

- Express for web server routing

- React for front-end dynamic components

#### Routes

##### GETS

- "/"

- "/login/" GET

- “/login/:user_name/” GET

- "/join/" GET

- “/join/:chat_id/” GET

- "/create/" GET

- "/chat/:chat_id/" GET

- “/chat/:chat_id/:poll_id/” GET

- ”/help/” GET -”/profile/:user_name/” GET

##### POSTS

- ”/signup/:user_name/” POST

- “/chat/:chat_id/:user_id/:message_content/” POST

- “/chat/:chat_id/:poll_title/” POST

- “/chat/:chat_id/:poll_id/:poll_option/” POST

- “/chat/:chat_id/:poll_id/vote/:poll_option_id/” POST

### Timeline

#### Milestones

##### User should be able to see a homepage when visiting the website (6 hours)

- Create homepage (4 hrs)

- Creating color reference (2 hours)

##### User should be able to sign up (4.5 hours)

- Create a user object (30 min)

- Create login/signup page (2 hrs)

- Create a UUID for each user object (30 min)

- Add user_signup POST (30 min)

- Add user to database (1 hr)

##### User should be able to login (3 hours)

- Create searchForUser function (2 hrs)

- Create a LoadUser function (30 mins)

- Add user_login GET (30 min)

##### User should be able to view the same data from multiple computers (10.5 hours)

- Create the database (8 hrs)

- Create the server (2 hrs)

- Create .gitignore to protect secrets (30 min)

##### User should be able to create a chat (4 hours)

- Create chat page (3 hrs)

- Create chat object (30 min)

- Add route to create chat (30 min)

##### User should be able to join a chat (30 mins)

- Add join_chat path (30 mins)

##### User should be able to message in chat (12.5 h)

- Create message object (30 min)

- Add create_message POST (1 hr)

- Add message to chat page (6h)

- Add live-updating messages (2h)

- Add message scrolling (3h)

##### User should be able to make a poll (10 hours)

- Make a form to create poll (title, options) (3 hours)

- Create a poll object in the backend and link to the chat (5 hours)

- Add poll to the chat page (2 h)

##### User should be able to vote on a poll (2 hours)

- Add route for vote post (2 hrs)

##### User should be able to view their profile page (3h)

- Create profile page (2h)

- Add chat database to view chat history (1h)

##### User should be able to view the help page (2 hrs)

- Create help page (2 hrs)

##### Final testing on live website (2 hrs)

- Test every feature live intensively (2 hrs)

### Timeframe

#### Week 0

- Create the Github

- Setup project structure (with frontend and backend)

#### Week 1 (11/25 - 12/1) (25 hours)

- Figure out how each page should look like (1 hour)

- User should be able to sign up (4.5 hours)

- User should be able to login (3 hours)

- User should be able to see a homepage when visiting the website (6 hours)

- User should be able to view the same data from multiple computers (10.5 hours)

#### Week 2 (12/2 - 12/8) (19 hours)

- User should be able to create a chat (4 hours)

- User should be able to join a chat (30 minutes)

- User should be able to message in chat (12.5 hours)

- User should be able to view the help page (2 hours)

#### Week 3 (12/9 - 12/13) (16 hours)

- User should be able to make a poll (10 hours)

- User should be able to vote on a poll (2 hours)

- User should be able to view their profile (3 hours)

- Final testing on live website (2 hours)
