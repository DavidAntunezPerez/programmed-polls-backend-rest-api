# Version Changelog

## 0.2.3

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
