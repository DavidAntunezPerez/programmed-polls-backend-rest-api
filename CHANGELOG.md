# Version Changelog

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
