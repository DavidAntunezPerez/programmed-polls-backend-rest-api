# Programmed Polls by An2 - Backend Rest API

Create, schedule, and manage polls with ***Programmed Polls by An2***.
Enjoy features such as poll voting, results visualization, and much more, all within this project. 

## Related repositories

This project contains a full set of applications and solutions:
- [Backend REST API](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api)
- Web Application (*coming soon...*)
- Mobile Application (*coming soon...*)

## Index:
1. [Getting started](#getting-started)
2. [Description and functionalities](#description-and-functionalities)
3. [Tech stack](#tech-stack)

### Getting started

- To use the backend deployed version (Production and Preview):
  -   [Production](https://programmed-polls-backend-rest-api.vercel.app/)
  -   [Other deployments: (Preview, Branch deploys...)](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api/deployments)
 
> [!IMPORTANT]  
> You need to have a JWT token or ID Token from my *Firebase Web Application connected apps* or any other way of using Firebase Auth system into programmed polls in order to use the backend endpoints. Detailed explanation [here](#endpoints)

  
- If you want to run the project locally:
First, install all the required packages in the *root of the repository*

```bash
npm install
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app locally use:

```bash
vercel dev
```
### Description and functionalities

This backend REST API is designed to be robust, secure, and easy to integrate with other applications, making it an ideal choice for developers looking to add polling functionality to their projects. Whether you are building a web app, mobile app, or any other platform, Programmed Polls by An2 provides all the necessary tools and features to manage polls effectively. You can check the already made Frontend Applications working with this application at [here](#related-repositories)

Some of the most importants functionalities are:
- User Authentication and Authorization:
  Firebase Authentication: Securely authenticate users using Firebase Auth, ensuring that only authorized users can access and manage polls.
  JWT Tokens: Utilize JWT tokens for API access, enhancing security and session management.

- Poll management:
  - Create Polls: Users can create new polls with multiple options for respondents to choose from.
  - Edit Polls: Modify existing polls, including changing options and updating descriptions.
  - Delete Polls: Remove polls that are no longer needed.

- Schedule Polls: Set start and end dates for polls, allowing them to be automatically published and closed at specified times and schedule polls to run on a recurring basis (daily, weekly, monthly).

- Voting Mechanism:
  - Cast Votes: Users can vote on active polls, with each vote being securely recorded.
  - Vote Validation: Ensure that each user can vote only once per poll. User must be authorized with Google Firebase Authentication in a Mobile or Web Application connected to Programmed Poll's firebase project.
  
- Results Visualization:
  View poll results in real-time, displaying the number of votes each option has received.

### Tech stack

This Backend Rest API has been made with:
- [NodeJS & ExpressJS](https://expressjs.com/)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Google Firebase (Firestore, Authentication...)](https://firebase.google.com/)
- [Insomnia](https://insomnia.rest/)
