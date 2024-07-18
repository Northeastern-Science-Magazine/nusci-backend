# Northeastern Science Magazine Backend API + Database

This repository acts as the backend API and database setup for a local environment. The architecture is as follows:

```md
┏━━━━━━━━━━━━━━┓                      ┏━━━━━━━━━━━━━━┓                    ┏━━━━━━━━━━━━━━┓
┃              ┃ -------------------> ┃              ┃ -----------------> ┃              ┃
┃              ┃   [HTTP Requests]    ┃              ┃   [DB Requests]    ┃              ┃
┃   Frontend   ┃                      ┃   Backend    ┃                    ┃   Database   ┃
┃   Server     ┃                      ┃   Server     ┃                    ┃   Instance   ┃
┃              ┃   [HTTP Responses]   ┃              ┃   [DB Responses]   ┃              ┃
┃              ┃ <------------------- ┃              ┃ <----------------- ┃              ┃
┗━━━━━━━━━━━━━━┛                      ┗━━━━━━━━━━━━━━┛                    ┗━━━━━━━━━━━━━━┛

     React                               Express.js                           MongoDB
     Tailwind                            Mongoose/MongoDB                     Docker
     Next.js                             Docker
```

<hr>

### Technologies
- NVM/NPM/Node.js
- Docker Desktop
- Git/Github Desktop
- MongoDB Compass
- Microsoft VS Code

<hr>

# Running the Project

- If you already have some of the above technologies you may skip to the appropriate step. 

## MacOS Setup

### 1. Install Xcode / Git

- Run the following command to install Xcode Command Line Tools, which comes prepackaged with Git:
```
xcode-select --install
```
- To verify you have Xcode Command Line Tools installed, run the command:
```
xcode-select --version
```

### 2. Install Homebrew
- Run the following command to install Homebrew, a Linux/MacOS package manager:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
- To verify you have Homebrew installed, run the command:
```
brew -v
```

### 3. Install NVM / NPM / Node.js
- Run the following command to install NVM, a version manager for Node Package Manager:
```
brew install nvm
```
- To verify you have NVM installed, run the command:
```
nvm -v
```
- Run the following command to install version 22 of NPM, a dependency installer for Javascript:
```
nvm install 22
```
- To verify you have NPM installed, run the command:
```
npm -v
```

4. Go to the [Cross-Platform Setup](#cross-platform-setup) section, and continue following the steps.

## Windows Setup

### 1. Install Git
- Follow the steps to install [Git](https://git-scm.com/downloads)

### 2. NPM / Node.js
- Follow the steps to install version 22.x.x of [Node.js](https://nodejs.org/en/download/package-manager), which comes prepackaged with NPM, a dependency installer for Javascript

## Cross Platform Setup

1. Clone the repository to your computer.

2. Open the project directory in Visual Studio Code.

3. Add the ```.env``` file to the root directory. This will define our important secret keys we use for authentication, and initialization of the project.

5. Run the following NPM command in the terminal at root directory. This command installs all the dependencies we use in our project. It utilizes the package-lock.json file to find which packages to install. 

```properties
npm i
```

5. Run the following Docker Image Command in the terminal at root directory. This command will build the Docker Image defined in your root directory from the Dockerfile, and will pull from the mongo:lastest image from the internet and creates the compose project with the backend API server and the database instance, locally on your machine. It runs detached so you get your terminal back after running the command.

```properties
docker compose up -d
```

6. Test your environment, verify your docker compose project is running and navigate to [localhost:9999](http://localhost:9999) to check your connection to the API. Also, navigate to [localhost:9999/db](http://localhost:9999/db) to check your connection to the local database instance.

7. If you cannot successfully connect to the database endpoint, install [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/). After installing, run the following command in the root directory:

```properties
mongosh
```

Then, in the Mongo Shell, run these commands:

```properties
use admin
```
```properties
db.createUser({user: "nusci", pwd:"mongodb", roles:[{role:"readWrite", db:"Admin"}]})
```

<hr>

### Contribution Guidelines

1. Ask for permission to be assigned a ticket.

2. Once assigned, create a new branch off ```main``` named with the issue number and the ticket name formatted as follows:

    - "IssueNumber-name-of-ticket"
    -  Example: ```14-post-request-to-database-for-articles```
    
3. Work on your branch, commit and push when necessary. Be descriptive and clear with your commit messages.

4. Once finished, create a pull request to merge into the ```main``` branch. The pull request should properly describe the changes made.

5. An admin will review your ticket, and either approve your changes, or request changes. If changes requested, checkout to your branch and make requested changes.

***Note***: Code will be scrutinized:
- You will be asked to explain your reasoning to be approved.
- You must have proper and clear formatting on all changes in the code.
- You must not have extraneous code / code not relevant to the ticket in the pull request.
- The code must be well-documented and commented.
- The code must conform to the design patterns and choices already existing in the code.
- The code must pass all tests, as well as have new tests defined for new or adjusted functionality.

It often requires multiple rounds of review in order for a pull request to be merged. 
