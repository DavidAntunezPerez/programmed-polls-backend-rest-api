# Version Changelog

## 0.2.1

### Bugfixes

- Fixed issue where you could POST or PATCH a poll with different data value (for example boolean in title)
- Fixes issue where you could create or patch a poll with a missing value (for example with no options)

### Improvements

- Data validation and strucured types, interfaces, schemas...

## 0.2.0

### Features

- Added POLLS endpoints: POST, GET, GETBYID, DELETEBYID, PATCHBYID
- Added authentication middleware to ensure only authenticated users can access the endpoints

## 0.1.0

### Features

- Initialized project
