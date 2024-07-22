# Virtual Labs Question Bank Service

## Introduction

The Virtual Labs Question Bank Service is a Hosted Web and Mobile Application Service that is helpful for Virtual Lab users as well as Teachers/Professors to retrieve questions based on Tag Search and also contribute to service by adding questions.
  

## Target Audience

The Virtual Labs Workflow tool is designed for members of Virtual Labs and the other users which Virtual Labs may deem authorized. The primary user group includes the people working on questions display of Virtual Labs.


## Features Overview

### 1. Question Upload (Visually)
- Description: Users can upload questions by entering them in the Add-Question Screen.

### 2. Preview Question while adding the question
- Description: Users can preview how the question will look.

### 3. Image Upload in Questions
- Description: Users can upload images to questions.

### 4. Markdown Input of Questions
- Description: Users can use Markdown while adding Question Text to facilitate mathematical equations and formulae.

### 5. Question View (Visually)
- Description: Users can view questions visually by visiting the Display-Question Screen.

### 6. Navigating Questions
- Description: Users can navigate between questions by clicking on buttons.

### 7. Question Extraction (API)
- Description: Users can extract questions individually and in bulk using an API that exports questions in a prescribed format.

### 8. Question Upload (API)
- Description: Questions can be uploaded individually or in bulk using an API that imports questions in a prescribed format.

### 9. General User Authorization
- Description: Authorization for general users to view all questions without credit restrictions.

### 10. Authorization while API access
    - Description:
      1. General Users are authorized through access tokens passed as HEADERS to API calls.
      2. Other applications can make API calls using these access tokens.

### 11. Tag Attachment
- Description: Questions can be tagged with keywords that describe their properties.

### 12. Search
- Description: Users can search for relevant entries by typing initials or related information.

### 13. Retrieve questions using multidimensional Tag Classification
- Description: Users and applications can retrieve questions based on tags, contributor’s email, difficulty, or a combination of these via API calls.

### 14. Multidimensional Tag Classification
- Description: Users can retrieve questions based on multiple levels of filtering using tags, difficulty, and contributor’s email.

### 15. Automatic Tag Suggestion
- Description: Users can type tag initials, and matching tags are automatically displayed.

### 16. Download Questions
- Description: Users can download selected questions singly or in bulk.

### 17. API Documentation Access
- Description: Users can access API documentation from the Web Application.

### 18. User Profile Management
    - Description:
      1. Allow users to change passwords.
      2. Provide the ability to copy Access tokens used in API calls.

### 19. Register
- Description: New users/contributors can register in the system.

### 20. Populate Database
- Description: Admin can add ONBOARD github repos content onto database

### 21. Role Separation 
- Description : Functionalities can be accessed based on ROLES of users

### 22. Quiz Interface
- Description : Users can take Quiz through the interface , and review their scores!

### 23. Update Question (Visually)
- Description : Administrators can update questions with changing prefilled fields as seen in the screen 

## DOCS

| DOCUMENT                                      | DESCRIPTION                                                                                                           |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [User Documentation](./app_code/user_doc.md)      | Comprehensive user documentation for Virtual Labs Question Bank Service
| [Technical Documentation](./app_code/tech_doc.md) | Detailed technical documentation providing insights into the architecture, technologies, and API details of the tool. |

## Running the Applications

### Frontend
Run commands

1. ```npm install``` to setup

2. ```npm run start``` to start the development server

### Backend

1. ```npm install``` to setup

2. ```node handleAPI.js``` to launch the express application.

## Deployment 

1. **Frontend**
   - Frontend REACT APP has been deployed in Firebase 

2. **Backend**
   - Backend Express JS app has been deployed on Google App Engine




