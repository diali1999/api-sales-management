# Sales-Management-System

This is the backend part of sales-management web-app, which basically helps to track the activities of the sales personnel and mainly focuses on medium and smalll sized organizations, as there the major lacking is people management.

# Deployment

The API back-end and the front-end server will be deployed on a Linux server,
preferably having Ubuntu operating system.

To run this web-app, execute the following steps:
1. clone the repo or run ``git clone git@github.com:harshitdxt3004/api-sales-management.git`` or ``git clone https://github.com/harshitdxt3004/api-sales-management.git``.
2. run ``cd api-sales-management``.
3. run ``npm install`` .
4. install mysql (or click the [link](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04) for installation help).
5. ## create a database and run the following:
~~~~sql
CREATE USER 'sql_username'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *test* TO 'sql_username'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
~~~~
6. ## now create a .env file inside your api-sales-management directory and put the following information inside it.
```
PORT=5000
DB_NAME=<database_name>
DB_USER=<sql_username>
DB_PASS=<password>
ACCESS_TOKEN_LIFE=1440
JWT_SECRET=<any_name>
NODE_ENV=development
```
7. ## Now make an account on CLOUDINARY and put the following lines inside .env file.
```
CLOUDINARY_URL=<url>
API_KEY=<key>
API_SECRET=<secret>
CLOUD_NAME=<name>
```
8. finally run ``npm start`` and you can see "tables created succesfully" message.
## To connect this web-app with the front-end part, go to this [link](https://github.com/harshitdxt3004/sales-management).
