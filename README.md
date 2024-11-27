# **LEMO Juice Bar Management System**

## **Team Members**

**Team 4**  
1. **K. P. V. Kumarage** - IT23178540  
2. **W. P. C. L. Pathirana** - IT23230910  
3. **M. S. Samarasinghe** - IT23190016  
4. **D. A. S. Oshan** - IT23281950  

---

## **Project Description**

The **LEMO Juice Bar Management System** is a user-friendly application designed to manage the day-to-day operations of a juice bar. It offers features for:  
- **Inventory tracking**  
- **Sales management**  
- **Product management**  
- **Supplier coordination**  
- **Detailed report generation**

This system integrates backend and frontend components to enable efficient operations and ensure seamless communication.

---

## **Key Features**

- **Inventory Management**: Track juice stock levels, fruit usage, and reorder requirements  
- **Sales Management**: Monitor daily sales, track revenue generation, and identify top-selling products to optimize business performance
- **Juice Management**: Display and manage different juice products and their ingredients 
- **Supplier Management**: Keep track of supplier details, orders placed, and performance
- **Report Generation**: Generate detailed reports on sales, inventory, juice performance, and supplier activities

---

## **Technologies Used**

- **Backend**: Java, Spring Boot, JPA & Hibernate, MySQL  
- **Frontend**: HTML, CSS, JavaScript (with **Chart.js** for visualizations)  
- **Tools**: Apache POI, iText  

---

## **System Overview**

This project features:  
- **Java Spring Boot Backend**: Located in the `mywebapp` folder, it provides a **RESTful API** for communication with the frontend, handling business logic, database interactions, and report generation in **CSV** and **PDF** formats.  
- **HTML/CSS/JavaScript Frontend**: Located in the `Frontend` folder, it delivers a responsive and user-friendly interface with dashboards, interactive reports, and tools for managing inventory, sales, and suppliers.  

Together, they ensure efficient and reliable management of juice bar operations.

---

## **Folder Structure**

- **`mywebapp/src/`**: Contains the Java source code for the backend logic, organized into packages:  
  - **Controllers**: Handles API endpoints
  - **Services**: Implements business logic
  - **Repositories**: Manages database operations
  - **Models**: Represents data entities
  - **Utilities**: Provides helper functions

- **`mywebapp/resources/`**: Contains configuration files, templates, and resources, including:  
  - **`application.properties`**: Defines database connection details and other settings

- **`Frontend/`**: Contains the user-facing code, built with HTML, CSS, and JavaScript
  - **`Frontend/Components/`**: Organized into subfolders for modules like:  
    - Dashboard  
    - Orders  
    - Reports  
    - Sales  
    - Users  

- **Specific Files**:  
  - **`Dashboard.html`**: Displays an overview of sales, inventory, and orders
  - **`juice_table.html`**: Manages juice product details, including ingredients and stock levels
  - **`login.html`**: Login page for accessing the system
  - **`styles.css`**: Central stylesheet for consistent design across pages
  - **`script.js`**: Contains JavaScript functions for interactivity and API integration

- **Other Directories and Files**:  
  - **`.idea/`**: Stores IDE-specific settings for IntelliJ IDEA
  - **`.mvn/`**: Contains Maven wrapper files for building and running the application
  - **`pom.xml`**: Defines dependencies, build configurations, and plugins
  - **`HELP.md`**: Provides instructions or references for project setup and troubleshooting

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/KumarageKPV/LEMO-Juice-Bar.git
cd LEMO-Juice-Bar
```

### **2. Set Up the MySQL Database**
Create a database in MySQL for the project:
```sql
CREATE DATABASE juice_bar;
```

### **3. Configure `application.properties`**  
Edit the file located in `src/main/resources/` to include your database connection details:  
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/juice_bar
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### **4. Run the Application**
Run the Spring Boot backend using Maven:
```bash
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### **5. Open the Frontend**  
- Navigate to the `Frontend` folder.  
- Open `Dashboard.html` or other relevant pages in your browser to view the frontend interface.

---

## **API Endpoints**

- **Sales Report**: `/api/reports/sales`  
- **Inventory Report**: `/api/reports/inventory`  
- **Juice Report**: `/api/reports/juice`  
- **Supplier Report**: `/api/reports/supplier`  


---

## **Future Improvements**

- **Mobile App Integration**: Develop a mobile app for better access to reports and management functionalities on the go.  
- **Advanced Analytics**: Implement advanced analytics like forecasting, demand prediction, and supplier evaluation.

---

## **Contact**

For inquiries or issues, please reach out to the team via email or the project repository.
