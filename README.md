Portfolio Website

- This project is a personal portfolio website designed to showcase skills, projects, and experiences. It serves as a digital resume and platform for personal branding, providing an interactive and professional overview.

Features
- Responsive Design: Optimised for viewing on desktops, tablets, and mobile devices.
- Interactive Project Gallery: Dynamic gallery with detailed project descriptions and links.
- Contact Form: Allows visitors to get in touch directly via the website.
- User Authentication: Secure registration and login system.
- Search Functionality: Convenient search bar for filtering projects by name or other attributes.

Technology used
- Backend: Node.js, Express.js
- Frontend: HTML, CSS, JavaScript, EJS
- Database: MySQL
- Authentication: bcrypt, express-session
- Additional Tools: express-validator, axios

Getting Started
Prerequisites

Ensure the following are installed on your system:
- Node.js 
- MySQL

Installation Steps

- bash
- Clone the repository:

- git clone https://github.com/yourusername/portfolio.git
- cd portfolios

Install project dependencies:

- bash
- npm install

Configure the database:
- Import the SQL files:
  - create_db.sql: Creates the required database structure.
  - insert_test_data.sql: Adds sample data for testing.
- Update the database credentials in index.js:

  javascript
  const db = mysql.createConnection({
      host: 'localhost',
      user: 'your_db_user',
      password: 'your_db_password',
      database: 'your_database_name'
  });
  
Run the project:

- bash
- npm start

- Open your browser and navigate to http://localhost to view the application.

Usage

Search Projects
- Navigate to the "works" page.
- Use the search bar to filter projects by name.

Access GitHub Repositories
- Register or log in to create an account.
- Navigate to /api/github-repos to view the GitHub repositories.

API Endpoints

Public Endpoints
- GET /api/myprojects: List all the projects.

Contact
For any inquiries, feel free to reach out via:

- Email: abedan1@outlook.com