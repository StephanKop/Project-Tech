# Nate - Project Tech

## Description
Nate is a dating app that let's users stay anonymous to their matches as long as they would like. Nate's visual style is heavily based on the Netflix design. The Netflix design was chosen cause the target group is "nerdy" movie lovers. When the user matches with another user they can chat and send eachother a picture request. 

![Screens](https://github.com/superstephan1/Project-Tech/blob/master/projectFiles/screens.png "Screens")

## Feature - Avatar choice

When the user registers in Nate their information is stored in collection('reg1'). In the users document there are 3 fields containing character traits defined by the user, (trait1, trait2, trait3). when the user gets to the avatar page in the registration path, the 3 traits will get matched with the traits from the avatars in collection('avatars'). This will return matches based on the character traits the user provided and the user will be able to pick an avatar that fits their personality. The data can also be edited from the profile page to allow users to choose another avatar and edit their description etc.

## installation

### clone repo
`git clone https://github.com/superstephan1/Project-Tech.git`
### change directory
`cd Project-Tech`
### Install dependencies
`npm install`
### Excecute index.js
`npm run start` 

## Database structure

The database consists from 3 collections, Login, Avatars and Reg1. Data from Login will be matched with data from Reg1 and data from Reg1 will be matched with data from Avatars. 

### Database as a service
The database is hosted on mongodb atlas. Connection info is stored in .env file and are not available in the repo. Please request them if needed.

![Database structure](https://github.com/superstephan1/Project-Tech/blob/master/projectFiles/database.png "Database structure")