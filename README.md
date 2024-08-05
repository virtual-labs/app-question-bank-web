# Virtual Labs Question Bank Service

## Introduction

The Virtual Labs Question Bank Service is a Hosted Web and Mobile Application Service that is helpful for Virtual Lab users as well as Teachers/Professors to retrieve questions based on Tag Search and also contribute to service by adding questions.
  

## Target Audience

The Virtual Labs Question Bank Service is target for students and professors of Tier-2 and Tier-3 colleges for good and free educational content. It also helps users of Virtual Labs.

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
- Description: Admin can ONBOARD github repos content onto database

### 21. Role Separation 
- Description : Functionalities can be accessed based on ROLES of users

### 22. Quiz Interface
- Description : Users can take Quiz through the interface , and review their scores!

### 23. Update Question (Visually)
- Description : Administrators can update questions with changing prefilled fields as seen in the screen 

## DOCS

| DOCUMENT                                      | DESCRIPTION                                                                                                           |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [User Documentation](./docs/user_doc.md)      | Comprehensive user documentation for Virtual Labs Question Bank Service
| [Technical Documentation](./docs/tech_doc.md) | Detailed technical documentation providing insights into the architecture, technologies, and API details of the tool. |

## Running the Applications

### Frontend
Run commands

1. ```npm install``` to setup

2. ```npm run start``` to start the development server

### Backend

1. ```npm install``` to setup

2. ```node handleAPI.js``` to launch the express application.

## Deployment 

# Frontend
   ### Prerequisites

1. **Node.js and npm**: Ensure that Node.js and npm are installed on your machine. You can download and install them from [Node.js official website](https://nodejs.org/).
2. **Firebase CLI**: Install Firebase CLI globally using npm.

    ```sh
    npm install -g firebase-tools
    ```

### Steps

1. **Git Clone**: Make a local folder and git clone from "main" branch in it . 
    ```sh
    git clone "https://github.com/virtual-labs/app-question-bank-web.git"
    ```

2. **Login to Firebase**: Authenticate with your Firebase account. You can authenticate yourself in any directory.

    ```sh
    firebase login
    ```

3. **Initialize Firebase in your project**: Navigate to your React app directory and initialize Firebase.

    ```sh
    cd app-question-bank-web/frontend
    firebase init
    ```

    During initialization:
    - Select the Firebase features you want to set up (Hosting, Firestore, etc.).
    - Choose your Firebase project from the list. Here "vlabs-question-bank"
    - Set `build` as the public directory (default for React apps).
    - Configure as a single-page app by selecting `yes`.

4. **Build the React App**: Create a production build of your React app.

    ```sh
    npm run build
    ```

5. **Deploy to Firebase**: Deploy the built React app to Firebase Hosting.

    ```sh
    firebase deploy
    ```

    After deployment, Firebase CLI will provide a hosting URL where your app is accessible.


 # Backend
   ### Prerequisites

1. **Google Cloud SDK**: Download and install the Google Cloud SDK from [Google Cloud SDK installation guide](https://cloud.google.com/sdk/docs/install).

2. **Google Cloud Project**: Ensure you have a Google Cloud project set up. You can create one from the [Google Cloud Console](https://console.cloud.google.com/).

### Steps

1. **Initialize Google Cloud SDK**: Authenticate with your Google account and set up the project.

    ```sh
    gcloud auth login
    ```

    Set the project you want to use:

    ```sh
    gcloud config set project YOUR_PROJECT_ID
    ```

2. **Prepare your Express.js App for App Engine**: Ensure your `app.yaml` file is correctly configured in your Express.js app directory. An example `app.yaml` for a Node.js app is:

    ```yaml
    runtime: nodejs8

    handlers:
    - url: /.*
      script: auto
    ```

3. **Deploy Your App to Google App Engine**: Use the Google Cloud SDK to deploy your app.

    ```sh
    gcloud app deploy
    ```

    After deployment, the CLI will provide a URL where your app is accessible.

### Additional Configuration

- **Environment Variables**: Use the `app.yaml` file to set environment variables for your Express.js app.
- **Scaling and Performance**: Configure scaling and performance settings in your `app.yaml` file according to your app's needs.





