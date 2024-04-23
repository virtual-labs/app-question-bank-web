## API Documentation

### Authentication
Before making any API calls, ensure to include the following headers:
- **Authorization:** Bearer `AccessToken`

### Endpoints

#### GET All Questions
- **Endpoint:** /api/questions
- **Method:** HTTP GET
- **Description:** Retrieve questions from the server based on different parameters.
- **Response Format:** JSON

#### GET Questions by tags
- **Endpoint:** /api/questions?tags=`Enter Tag list here separated by comma` 
- **Method:** HTTP GET
- **Description:** Retrieve only those questions from the server satisfying all specified tags.
- **Parameters:**
  - Example: `/api/questions?tags=physics,biology`
- **Response Format:** JSON

#### GET Questions by Contributor's Email
- **Endpoint:** /api/questions?user=`Enter Contributor EMAIL here` 
- **Method:** HTTP GET
- **Description:** Retrieve only those questions from the database contributed by a particular user.
- **Parameters:**
  - Example: `/api/questions?user=abcd@gmail.com`
- **Response Format:** JSON
 

#### GET Questions by difficulty
- **Endpoint:** /api/questions?difficulty=`Enter difficulty here` 
- **Method:** HTTP GET
- **Description:** Retrieve only those questions from the database of specified difficulty.
- **Parameters:**
  - Example: `/api/questions?difficulty=easy`
- **Response Format:** JSON


#### GET Questions by Multiple Parameters at a time
- **Endpoint:** /api/questions?tags=`Enter Tag list here separated by comma` & user=`Enter Contributor Email` & difficulty=`Enter difficulty` 
- **Method:** HTTP GET
- **Description:** Retrieve only those questions from the server satisfying all parameters
- **Parameters:**
  - Example: `/api/questions?tags=mathematics & user=abcd@gmail.com`
- **Response Format:** JSON

#### GET Question by Question ID:-
- **Endpoint:** /api/questions/:id
- **Method:** HTTP GET
- **Description:** Retrieve only single question. The question ID is the ID of question in FIREBASE
- **Parameters:**
  - Example: `/api/questions/hMtdhXngIOT6ilUZb92q`
- **Response Format:** JSON
- **Response:**
    - Status code 201: returns "success" with the questions retrieved in JSON format under KEY "data" and under key "question"
    - Status code 500: Error retrieving questions due to internal error


- The above RESPONSE code apply to all GET methods above.

#### Create Questions
- **Endpoint:** /api/questions
- **Method:** HTTP POST
- **Description:** Post questions to the database.
- **Request Body Format:** Array of questions in JSON format.
Example:-
  ```json
  [
    {
      "question": "What is the capital of France?",
      "answers": {
        "a":"Paris",
        "b":"Trnindad",
        "c":"Melbourne",
        "d":"Canada",
      },
      "selectedTags": ["physics"],
      "difficulty": "medium",
      "user": "xyz@gmail.com",
      "correctAnswer":4,
      "explanations": {
            "a": "European",
            "b": "European",
            "c": "European",
            "d": "Eurepean"
        }
    },
    {
        "question":"The famous mathematician associated with finding the sum of the first 100 natural numbers is",
        "answers":{
            "a":"Pythagoras",
            "b":"Newton",
            "c":"Gauss",
            "d":"Euclid"
        },
        "selectedTags":["mathematics"],
        "difficulty":"hard",
        "user":"xyz@gmail.com",
        "correctAnswer":3,
        "explanations":{
            "a": "It was Gauss",
            "b": "It was Gauss",
            "c": "Gauss",
            "d": "Gauss"
        }
    }
  ]
  ```
- **Response:**
    - Status code 400: Invalid Question format
    - Status code 200: returns "success" with IDs of the questions created
    - Status code 500: Error creating questions due to internal error



#### DELETE a Question
- **Endpoint:** /api/questions/:id
- **Method:** HTTP DELETE
- **Description:** Delete a question from the database.
- **Parameters:**
  - Example: `/api/questions/hMtdhXngIOT6ilUZb92q`
- **Response Format:** JSON
- **Response:**
    - Status code 200: returns "success" with the question deleted 
    - Status code 500: Error deleting question because ID may be wrong
    - Status code 400: Error as ID not specified


#### UPDATE a Question
- **Endpoint:** /api/questions/:id
- **Method:** HTTP PATCH
- **Description:** Update a question from the database.
- **Parameters:**
  - Example: `/api/questions/hMtdhXngIOT6ilUZb92q`
- **Response Format:** JSON
- **Request Body Format:** Array of questions in JSON format.

Example:-
  ```json
  
    {
      
      "difficulty": "medium",
      "correctAnswer":4,  
    }
    
  ```
the above example updates the values of difficulty and correctAnswer for the question
- **Response:**
    - Status code 200: returns "success" with the question updated 
    - Status code 500: Error deleting question because ID may be wrong
    - Status code 400: Error as ID not specified

