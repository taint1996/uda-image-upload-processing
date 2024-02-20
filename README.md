# Welcome to My Image Processing Project
### This project I've implement 3 APIS and using some package:
  - **For develop:**
    // express, sharp, fs, eslint, prettier, del-cli
  - **For testing:**
    // jasmine, jasmine-spec-reporter
---
##### GET http://localhost:8080/
  - Go To Overview Image Processing UI.

---
##### GET http://localhost:8080/api/img/:img
  - There is 3 types of this URL

  ```bash
    1. http://localhost:8080/api/img/:img?s={size}
  ```
  ###### s: This is a size type string. It use to resize image: full | medium | small
  ###### (Ex: http://localhost:8080/api/img/fjord?s=small -> It will resize image to size small and format to png)

  ```bash
    2. http://localhost:8080/api/img/:img?w={width}&h={height}
  ```
  ###### w: This is the width of image.
  ###### h: This is the height of image.
  - I just let the user input width and height >= 50 pixels that I render an image which has width and height based on their input
  - Ex: http://localhost:8080/api/img/fjord?w=300&h=300 -> It will resize image which is width=300pixels and height=300pixels. Then save it with a new name with additional width and height (fjord_300x300.png)

---
##### GET http://localhost:8080/api/images
  - Get All images default in public folder

* To **start** project, enter this in command line
```bash
  npm install
  nvm use v16.15.0
  npm run start
```

* To run **test**, enter this in command line
```bash
  npm run test
```

### Thank for Reading

### Author: Tez - taint1996
