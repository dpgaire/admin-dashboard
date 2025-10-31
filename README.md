# AI Portfolio Admin Dashboard

A modern, responsive React admin dashboard for managing the content of a personal portfolio. This dashboard also includes a chat interface for interacting with a custom-trained AI chatbot.

## 🚀 Features

### Core Functionality
- **Authentication**: Secure login with email and password, JWT token management, and protected routes to ensure data security.
- **Dashboard Overview**: Provides a comprehensive summary of activities, including statistics for blogs, projects, skills, and user feedback. Features monthly statistics charts, content distribution pie charts, quick links for easy navigation, and a feed of recent activities.

### Content Management
- **About Section**: Dedicated module to manage and update the "About Me" content, including title and detailed description.
- **Blogs Management**: Full CRUD (Create, Read, Update, Delete) operations for blog posts. Supports rich content with fields like title, slug, category, content, author, image URL, excerpt, estimated read time, publication date, likes count, featured status, and tags. Includes import/export functionality for blog data.
- **Projects Management**: Comprehensive CRUD for portfolio projects. Details include title, description, long description, category, live demo URL, GitHub repository URL, image, problem statement, development process, solution, featured status, active status, multiple screenshots, and a list of technologies used. Features import/export for project data.
- **Skills Management**: Allows for the creation, reading, updating, and deletion of skill categories and individual skills within each category (e.g., skill name, proficiency percentage, and associated icon). Supports import/export of skill data.
- **Library**: A system to manage PDF documents, including title, description, URL, author, and cover image. PDFs can be viewed directly within a modal, with an option for full-screen viewing.
- **Notes**: Simple yet effective tool for creating, reading, updating, and deleting personal notes with title and content. Includes import/export capabilities.
- **Quick Links**: Manage a collection of frequently accessed external links with titles and URLs. Offers import/export functionality.
- **Code Log**: A repository for storing and managing reusable code snippets. Each snippet includes a title and the code itself. Features copy-to-clipboard, and import/export options.

### AI Chatbot Integration
- **Chat Interface**: A real-time, interactive chat interface for users to communicate with a custom-trained AI assistant.
- **Chat History**: Provides a record of past conversations with the AI chatbot, allowing administrators to review interactions.
- **Chat Users**: Manages the list of users who have interacted with the chatbot.
- **Training Data Management**: Facilitates the management of data used to train the AI model, including categories, titles, content, and tags. Supports import/export of training data.

### Productivity Tools
- **Pomodoro Timer**: A customizable timer for managing work and break intervals, featuring notifications and motivational quotes to enhance focus.
- **Goal Setting (OKRs)**: A system for defining objectives and tracking progress through measurable key results. Allows for creation, editing, and deletion of objectives and their associated key results.

### Utilities
- **Markdown Editor**: A powerful real-time markdown editor with a live preview. Features include PDF export, HTML export, word/character/line count, copy to clipboard, clear content, and a full-screen mode for distraction-free writing.
- **Rich Text Editor**: A What You See Is What You Get (WYSIWYG) editor offering extensive formatting options, including bold, italic, underline, strikethrough, text alignment, lists, links, images, code blocks, and quotes. Provides word/character count, estimated reading time, PDF export, HTML export, copy, clear, and full-screen mode.
- **JSON Formatter**: A utility to format and validate JSON data, with options to copy to clipboard, toggle preview, and enter full-screen mode.
- **Expense Tracker**: A tool to monitor and manage income and expenses. Users can categorize transactions, set dates, and input amounts. Displays total income, total expenses, and net balance. Allows for editing and deleting transactions.

### User Management
- **Contacts**: View and manage user feedback messages received from the portfolio, including sender's name, email, subject, and message. Supports deletion of individual or selected contacts.
- **Queries**: Displays user queries submitted through the portfolio, showing the query content and timestamp. Allows for deletion of individual or selected queries.
- **Profile Management**: Users can view and update their personal profile information, including full name, email, password, and profile image.

### UI/UX Enhancements
- **Responsive Design**: Ensures a seamless and optimized user experience across various devices and screen sizes.
- **Dark Mode**: A toggleable dark theme for improved readability and reduced eye strain in low-light environments.
- **Toast Notifications**: Provides user-friendly, non-intrusive feedback for all actions and system events.
- **Command Palette**: Offers quick navigation and access to various features through keyboard shortcuts.
- **Drag-and-Drop Functionality**: Implemented in the task management section for intuitive organization.
- **Pagination**: Efficiently handles large datasets in tables and lists, improving performance and user experience.

## 🛠 Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management & Data Fetching**: TanStack Query (React Query)
- **Form Handling**: React Hook Form
- **Validation**: Yup, Zod
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast, Sonner
- **Drag and Drop**: @hello-pangea/dnd
- **Date Picker**: React Day Picker
- **Carousel**: Embla Carousel React
- **Charts**: Chart.js, Recharts, React Chartjs 2
- **Markdown**: React Markdown, Remark GFM, Prism React Renderer
- **PDF Generation**: jspdf, html2canvas
- **JSON Viewer**: React JSON View
- **Animations**: Framer Motion
- **Theming**: Next Themes
- **Utility Libraries**: clsx, tailwind-merge, date-fns, input-otp, vaul

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