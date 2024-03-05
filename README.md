## Movie App with Admin Dashboard

## Purpose
This repository serves as a learning resource for beginner developers and learners of the MERN stack (MongoDB, Express.js, React.js, Node.js). By exploring the code and structure of this project, individuals new to web development can gain insights into building full-stack web applications using the MERN stack.

## Overview
This Movie App is a web application built with React,MongoDB,Express.js and Node.js . It allows users to browse, search, and discover movies. Users can explore a collection of movies, view details, and save favorites. It includes an admin dashboard where administrators can manage movies, genres, and user accounts. Administrators have the ability to add, edit, and delete movies, genres and add and delete user accounts(admin) as well as manage user accounts by changing their status.


## Live Demo
Explore the project deployed on Vercel:

- **Movie App Client**: Access the client application [here](https://movie-app-nine-drab.vercel.app/). Create an account to unlock the full functionality of the application.If you wish to log in as the current customer, please use the following credentials:

   **Movie App Login Credentials:**
  - **Email**: customer1@gmail.cm
  - **Password**: 123
    
- **Admin Panel**: Access the admin panel [here](https://movie-app-admin-panel-vl25.vercel.app/). Please log in to access administrative features.

    **Admin Login Credentials:**
  - **Email**: admin@netfilm.cm
  - **Password**: 123123

**Please note** that changes made in the [Admin Panel](https://movie-app-admin-panel-vl25.vercel.app/) will not be reflected in the [Movie App Client](https://movie-app-nine-drab.vercel.app/). The movie app client  and  admin panel operate independently and have separate databases. 
 You can view changes in the admin panel or download the repository and work on it.


## Features 
**Admin**
- Dashboard: Provides key metrics and tables.
- Movies Management: Add,read,edit, and delete movies from the database.
- Genres Management: Add,read,edit, and delete genres for categorizing movies.
- User Management: 
  - Manage user accounts, including activation and deactivation.
  - Create employees (admin users) based on roles.
  - Implement role-based access control for certain pages.
  - Login is allowed only if the user's status is active. Inactive users cannot log in and are shown an appropriate error message.

**Client**
- Browse movies.
- View movie details including rating,length and genres
- Search for movies by title.
- Filter movies by genre and ratings.
- Save favorite movies to a watchlist.
- User authentication:
  - Sign up to create an account.
  - Log in to access personalized features and watchlists.
  - Login is allowed only if the user's status is active. Inactive users cannot log in and are shown an appropriate error message.
  - Forgot password functionality for account recovery.
     - Send OTP to user's email for verification.
     - Verify OTP to confirm identity.
     - Reset password after successful verification.
    
## Installation
1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Start the development server using `npm run dev`.

## Technologies Used

- **Frontend**:
  - React.js
  - Vite
  - Axios (for API requests)
  - React Router (for navigation)
  - Toastify
  - Other frontend libraries

- **Backend**:
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - Cloudinary
  - Multer
  - Bcrypt
  - JWT
  - Nodemailer
  - Other backend technologies

- **Deployment**:
  - Hosting platform is Vercel
  - MongoDB Atlas (for database hosting)
   


## Client App

![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1708999199/movieapp%20images/frontpage1_jn649x.png)  ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709000460/movieapp%20images/signup_epnumr.png)   ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1708999198/movieapp%20images/forgotpassword_rohks3.png)  ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709046555/movieapp%20images/mobileview_vxtnn4.png)  ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709236287/movieapp%20images/tabletview_f5ro0f.png)   ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709236569/movieapp%20images/watchlater_zcfwfh.png) ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709236066/movieapp%20images/bigscreenview_x8rqgh.png)


## Admin Dashboard

### Admin Roles
Manage your admin roles with the following credentials:

#### Content Administrator
- **Email**: contentadmin@netfilm.cm
- **Access Level**: Can manage content-related tasks, such as adding, editing, and deleting movies and genres.

#### User Administrator
- **Email**: useradmin@netfilm.cm
- **Access Level**: Can manage user-related tasks, such as creating, updating, and deleting user accounts, and has the ability to change user status.

#### Super Admin
- **Email**: admin@netfilm.cm
- **Access Level**: Full access to all features and functionalities of the admin panel, including managing movies, users, and other administrative tasks.
- **Password**: 123123 *(the password is the same for all roles)*

![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709002813/movieapp%20images/dashboard_jjw169.png) ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709002813/movieapp%20images/dashboardtablet_duuvzm.png) ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709301519/movieapp%20images/dashboardbigscreen_gxprxr.png) ![Image of screenshot](https://res.cloudinary.com/dewu0skfo/image/upload/v1709301520/movieapp%20images/dashboardusers_ne2aem.png)
