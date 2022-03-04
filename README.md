# Instagram Authentication
An app to authenticate users using their Instagram account and save information on SQlite using Prisma ORM

## NGrok Settings
* For your app to receive the token back from Facebook after the authentication you will need a valid URL. I recommend using NGrok https://ngrok.com/.
* Just download it and execute it like this on your terminal
  * On Mac, you would execute the following command to run ngrok on your port 4000: 
  ```
    ./ngrok http 4000
  ```
## Facebook and Instagram Settings
* Create a Facebook Developer Account
* Go to https://developers.facebook.com/apps and click to "Create App"
* Select "Consumer" as the type of the App.
* Fill out the form with name for the app and contact email.
* On the new page that was loaded, on the Instagram Login card, click on "Set Up"
* Click on "Create New App"
* Put any name for the Display Name field and click "Create App"
* On the left Site menu, go to Instagram Basic Display -> Basic Display
  * Copy the app ID and secret to your .env file corresponding keys
* In the "Privacy Policy URL" and "User Data Deletion" fields, add any site on web for this example
* Copy the HTTPS url generated by ngrok and replace the existing ngrok URL in your .env file under INSTAGRAM_CALLBACK_URL, but leave the /instagram/callback
* On the "Valid OAuth Redirect URIs" add your ngrok callback url
* Click on "Add Instagram Testers"
* Enter the username of the Instagram account you are going to use for this example. It must be an Instagram account you can log in to because you will be required to accept the request sent
* Login into the instagram account you just used and go to this URL to approve the tester: https://www.instagram.com/accounts/manage_access/
* Back to Facebook Instagram Basic Display
  * For this example add any random URL to the fields od data policy and deletion and in your just approved instagram tester, click on "Generate Token"
* Save all changes

## Installation
```
yarn
```

# Prisma Configuration
The file data/prisma/schema.prisma is the place where you should define your all your table schemas


# Create your tables using Prisma
Before running your app execute the following terminal command to generate your tables on SQLite. 
```
yarn prisma migrate dev
```

This should be done regardless of the DB you are using.

# Running the Application
```
yarn dev
```

# Routes

* http://localhost:4000/instagram/signin -> Route to signin using your Instagram account
* http://localhost:4000/instagram/callback -> Route that will receive Instagram's request with a code query parameter to be exchanged by an access_token
* http://localhost:4000/instagram/user -> Route that expects the user ID and returns it's data