# AI Portfolio Admin Dashboard

A modern, responsive React admin dashboard for managing the content of a personal portfolio. This dashboard also includes a chat interface for interacting with a custom-trained AI chatbot.

## 🚀 Features

### Content Management
- **Skills**: Create, read, update, and delete skills and skill categories.
- **Projects**: Create, read, update, and delete projects, including details like descriptions, technologies, and links.
- **Blogs**: Create, read, update, and delete blog posts.
- **About**: Manage the content of the "About Me" section.
- **Contacts**: View contact messages.
- **Queries**: View user queries from the portfolio.

### AI Chatbot
- **Chat Interface**: A real-time chat interface for interacting with the AI chatbot.
- **Training**: A dedicated page for submitting new data to train the chatbot.

### General
- **Secure Login**: Email and password authentication.
- **JWT Token Management**: Securely stored and managed.
- **Protected Routes**: All dashboard routes require authentication.
- **Responsive Design**: A clean and modern UI that works on all screen sizes.
- **Toast Notifications**: User-friendly feedback for all actions.

## 🛠 Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (or npm/yarn)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd admin-dashboard
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Start the development server**
    ```bash
    pnpm run dev
    ```

4.  **Open your browser**
    Navigate to `http://localhost:5173`

### API Configuration

The dashboard is configured to connect to the backend API at `http://localhost:3000/api`. To change this, update the `API_BASE_URL` in `src/services/api.js`:

```javascript
const API_BASE_URL = 'your-api-endpoint';
```

## 📄 API Endpoints

The dashboard interacts with the following API endpoints:

- **Auth**
  - `POST /api/auth/login`

- **Skills**
  - `GET /api/skills`
  - `POST /api/skills`
  - `PUT /api/skills/:id`
  - `DELETE /api/skills/:id`

- **Projects**
  - `GET /api/projects`
  - `POST /api/projects`
  - `PUT /api/projects/:id`
  - `DELETE /api/projects/:id`

- **Blogs**
  - `GET /api/blogs`
  - `POST /api/blogs`
  - `PUT /api/blogs/:id`
  - `DELETE /api/blogs/:id`

- **About**
  - `GET /api/about`
  - `POST /api/about`
  - `PUT /api/about/:id`
  - `DELETE /api/about/:id`

- **Contact**
  - `GET /api/contact`

- **Queries**
  - `GET /api/queries`

- **Training**
  - `POST /api/train`

- **Chat**
  - `POST /api/chat`