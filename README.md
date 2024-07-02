# Programmed Polls by An2 - Backend Rest API

Create, schedule, and manage polls with **_Programmed Polls by An2_**.
Enjoy features such as poll voting, results visualization, and much more, all within this project.

## Related repositories

This project contains a full set of applications and solutions:

- [Backend REST API](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api)
- Web Application (_coming soon..._)
- Mobile Application (_coming soon..._)

## Index:

1. [Getting started](#getting-started)
2. [Description and functionalities](#description-and-functionalities)
    - [Endpoints in detail](#endpoints-in-detail)
3. [Tech stack](#tech-stack)
4. [Contact and Support](#contact-and-support)

### Getting started

- To use the backend deployed version (Production and Preview):
  - [Production](https://programmed-polls-backend-rest-api.vercel.app/)
  - [Other deployments: (Preview, Branch deploys...)](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api/deployments)

> [!IMPORTANT]  
> You need to have a JWT token or ID Token from my _Firebase Web Application connected apps_ or any other way of using Firebase Auth system into programmed polls in order to use the backend endpoints. Detailed explanation [here](#endpoints-in-detail)

- If you want to run the project locally:
  First, install all the required packages in the _root of the repository_

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

- Poll management _(Working since v0.2.0)_:

  - Create Polls: Users can create new polls with multiple options for respondents to choose from.
  - Edit Polls: Modify existing polls, including changing options and updating descriptions.
  - Delete Polls: Remove polls that are no longer needed.

- Schedule Polls _(Working since v0.3.0)_: Set start and end dates for polls, allowing them to be automatically published and closed at specified times and schedule polls to run on a recurring basis (daily, weekly, monthly).

- Voting Mechanism _(Working since v0.4.0)_:
  - Cast Votes: Users can vote on active polls, with each vote being securely recorded.
  - Vote Validation: Ensure that each user can vote only once per poll. User must be authorized with Google Firebase Authentication in a Mobile or Web Application connected to Programmed Poll's firebase project.
- Results Visualization _(Working since v1.0.0)_:
  View poll results in real-time, displaying the number of votes each option has received.

> [!NOTE]
> You can view the version updates with new features, bugfixes and improvements in the [CHANGELOG.md](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api/blob/main/CHANGELOG.md) located in this repository.

#### Endpoints in detail

First of all, you need to know that most of these endpoints require ***authentication*** to work. To authenticate, you must [use any of the project-related frontend applications](#related-repositories), which are already connected to this backend OR you can [ask for your own authentification credentials](#contact-and-support) to the project support administrator. Once you have the credentials, you can use the Google Authentication JWT Token in your requests (as a Bearer Token) for all endpoints that require authentication.

1. ***CORE ENDPOINTS*** *(located in /api/core/*)*:
   - */polls*:
     
     *These endpoints require from authentication to work.* With polls endpoints you can *create, edit, get and delete* polls.

     - POST */polls*:
       
       To create a Poll, you must provide a TITLE, DESCRIPTION, FREQUENCY *(poll iteration frequency in DAYS)*, DURATION *(poll voting period duration in DAYS)*, STARTTIME *(this is an OPTIONAL value to set a different           start time from the creation time of the poll)*, OPTIONS *(array of strings with the different options that you want to include in the poll)* and USERID *(the administrator userID that will create the poll (will          be automated in the future))*.
       This is be a JSON body example with all the different data:
       ```json
       {
          "title": "Poll Title",
          "description": "Can you vote?",
          "options": ["Option 1", "Option 2", "Option 3"],
          "frequency": 7,
          "duration": 3,
          "userId": "ID123"
        }
       ```
       

      - GET */polls*:
        
        There are two different ways of getting a poll information: by ID (individually) or get all the polls related to an user as a list.

        If you want to just list all the polls related to an user, you can just call the GET */polls* endpoints. No body needs to be provided. This will list all the different Polls related to the authenticated user and         show them in the response in this format:
       Response example:
        ```json
        {
          [
            {
              "pollId": "pollID1",
              "duration": 3,
              "isEnabled": true,
              "options": [
                "1",
                "2",
                "3"
              ],
              "description": "What do we do?",
              "title": "Numeric decision",
              "frequency": 7,
              "startTime": "2024-06-25T11:37:55.560Z",
              "createdAt": "2024-06-25T11:37:55.560Z"
            },
            {
              "pollId": "pollID2",
              "duration": 3,
              "isEnabled": true,
              "options": [
                "Yes",
                "No"
              ],
              "description": "Can you vote?",
              "title": "Test",
              "frequency": 7,
              "startTime": "2024-07-02T06:26:29.380Z",
              "createdAt": "2024-07-02T06:26:29.380Z"
            }
          ]
        }
        ```

        If you want to get a single Poll information, you can do */polls/{pollId}*, where ID is the Poll ID that you want to get.
        > You can get the Poll ID by: *using GET /polls endpoint (named as pollID)* or *creating a Poll with POST /polls (will be shown in response as pollID)*.

        Finally, call the endpoint GET */polls/{pollId}* without any body provided and this will be the example result:
        Response example:
         ```json
           {
            "pollId": "pollId1",
            "title": "Test",
            "description": "Can you vote?",
            "options": [
              "Yes",
              "No",
            ],
            "frequency": 7,
            "duration": 3,
            "isEnabled": true,
            "startTime": "2024-06-03T10:38:09.630Z",
            "createdAt": "2024-06-03T10:38:09.012Z"
          }
         ```

   
       - PATCH */polls/{pollId}*:
         
         This endpoint will let the poll administrator edit a Poll by ID. You can provide different values to edit (Rest of the information will remain the same):

         TITLE, DESCRIPTION, OPTIONS *(as an array of strings)*, FREQUENCY *(poll iteration frequency in DAYS)*, DURATION *(poll voting period duration in DAYS)*, STARTTIME, ISENABLED *(if poll is not enabled, there               will be no more votation periods until its enabled again)*.
         JSON body example:
          ```json
            {
               "title": "New Poll Title",
              "startTime": "2024-06-12T09:23:20.390Z"
            }
           ```

        - DELETE */polls/{pollId}*:
    
          This endpoint will let the poll administrator delete a Poll by ID. 
          No body or extra information must be provided in the request.
          
  > [!CAUTION]
  > Removing a Poll is a permanent action and will stop votation periods and future results.


  - */vote*:

    *These endpoints require from authentication to work.* With vote endpoints you can *submit a vote* in votation periods (instances of a poll).

    - POST */vote/{pollId}*:
      With this endpoint, any user is able to vote into a votation period of a poll. Users can also add an optional votation note. Votation is based in the order of options of the Poll.
      For example, if a poll contains the options ["Monday", "Tuesday", "Sunday"], users will submit an array of booleans based on the options: [true, false, false] (this would be a votation for Monday option).
      Users can vote for one or more options (if you want users to vote for a single-option it must be done in frontend). Field "notes" is optional and will be a string with the additional notes of an user.
      Votations will be stored in each instance and this endpoints will only work for the ***last instance of that Poll***. If votation period is not opened yet or poll is not enabled, users wont be able to submit a vote.

      JSON Body example:
      ```json
        {
          "votes": [true, false, true],
          "notes": "I am not available in Tuesday due to medical reasons."
        }

      ```

  > [!IMPORTANT]  
  > Votation options array must contain exactly the same size as the value options of the poll and each value in the array must be a boolean.

   - */results*:
     
     *These endpoints require from authentication to work.* With vote endpoints you can *submit a vote* in votation periods (instances of a poll). With resulsts endpoints administrators and general users can visualize         votation stadistics based on the *last instance available* of a poll.

     - GET */results/{pollId}*:
       With this endpoint, users will be able to visualize stadistics of the *last votation period of a poll*. Body of the request must be empty and no extra information is needed but PollId.
       Every user will be able to view:
       
       **GENERAL INFORMATION**:
        - **`pollTitle`**: Display the title of the poll.
        - **`pollDescription`**: Display the description of the poll to provide more context.
        - **`startTime`**: Start date of the instance.
        - **`endTime`**: End date of the instance.
        - **`optionCount`**: Array with the vote count results for all options.
      
        **STADISTICAL INFORMATION**:
        - **`totalUsers`**: Total count of users who voted.
        - **`totalVotes`**: Total count of votes.
        - **`completionRate`**: Percentage of options voted on by participants.
        - **`votingPeriod`**: Duration of the voting period (endTime - startTime).

        Aditionally, administrators and poll owners will be able to visualize extra and detailed information:
       
        **ADMINISTRATOR DATA**:
       - **`additionalNotes`**: Array of strings containing all notes provided by users.
       - **`usersVotes`**: Display which emails voted for which options.
      
        This is an example of a JSON response
        ```json
        {
          "pollTitle": "Test",
          "pollDescription": "Can you vote?",
          "startTime": "2024-07-02T06:26:00.000Z",
          "endTime": "2024-07-05T06:26:00.000Z",
          "optionCount": [
            2,
            1
          ],
          "totalUsers": 2,
          "totalVotes": 3,
          "usersVotes": [
            {
              "optionName": "Yes",
              "userVotes": [
                "user1@user.com",
                "user2@user.com"
              ]
            },
            {
              "optionName": "No",
              "userVotes": [
                "user1@user.com"
                ]
            }
          ],
          "additionalNotes": [
                {
                  "user": "user1@user.com",
                  "note": "I had 2 errors before being able to vote."
                }
            ],
          "completionRate": [
            0.66,
            0.33
          ],
          "votingPeriod": "3 days, 0 hours, 0 minutes, 0 seconds"
        }

        ```
    

   - */instances*:

     *These endpoints DOES NOT require from authentication to work.* Instances endpoints are much different from the previous ones. These endpoints have no authentification and will not provide the user any information.

     - POST */instances*:
       This is generally an endpoint done for automatization of creation of instances. An instance is a entity of each poll that will contain all the user votes in certain period of time. They can also be called                 *votation periods*. A votation period will last as much as it is set in the Parent Poll (in the value duration). Iteration and creation of instances will depend on the frequency set on their parent Poll.
       When calling this endpoint, the backend will check if there are new instances to create in this period of time and will create all the needed instances to allow users to vote. It can be called manually by anyone          because it will not give any information but it has been made to be an automated process for the scheduled polls.

  > [!NOTE]  
  > Instances endpoint is being called each *fifteen minutes* with Github Actions pipelines. This proccess is automated and will allow the generation of votation periods in a scheduled way.
          
### Tech stack

This Backend Rest API has been made with:

- [NodeJS & ExpressJS](https://expressjs.com/)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Google Firebase (Firestore, Authentication...)](https://firebase.google.com/)
- [Insomnia](https://insomnia.rest/)
- [GitHub Actions](https://github.com/features/actions)

### Contact and Support

If you have any questions, issues, or suggestions regarding this project, please don't hesitate to reach out:

- You can always open a new [issue](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api/issues) or [discussion](https://github.com/DavidAntunezPerez/programmed-polls-backend-rest-api/discussions) in this repository.
- For contact or special support/questions... you can contact a repository administrator:
  - David Antúnez Pérez: [GitHub](https://github.com/davidantunezperez), [eMail](mailto:antunezdavid2003@gmail.com) or [Linkedin](https://www.linkedin.com/in/davidantunezperez).
 
Thank you for your interest and support!

