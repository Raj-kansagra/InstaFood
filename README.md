# InstaFood - Food Delivery App

[**Live Demo**](https://instafood-self.vercel.app)

InstaFood is a full-stack web application designed to simplify food ordering and delivery. The app includes user authentication, cart management, order tracking, and responsive design to provide users with a seamless experience. Built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Authentication**: Secure signup and login using JWT tokens.
- **Cart Management**: Add, update, and remove items from the cart.
- **Order Management**: Track current and past orders.
- **Responsive Design**: Optimized for both mobile and desktop views.

## Tech Stack

### Frontend
- **React.js** with Hooks
- **Styled Components** for styling
- **Axios** for HTTP requests
- **React Router** for navigation

### Backend
- **Node.js** with **Express.js**
- **JWT** for user authentication
- **Bcrypt.js** for password hashing

### Database
- **MongoDB Atlas**: This project uses MongoDB Atlas, a cloud-based MongoDB service, for database management. MongoDB Atlas provides a fully-managed database

### Hosting
- **Vercel**: Frontend and backend hosted on Vercel.


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Raj-kansagra/InstaFood.git
   cd InstaFood

2. Install dependencies:
   
   ```bash
   cd client
   npm install
   cd ../server
   npm install

3. Create a .env file in the server directory and add the following environment variables:

   ```javascript
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<your-jwt-secret>

4. Update API base URL:

   - In `client/src/api/index.js`, make sure to use the appropriate baseURL for your environment.
  
     
   - For local development:
     ```javascript
     
      //const API = axios.create({
      //baseURL: "https://insta-food-backend.vercel.app/api",
      //});
     
      const API = axios.create({
      baseURL: "http://localhost:8080/api",
      });

6. Run the application:

   - **In the `server` directory**, run the backend:
     ```bash
     npm run start
     ```

   - **In the `client` directory**, run the frontend:
     ```bash
     npm start
     ```

7. Access the application in your browser:
   http://localhost:3000/




**Contributing**
------------

We welcome contributions to improve the Instafood. If you'd like to contribute, please fork the repository and submit a pull request with your changes.

**License**
-------

This project is licensed under the MIT License. See the LICENSE file for more details.

---

For any issues or feature requests, please open an issue on the GitHub repository: https://github.com/Raj-kansagra/InstaFood.git

Happy Coding!

