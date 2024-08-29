# Video Calling App

## Overview

The Video Calling App is a real-time communication application built with Express.js, MongoDB, React.js, Socket.IO, and PeerJS. It allows users to host and join video calls seamlessly, manage meetings effectively, and provides a secure registration and login process.

## Features

- **Real-Time Video Communication**: Achieved using Socket.IO and PeerJS for smooth and interactive video calls.
- **Secure Account Management**: Improved user registration and login processes for enhanced application security.
- **Easy Meeting Management**: Allows users to create and join meetings effortlessly for a streamlined experience.

## Technologies Used

- **Frontend**: React.js
- **Backend**: Express.js
- **Database**: MongoDB
- **Real-Time Communication**: Socket.IO, PeerJS

## Installation

### Prerequisites

- Node.js
- MongoDB
- PeerJS

#### 1. Clone the Repository

   ```bash
   git clone https://github.com/TechThrives/Video-Calling-App
   ```

#### 2. Set Up the Back-End
- #### Navigate to the Back-End Directory
``` bash
cd video-calling-backend
```

- #### Install Dependencies
```bash
npm install
```

- #### Configure Environment Variables
    In the root directory of your React App, create a file named `.env`.
    
    Open the `.env` file and add the following environment variables:

    - **`PORT`**: Specifies the port on which the backend server will listen.

    - **`MONGO_URI`**: Connection string for MongoDB, including credentials and database information.

    - **`JWT_SECRET`**: Secret key used for signing JSON Web Tokens.

    - **`FRONTEND_URL`**: URL of the frontend application for CORS configuration.

    - **`PASSPHRASE`**: Passphrase for SSL certificate, used for encryption.

    - **`SSL_CRT_FILE`**: Path to the SSL certificate file used for HTTPS communication. For example, `../credentials/rootCA.cert`.

    - **`SSL_KEY_FILE`**: Path to the SSL key file associated with the SSL certificate. For example, `../credentials/rootCA.key`.

    By setting these environment variables, you ensure that your application is configured correctly for different environments and scenarios.

- #### Start the Back-End
``` bash
npm start
```

#### 2. Set Up the PeerJS Server
- #### Navigate to the PeerJS Directory
``` bash
cd peerjs-server
```

- #### Install Dependencies
```bash
npm install
```

- #### Configure Environment Variables
    In the root directory of your React App, create a file named `.env`.
    
    Open the `.env` file and add the following environment variables:

    - **`FRONTEND_URL`**: URL of the frontend application for CORS configuration.

    - **`PASSPHRASE`**: Passphrase for SSL certificate, used for encryption.

    - **`SSL_CRT_FILE`**: Path to the SSL certificate file used for HTTPS communication. For example, `../credentials/rootCA.cert`.

    - **`SSL_KEY_FILE`**: Path to the SSL key file associated with the SSL certificate. For example, `../credentials/rootCA.key`.

    By setting these environment variables, you ensure that your application is configured correctly for different environments and scenarios.

- #### Start the PeerJS Server
``` bash
npm start
```

#### 4. Set Up the Front-End
- #### Navigate to the Front-End Directory
``` bash
cd video-calling-frontend
```

- #### Install Dependencies
```bash
npm install
```

- #### Configure Environment Variables
    In the root directory of your React App, create a file named `.env`.
    
    Open the `.env` file and add the following environment variables:

    - **`REACT_APP_SERVER`**: URL of the backend server that the React application will communicate with.

    - **`REACT_APP_PEER_SERVER`**: Hostname or IP address of the PeerJS server used for real-time communication.

    - **`REACT_APP_PEER_PORT`**: Port on which the PeerJS server is listening.

    - **`REACT_APP_PEER_PATH`**: Path to the PeerJS server endpoint used for establishing connections.

    - **`HTTPS`**: Set to `true` to enable HTTPS for secure communication.

    - **`SSL_CRT_FILE`**: Path to the SSL certificate file used for HTTPS communication. For example, `../credentials/rootCA.cert`.

    - **`SSL_KEY_FILE`**: Path to the SSL key file associated with the SSL certificate. For example, `../credentials/rootCA.key`.

    By setting these environment variables, you ensure that your application is configured correctly for different environments and scenarios.

- #### Start the Front-End
``` bash
npm start
```

#### 5. Access the Application
Open your browser and go to http://localhost:3000 to start using the app.

## Usage
**Registration & Login**: Securely register and log in using your credentials.

**Create a Meeting**: Set up a new meeting with a unique ID and invite participants.

**Join a Meeting**: Enter the meeting ID to join an ongoing video call.

## Contributing
We welcome contributions from the community. To contribute to this project, please follow these guidelines:

- Fork the repository
- Create a new branch for your feature or bug fix
- Make your changes and ensure they are well-tested
- Create a pull request to the main branch of the original repository

## Developers
- Swarup Kanade [@swarupkanade](https://www.github.com/swarupkanade)
- Omkar Kanade [@omkarkanade](https://www.github.com/omkarkanade)
