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

# Technologies and Purposes
- NVM/NPM/Node.js
- Docker Desktop
- Git/Github Desktop
- MongoDB Compass
- Microsoft VS Code

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

<hr>

# Laptop Setup + Application Installations
- If you're new to web development, please refer to the [MacOS Setup](#macos-setup) or the [Windows Setup](#windows-setup) steps.
- If your laptop is set up, start at the [Application Installation](#application-installation) section.

## MacOS Setup

### 1. Install Xcode Command Line Tools / Git

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

### 4. Go to the [Application Installation](#application-installation) section, and continue following the steps.

<hr>

## Windows Setup

### 1. Install Git
- Follow the steps to install [Git](https://git-scm.com/downloads)

### 2. NPM / Node.js
- Follow the steps to install version 22.x.x of [Node.js](https://nodejs.org/en/download/package-manager), which comes prepackaged with NPM, a dependency installer for Javascript

### 3. Go to the [Application Installation](#application-installation) section, and continue following the steps.

<hr>

## Application Installation
- This section defines applications you will need to run / develop the project.

### 1. Install Visual Studio Code
- Follow the steps to install [Visual Studio Code](https://code.visualstudio.com/download)
- Launch Visual Studio Code.
- Navigate to the 'Extensions' tab, and download the following:
  - Jest
  - Prettier
  - Live Share

### 2. Install Github Desktop
- Follow the steps to install [Github Desktop](https://desktop.github.com/download/)
- Launch Github Desktop, and go to 'Settings'.
- Click the 'Git' tab, and connect to your Github account to the application.

### 3. Install Docker Desktop
- Follow the steps to install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Launch Docker Desktop, no need to sign in or create an account.

### 4. Install MongoDB Compass
- Follow the steps to install [MongoDB Compass](https://www.mongodb.com/products/tools/compass)
- Launch MongoDB Compass.

### 5. You're done installing all the necessary software, congrats!
- To build and run the project locally, refer to the [Running the Project](#running-the-project) section.

<hr>

# Running the Project
- This section defines how to start up the project, and run it on your local machine.

### 1. Clone the repository to your computer
- Navigate to this page, and click the "Code" button. Click the "HTTPS" tab, and copy the repository URL.
- Open Github Desktop, and click the "Add" option, and then "Clone Repository". Select the "URL" option, and paste the URL from Github.

### 2. Open the Project in Visual Studio Code
- Open the project directory in Visual Studio Code by either clicking "Open in Visual Studio Code" on Github Desktop, or launching Visual Studio Code, clicking "Open Folder", and navigating to the directory in which you cloned the project.
- Add the ```.env``` file to the root directory. This will define our important secret keys we use for authentication, and initialization of the project.

### 3. Run the Initialization Commands
- Open the terminal in VS Code and ensure that your current directory is the root of the project.
- Run the following command to install the project dependencies:
```properties
npm i
```
- Run the following Docker Image Command in the terminal at root directory. This command will build the Docker Image defined in your root directory from the Dockerfile, and will pull from the mongo:lastest image from the internet. It will build the compose project using the instructions defined in the `docker-compose.yaml` file.
```
docker compose up -d
```
- Test your environment, verify your docker compose project is running and navigate to [localhost:9999](http://localhost:9999) to check your connection to the API. Also, navigate to [localhost:9999/db](http://localhost:9999/db) to check your connection to the local database instance.

- Run the command to initialize database data:
```
npm run reset
```

- Run the command to run the project testing suite:
```
npm run test
```

- To view the database, launch MongoDB Compass. Go to the `.env` file, and copy the connection string. Paste it into the Compass URI box, and click 'Connect'. You should be able to view all the seeded collections.

### 4. The Project is Running!
- Congrats, you have successfully run the project! Feel free to ask for a ticket assignment so you can get started on development!
- For any futher explanations / help, reach out to the heads of software & web.

<hr>

# Troubleshooting

### MongoDB Authentication Error / Timeout on Running NPM Command 
- If you cannot successfully connect to the database endpoint, install [mongosh](https://www.mongodb.com/docs/mongodb-shell/install/).
```properties
mongosh
```
- Then, in the Mongo Shell, run these commands:
```properties
use admin
```
```properties
db.createUser({user: "nusci", pwd:"mongodb", roles:[{role:"readWrite", db:"Admin"}]})
```

### MongoDB Connection Error / Timeout on Running NPM Command 
- Make sure the Docker Compose Project is running in Docker Desktop, and that you have no other projects running on the following ports:
  - 9999
  - 27017

<hr>
