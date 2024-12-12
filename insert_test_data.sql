-- Use the myportfolio database
USE myportfolio;

-- Insert data into the myproject table
INSERT INTO myproject (name, description, features, technology) VALUES 
-- Insert data for Abel's portfolio project
('Abels portfolio',
'This is a personal portfolio website showcasing the skills, projects, and contact information of my portfolio, a full-stack developer based in London. The website highlights expertise in web development, user-friendly design principles, and attention to detail.',
'Interactive Sections: Smooth transitions between sections such as Home, About, Portfolio, and Contact. Portfolio Showcase: Projects are displayed with interactive elements and hover effects for detailed previews. Light/Dark Mode Toggle: Provides an option for users to switch between themes. Contact Information: Includes details such as location, email, phone number, and links to social media profiles.', 
'Frontend: HTML5, CSS3 (including custom animations and transitions), JavaScript (for section control and theme toggle).'),
-- Insert data for Care Compass project
('Care Compass',
' Care Compass is a healthcare app designed to simplify access to health services. Developed as a group project, my primary focus was on the database and backend development, ensuring secure and efficient data management. The app features an intuitive interface with functionalities such as locating nearby hospitals and pharmacies, an AI chatbot for health queries, medication reminders, and curated health articles. It prioritizes accessibility and user-friendliness for all age groups.',
'Interactive Map: Displays nearby hospitals, clinics, and pharmacies with quick navigation options. AI Chatbot: Answers health-related queries in real time with a conversational interface. Medication Reminders: Allows users to set and manage notifications for medications. Health Articles: Provides verified medical content for user education. User-Centric Design: Customizable homepage and easy navigation.',
'Frontend: React.js with Capacitor for responsive design. Backend: Node.js, Express.js for API handling. Database: MySQL for secure data storage. APIs: Google Places API (location services), OpenAI API (chatbot), PubMed API (articles).');

