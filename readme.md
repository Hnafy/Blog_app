# 📝 Blog App (MERN Stack)

<div align="center">

  <a href="">
    <img src="https://raw.githubusercontent.com/Hnafy/Blog_app/refs/heads/main/image/image1.png" width="400" alt="Homepage Screenshot">
  </a>

<br><br>

  <a href="">
    <img src="https://raw.githubusercontent.com/Hnafy/Blog_app/refs/heads/main/image/image2.png" width="400" alt="Dashboard Page">
  </a>

</div>

<p>
   📘 <a href="https://documenter.getpostman.com/view/32173598/2sB3QNqpDn" target="_blank"><strong>API Documentation (Postman)</strong></a>
</p>

<h3 align="center">Modern Blog Platform</h3>

<p align="center">
  A full-featured blogging web app built with the MERN stack that allows users to read, create, edit, and manage blog posts with authentication and a rich editor experience.
  <br />
  <a href="https://hanfy-blog.netlify.app"><strong>View Demo »</strong></a>
  <br />
  <br />
  <a href="https://github.com/Hnafy/Blog_app/issues/new?labels=bug">Report Bug</a>
  &middot;
  <a href="https://github.com/Hnafy/Blog_app/issues/new?labels=enhancement">Request Feature</a>
</p>

---

## 🧭 Table of Contents

1. [About the Project](#about-the-project)
2. [Features](#features)
3. [Built With](#built-with)
4. [Getting Started](#getting-started)

   * [Installation](#installation)
   * [Environment Variables](#environment-variables)
5. [Usage](#usage)
6. [Future Enhancements](#future-enhancements)
7. [Contact](#contact)

---

## 🧩 About the Project

The **Blog App** is a full-stack application built with the **MERN stack (MongoDB, Express, React, Node.js)**.
It enables users to create accounts, write blog posts, edit or delete them, and explore articles from others with an intuitive and responsive design.

Admins have the ability to manage users and posts, while users can focus on sharing their thoughts, stories, and tutorials.

Key modules include:

* 🧑‍💻 **Authentication system**
* 📰 **Rich text editor for blog posts**
* 💬 **Comments and likes**
* 🏷️ **Categories and tags**
* 📱 **Fully responsive UI**

---

## 🚀 Features

* 🔐 **User Authentication** (JWT & Cookies)
* ✍️ **Create, Edit, and Delete Blog Posts**
* 💬 **Add Comments and Likes**
* 🧑‍💼 **Admin Panel for Managing Users and Posts**
* 🏷️ **Categories & Tags Filtering**
* 🔍 **Search Functionality**
* 📸 **Image Upload Support**
* 📱 **Responsive UI with TailwindCSS**
* 🌐 **RESTful API using Express.js and MongoDB**

---

## 🛠️ Built With

* [![React][React.js]][React-url]
* [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
* [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
* [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
* [![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge\&logo=jsonwebtokens\&logoColor=white)](https://jwt.io/)

---

## ⚙️ Getting Started

Follow these steps to run the project locally.

### 🧩 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Hnafy/Blog_app.git
   ```

2. **Navigate to the frontend folder**

   ```bash
   cd front_end
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create a `.env` file in `/front_end` and add:**

   ```bash
   VITE_BASE_URL=https://hanafy-blog.vercel.app
   ```

5. **Run the frontend**

   ```bash
   npm run dev
   ```

6. **Go to backend folder**

   ```bash
   cd ../back_end
   ```

7. **Install backend dependencies**

   ```bash
   npm install
   ```

### 🔑 Environment Variables

Create a `.env` file in the `/back_end` directory with:

```bash
SECRET_KEY=***
PORT=3000
MONGODB_URI=***
CLOUDINARY_CLOUD_NAME=***
CLOUDINARY_API_KEY=***
CLOUDINARY_API_SECRET=***
```

8. **Run the backend server**

   ```bash
   nodemon index.js
   ```

---

## 💡 Usage

Once both servers are running:

* **Users** can:

  * Register and log in
  * Write new blog posts with images and rich text
  * Comment and like posts
  * Filter posts by category or tags

* **Admins** can:

  * Manage users and posts
  * Approve or delete inappropriate content

---

## 🛣️ Future Enhancements

* 💾 **Save Drafts before Publishing**
* 🌙 **Dark/Light Mode**
* 💌 **Email Notifications for New Comments**
* 🧠 **AI-Powered Post Recommendations**
* 📱 **Mobile App Version**

---

## 📞 Contact

**Ahmed Naser**
[GitHub](https://github.com/Hnafy) • [X](https://x.com/a7med7530)


[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://react.dev/