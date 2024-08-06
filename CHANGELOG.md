# Version Changelog

## 1.0.5

### Improvements

- Updated README.md
- New value in GET Poll by ID called hasUserVoted that will check if the user has voted in that specific poll

## 1.0.4

### Fixes

- Any user will be able to get a single Poll by ID. This will not provide any sensitive information and will only be possible if Poll owner shared their Poll ID with them.

## 1.0.3

### Fixes

- Added CORS middleware to allow Web Applications access to the API

## 1.0.2

### Improvements

- Refactored instances creation as an util function
- If an user creates a poll with no startTime or with the same startTime as current time, poll's instances will be created automatically as soon as the poll is created

## 1.0.1

### Improvements

- Improved repository documentation and information

## 1.0.0

### Features

- GET Results by ID is now available and working with ADMIN and NOT ADMIN mode.

## 0.4.0

### Features

- Created POST vote endpoint , models and interfaces

## 0.3.2

### Improvements

- Updated project dependencies to avoid security issues

## 0.3.1

### Fixes

- Fixed issues where you could not generate new instances of recently created Polls.
- Fixed issues where if a Poll was not iterated, instances endpoint would not iterate and generated previous instances when being called for the first time.

## 0.3.0

### Features

- Created instance interface and POST instances endpoint

## 0.2.3

### Improvements

- Added startTime value in Polls to set the start time of the iterations for each poll in GET, POST and PATCH

## 0.2.2

### Bugfixes

- Validating that the frequency is greater than or equal to the duration to avoid instance issues in POST and PATCH

## 0.2.2

### Improvements

- Updated README.md with the essential information of this repository

## 0.2.1

### Bugfixes

- Fixed issue where you could POST or PATCH a poll with different data value (for example boolean in title)
- Fixes issue where you could create or patch a poll with a missing value (for example with no options)

### Improvements

- Data validation and strucured types, interfaces, schemas...
- Moved autenticate.ts to utils folder

## 0.2.0

### Features

- Added POLLS endpoints: POST, GET, GETBYID, DELETEBYID, PATCHBYID
- Added authentication middleware to ensure only authenticated users can access the endpoints

## 0.1.0

### Features

- Initialized project
