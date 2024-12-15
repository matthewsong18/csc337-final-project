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

  - [x] User accounts

  - [x] No passwords (unless we want to study that)

  - [x] Interaction between users

  - [x] Client-side js making API calls to Server-side js

  - [x] Client-side code should us DOM to update page without reloading

  - [x] Server-side must use nodejs, express, mongoDB, and mongoose

  - [x] Database must have three different and meaningful document types

  - [x] Web app must have a help/guide for the web app

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

- user_name: string

- has_account: boolean

- chats: Array of ObjectIds

##### Chat

- name: string

- pin: Number

- users: Array of User ObjectIds

- messages: Array of Message ObjectIds

- polls: Array of poll ObjectIds

##### Message

- author: User ObjectId

- content: string

##### Poll

- title: string

- options: array of Poll_Option

- users_voted: array of user_id

##### Poll_Option

- title: string

- vote_count: Number

#### Modules

- UUID for easy unique user ids

- MongoDB for database

- Mongoose for patching into database

- Express for web server routing

#### Routes

##### GETS

- "/"

- "/help"

- "/profile/:username"

- "auth/login/"

- “auth/login/:user_name/”

- "auth/chats/:user_name"

- "chat/:chat_id/events"

- "chat/:chat_id/:user_id"

- "chat/:chat_id/poll/:poll_id"

- "chat/:chat_pin/join/guest"

- "chat/:username/:chat_pin/join/user"

- "chat/:user_id/getuser/info"

##### POSTS

- "chat/create/guest"

- "chat/create/:username/:chat_name"

- "chat/message/:chat_pin/:user_id"

- "chat/:chat_id/:poll_title"

- "chat/:chat_id/poll/:poll_id/:poll_option"

- "chat/:chat_id/poll/:poll_id/vote/:poll_option_id"

# Reflection

One of the most notable issues was inaccurate time estimation. We severely
underestimated the effort and time required to complete various parts of the
project, which left us struggling to meet the deadline despite working
laboriously past our 60 hour budget. Thankfully, a one-day extension allowed us
to finish the core features of our website.

Another issue stemmed from suboptimal route design in our application. We hadn't
implemented cookies to manage user sessions effectively, which made it difficult
to retain user data during a session. There were errors and it made it hard to
retain user data.

Merge conflicts also became a recurring problem throughout the development
process. Team members often worked outside the scope of their assigned tasks,
resulting in overlapping changes to the codebase. This not only created
time-consuming conflicts to resolve but also led to confusion about which tasks
were actively being worked on, which were completed, and which still required
attention.

Testing presented its own challenges. While backend testing was straightforward
and largely effective, testing the functionality of the frontend was much more
difficult. We had no automated testing processes in place for the frontend and
relied heavily on manually testing different user interactions and intentionally
trying to "break" the application to find errors. This was time-intensive and
not as thorough as we would have liked.

We were able to complete some key aspects of the project. We successfully
developed the poll creation form and integrated it with the backend, allowing
users to create and post polls. We also implemented the chatbox feature, which
enabled users to interact in real time. However, due to time constraints and the
aforementioned challenges, we were unable to implement the voting functionality
in the polls before the project deadline.
