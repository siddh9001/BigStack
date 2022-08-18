# BigStack
This is a NodeJS application . A miniscule version of stackOverflow.

To get the requests from frontend I have used **PostMan**.

For the database operations **MongoDB** is used.

## Registration of the user

<img width="960" alt="user_register" src="https://user-images.githubusercontent.com/86849427/185296545-ca1fff58-04f2-483f-a1de-c3e2e60beb49.png">



## Login of the user 
for the authentication of the user **jsonwebtokens** is used , therefore for every private route first authenciation of the user is done 
then the user is redirected to the respective webpage.

<img width="960" alt="user_login" src="https://user-images.githubusercontent.com/86849427/185296563-97cae2c8-f832-4a56-a386-7e8bb3600301.png">



## Viewing the user auth profile
User can view his profile using this route

<img width="960" alt="view_auth_profile" src="https://user-images.githubusercontent.com/86849427/185296697-f735a93f-6959-4509-b349-5b4d726d85d3.png">



## Updating and saving the profile the user
**POST** request to update/save the profile of the user.

<img width="960" alt="user_profile" src="https://user-images.githubusercontent.com/86849427/185296713-5c813589-9772-4a3a-9026-d556b842ea2f.png">


## Deleting the user Profile
**DELETE** request to delete the profile of the user

<img width="960" alt="delete_user" src="https://user-images.githubusercontent.com/86849427/185297242-c07ba68b-11e3-483f-ab9c-f9c46fd9e0c9.png">



## Getting all the questions
**GET** request to view all questions

<img width="960" alt="all_ques" src="https://user-images.githubusercontent.com/86849427/185296754-2c4e54f0-7b46-4d8f-8ecf-4f38aaef85af.png">



## Submitting the questions
**POST** route for submitting the questions

<img width="960" alt="submit_ques" src="https://user-images.githubusercontent.com/86849427/185296782-bd195911-f74f-4976-bbbd-601a4ec67708.png">



## Submitting the answers
**POST** request for submitting the answers

<img width="960" alt="ans_submit" src="https://user-images.githubusercontent.com/86849427/185296794-2c61b8ed-8fcb-419d-82c5-0a4f26f34c76.png">



## Deleting question
**DELETE** request to delete a question belong to particular user.

<img width="960" alt="delete_ques" src="https://user-images.githubusercontent.com/86849427/185296811-53697814-98dd-4e2a-a7af-f36785fac747.png">



## Upvotes of the user
**POST** request to store the upvotes of the user on questions.

<img width="960" alt="upvote_ques" src="https://user-images.githubusercontent.com/86849427/185296821-031595cf-1425-426c-9444-30c6f06f5955.png">
