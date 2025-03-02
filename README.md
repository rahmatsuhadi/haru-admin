# API Documentation - Database Management

This repository contains the documentation for the API that provides database management functionality. The API allows you to manage databases, tables, columns, and records. Below is the list of available endpoints and their descriptions.

## Base URL
https://your-api-base-url.com/api/v1


## Access Swagger UI

You can view and interact with the API documentation using **Swagger UI**. To access the Swagger UI for this API, open the following URL in your web browser:

http://your-api-base-url.com/api-docs/

This will load the Swagger interface where you can:
- View all available endpoints
- See details about each endpoint, such as request parameters and response formats
- Test API calls directly from the browser using Swagger's interactive UI

Ensure that your local server is running at `http://localhost:3000` before accessing the Swagger UI.

---


## Available Endpoints

### 1. **Databases**

#### 1.1 [GET] `/api/v1/schema/databases`
- **Description**: Find All Databases
- **Tags**: databases
- **Responses**:
  - 200: OK
  - 500: Server Error

#### 1.2 [POST] `/api/v1/schema/databases`
- **Description**: Create a Database
- **Tags**: databases
- **Request Body**:
  - **name** (string): The name of the database.
  - **projectName** (string): The project name.
  - **type** (string): The type of database (`mysql` or `mongodb`).
  - **uri** (string): The URI for the database.
- **Responses**:
  - 201: Created
  - 400: Bad Request
  - 409: Conflict
  - 500: Server Error

#### 1.3 [DELETE] `/api/v1/schema/databases/{id}`
- **Description**: Delete Database by ID
- **Tags**: databases
- **Parameters**:
  - `id` (integer): The ID of the database.
- **Responses**:
  - 200: OK
  - 409: Conflict
  - 500: Server Error

---

### 2. **Tables**

#### 2.1 [GET] `/api/v1/schema/databases/{id}`
- **Description**: Find All Tables in a Database
- **Tags**: tables
- **Parameters**:
  - `id` (integer): The ID of the database.
- **Responses**:
  - 200: OK
  - 500: Server Error
  - 404: Not Found

#### 2.2 [POST] `/api/v1/schema/databases/{id}`
- **Description**: Create a Table in a Database
- **Tags**: tables
- **Parameters**:
  - `id` (integer): The ID of the database.
  - Request Body:
    - **name** (string): Name of the table.
    - **fields** (array): List of fields for the table (defined below).
- **Responses**:
  - 201: Created
  - 400: Bad Request
  - 409: Conflict
  - 500: Server Error

#### 2.3 [GET] `/api/v1/schema/databases/{id}/{table}`
- **Description**: Find Columns in a Table
- **Tags**: tables
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
- **Responses**:
  - 200: OK
  - 500: Server Error

#### 2.4 [DELETE] `/api/v1/schema/databases/{id}/{table}`
- **Description**: Delete Table by Name
- **Tags**: tables
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
- **Responses**:
  - 200: OK
  - 409: Conflict
  - 500: Server Error

---

### 3. **Columns**

#### 3.1 [POST] `/api/v1/schema/databases/{id}/{table}/add-column`
- **Description**: Add a Column to a Table
- **Tags**: column
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
  - Request Body:
    - **fields** (array): List of fields to be added (defined below).
- **Responses**:
  - 200: OK
  - 409: Conflict
  - 500: Server Error

#### 3.2 [POST] `/api/v1/schema/databases/{id}/{table}/drop-column`
- **Description**: Drop a Column from a Table
- **Tags**: column
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
  - Request Body:
    - **fields** (array): List of column names to drop.
- **Responses**:
  - 200: OK
  - 409: Conflict
  - 500: Server Error

---

### 4. **Records**

#### 4.1 [GET] `/api/v2/{id}/{table}`
- **Description**: Find All Records in a Table
- **Tags**: record
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
- **Responses**:
  - 200: OK
  - 500: Server Error

#### 4.2 [POST] `/api/v2/{id}/{table}`
- **Description**: Create a Record in a Table
- **Tags**: record
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
  - Request Body:
    - **fields** (array): The data of the record.
- **Responses**:
  - 201: Created
  - 400: Bad Request
  - 409: Conflict
  - 500: Server Error

#### 4.3 [GET] `/api/v2/{id}/{table}/{recordId}`
- **Description**: Find a Record by ID
- **Tags**: record
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
  - `recordId` (string): The ID of the record.
- **Responses**:
  - 200: OK
  - 400: Not Found
  - 500: Server Error

#### 4.4 [PATCH] `/api/v2/{id}/{table}/{recordId}`
- **Description**: Update a Record
- **Tags**: record
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
  - `recordId` (string): The ID of the record.
  - Request Body:
    - **fields** (array): The updated data of the record.
- **Responses**:
  - 201: Updated
  - 400: Bad Request
  - 409: Conflict
  - 500: Server Error

#### 4.5 [DELETE] `/api/v2/{id}/{table}/{recordId}`
- **Description**: Delete a Record
- **Tags**: record
- **Parameters**:
  - `id` (integer): The ID of the database.
  - `table` (string): The name of the table.
  - `recordId` (string): The ID of the record.
- **Responses**:
  - 200: OK
  - 500: Server Error

---

## Definitions

### Table
- **name** (string): Name of the table.
- **fields** (array): A list of fields for the table.
  - **name** (string): Name of the field.
  - **type** (string): Type of data (NUMBER, STRING, DATE, BOOLEAN).
  - **isRequired** (boolean): Whether the field is required.

### Database
- **projectName** (string): Name of the project.
- **name** (string): Name of the database.
- **uri** (string): URI of the database.
- **type** (string): Type of the database (mysql, mongodb).

### Column
- **fields** (array): List of fields to be added or dropped from the table.
  - **name** (string): Name of the column.
  - **type** (string): Type of data (NUMBER, STRING, DATE, BOOLEAN).
  - **isRequired** (boolean): Whether the column is required.

### Record
- **fields** (array): List of data fields for the record.

---

## Schemes
- https
- http

