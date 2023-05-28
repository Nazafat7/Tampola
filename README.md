# Tampola
Tampola Ticket
Project setup

npm install --

Compiles and hot-reloads for development

node app.js

api's- 
http://localhost:8080/api/createUser
{
    "username":"Test",
    "password":"Test@123",
    "email":"test@mail.com"
}

http://localhost:8080/api/login
{
    "email":"test@mail.com",
    "password":"Test@123"
}
http://localhost:8080/api/tickets
{
  "numTickets": 5
}

http://localhost:8080/api/ticketsList
{
    "id":1,
    "page":1
}
