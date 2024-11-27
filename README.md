LEMO Juice Bar Management System

Team Members

Team 4
1. K. P. V. Kumarage - IT23178540  
2. W. P. C. L. Pathirana - IT23230910  
3. M. S. Samarasinghe - IT23190016  
4. D. A. S. Oshan - IT23281950

Project Description

The LEMO Juice Bar Management System is a robust and user-friendly application designed to manage day-to-day operations of a juice bar. It offers features for inventory tracking, sales monitoring, product management, supplier coordination, and detailed report generation. The system enables interactions between backend and frontend components to enable efficient operations.

Key Features

•	Inventory management: Track juice stock levels, fruit usage, and reorder requirements.
•	Sales tracking: Monitor daily sales, revenue generation, and top-selling products.
•	Juice management: Display and manage different juice products and their ingredients.
•	Supplier management: Keep track of supplier details, orders placed, and performance.
•	Report generation: Generate detailed reports on sales, inventory, juice performance, and supplier activities.

This project features a Java Spring Boot backend and a HTML/CSS/JavaScript frontend working together to manage operations for the LEMO Juice Bar. The backend, located in the ‘mywebapp’ folder, provides a RESTful API for seamless communication with the frontend, handling business logic, database interactions, and report generation in CSV and PDF formats. The frontend, organized in the `Frontend` folder, delivers a responsive and user-friendly interface with dashboards, interactive reports using Chart.js, and tools for managing inventory, sales, and suppliers. Together, they ensure efficient and reliable management of juice bar operations.

Folder Structure

•	mywebapp/src/: Contains the Java source code for the backend logic, organized into packages for controllers (API endpoints), services (business logic), repositories (database operations), models (data entities), and utilities (helper functions).

•	mywebapp/resources/: Contains configuration files, templates, and resources used by the backend, including the main application settings file (application.properties).

•	application.properties: The Spring Boot configuration file that defines the database connection details, server properties, and other application settings.

•	Frontend/: Contains the code for the user-facing interface, built with HTML, CSS, and JavaScript. It includes pages, assets, and scripts for interacting with the backend API.

•	Frontend/Components/: Organized subfolders for specific components like Dashboard, Orders, Reports, Sales, and Users, each containing corresponding HTML, CSS, and JavaScript files.

•	Dashboard.html: The main HTML file for the dashboard interface, displaying an overview of sales, inventory, and orders.

•	juice_table.html: A specific page for managing juice product details, including ingredients and stock levels.

•	login.html: The login page for accessing the system.

•	styles.css: A central stylesheet for maintaining consistent design across all frontend pages.

•	script.js: A JavaScript file containing functions for interactivity, API calls, and handling user actions in the frontend.

•	.idea/: Stores IDE-specific settings for IntelliJ IDEA, including project configuration and workspace metadata.

•	.mvn/: Contains Maven wrapper files to facilitate building and running the application, ensuring consistent Maven functionality across environments.

•	pom.xml: The Maven project file that defines dependencies, build configurations, and plugins required for the project.

•	HELP.md: A helper document providing basic instructions or references for understanding or troubleshooting the project setup.

Technologies Used

•	Backend: Java, Spring Boot, JPA & Hibernate, MySQL
•	Frontend: HTML, CSS, JavaScript (with Chart.js for visualizations)
•	Tools: Apache POI, iText

Setup Instructions

1. Clone the repository

git clone https://github.com/KumarageKPV/LEMO-Juice-Bar.git
cd LEMO-Juice-Bar

2. Setup MySQL database

Create a database in MySQL for the project:

CREATE DATABASE juice_bar;

3. Configure ‘application.properties’ located in src/main/resources/:


spring.datasource.url=jdbc:mysql://localhost:3306/juice_bar
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

4. Run the application

To run the Spring Boot application, use the following command:

./mvnw spring-boot:run

This will start the backend on ‘http://localhost:8080’.

5. Open the frontend

•	Navigate to the Frontend folder
•	Open Dashboard.html or other relevant pages in your browser to view the frontend

API Endpoints

•	Sales report: ‘/api/reports/sales’
•	Inventory report: ‘/api/reports/inventory’
•	Juice report: ‘/api/reports/juice’
•	Supplier report: ‘/api/reports/supplier’

Future Improvements

Mobile app integration: Build a mobile app for better access to reports and management functionalities on the go.
Advanced analytics: Implement more advanced analytics like forecasting, demand prediction, and supplier evaluation.

Contact

For any inquiries or issues, please reach out to the team via email or the project repository.
