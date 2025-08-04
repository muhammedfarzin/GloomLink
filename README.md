# 🌐 GloomLink

**GloomLink** is a full-stack social media platform built with the MERN stack and TypeScript. It combines classic social features like following users, posts, likes, and comments with real-time chat and **video calling (WebRTC)**—all wrapped in a modern UI using TailwindCSS.

🔗 [**Live URL**](https://gloomlink.farzin.in)

## 🧩 Features

### 👥 Social Features

- Google authentication (Firebase)
- Follow/unfollow accounts
- Create and interact with posts
- Like and comment system
- Profile viewing and user search

### 💬 Real-Time Communication

- 1:1 chat using **Socket.io**
- **Video calling** powered by **WebRTC**

### 🎨 UI & Themes

- Fully responsive design with **TailwindCSS**
- **Multiple theme support** (Light / Dark and others)

### 🧑‍💻 Admin Panel

- Secured admin login via environment-based credentials
- Available at `/admin` route

## ⚙️ Tech Stack

| Layer              | Technology                               |
| ------------------ | ---------------------------------------- |
| **Frontend**       | React.js, TypeScript, TailwindCSS        |
| **State Mgmt**     | Redux                                    |
| **Backend**        | Node.js, Express.js, TypeScript, MongoDB |
| **Authentication** | JWT, Google OAuth (Firebase)             |
| **Real-Time**      | Socket.io, WebRTC                        |
| **Media Storage**  | Cloudinary                               |

## 🛠️ Setup Instructions

### 📦 1. Clone the Repository

```bash
git clone https://github.com/muhammedfarzin/GloomLink.git
cd GloomLink
```

### 🔧 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/` with the following:

```env
PORT=your_app_port
MONGO_URI=your_mongodb_connection_uri

# Cloudinary
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mail config
MAIL_HOST=your_smtp_host
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password

# Token Secrets
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Admin credentials
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

> **Note**: Replace all values with your own credentials.

#### 🔄 Development Mode

Start the Backend in development mode(Server)

```bash
npm run dev
```

#### 🏗 Build Server

To compile the backend TypeScript code for production:

```bash
npm run build
```

This will generate a `dist/` directory containing the compiled JavaScript files.

#### 🚀 Run Built Server

To run the compiled server code:

```bash
npm start
```

This command will start the backend from the `dist/` directory using Node.js.

---

### 🎨 3. Client Setup

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
```

#### 🔧 Environment Configuration

Create a `.env` file inside the `client/` folder with the following content:

```env
VITE_API_BASE_URL=your_server_base_url
```

> **Note**: Replace your_server_base_url with the actual URL of your backend server (e.g., http://localhost:5000 or your deployed URL).

#### 🔄 Development Mode (Client)

To start the frontend in development mode:

```bash
npm start
```

This runs the React + Vite development server.
Visit http://localhost:3000 (or the port configured in Vite) to view the app in your browser.

#### 🏗 Build Frontend for Production

To build the frontend for production deployment:

```bash
npm run build
```

This creates a production-ready build in the `dist/` directory of the client project. You can serve this with a static server or integrate it with your backend.

### 🔐 4. Admin Panel

- Accessible via: `/admin` (e.g., http://localhost:3000/admin)
- Admin credentials are set in your `server/.env`:
