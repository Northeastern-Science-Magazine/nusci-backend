# Northeastern Science Magazine Website

This website is a site built by students on the Northeastern Science Magazine Webteam. With this website, we intend to give new members valuable and meaningful experience in web development, at whatever skill level they have. 

<hr>

### Technologies

- NPM/Node.js
- Docker Desktop
- Github Desktop
- Microsoft VS Code

<hr>

### Running the Project

1. Clone the repository to your computer.

2. Open the project directory in Visual Studio Code.

3. Add the ```.env``` file to the root directory.

5. Run the following NPM command in the terminal at root directory.

```properties
npm i
```

5. Run the following Docker Image Commands in the terminal at root directory.

```properties
docker build -t nusci-image .
```

```properties
docker compose build
```

```properties
docker compose up -d
```

<hr>

### Contribution Guidelines

1. Ask for permission to be assigned a ticket.

2. Once assigned, create a new branch off ```main``` named with the issue number and the ticket name formatted as follows:

    - "IssueNumber-name-of-ticket"
    -  Example: ```14-post-request-to-database-for-articles```
    
3. Work on your branch, commit and push when necessary. Be descriptive and clear with your commit messages.

4. Once finished, create a pull request to merge into the ```main``` branch.

5. An admin will review your ticket, and either approve your changes, or request changes. If changes requested, checkout to your branch and make requested changes.

***Note***: Code will be scrutinized:
- You will be asked to explain your reasoning to be approved.
- You must have proper and clear formatting on all changes in the code.
- You must not have extraneous code / code not relevant to the ticket in the pull request.
- The code must be well-documented and commented.
- The code must conform to the design patterns and choices already existing in the code.
- The code must pass all tests, as well as have new tests defined for new or adjusted functionality.

It often requires multiple rounds of review in order for a pull request to be merged. 
