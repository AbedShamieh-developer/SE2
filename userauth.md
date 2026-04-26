# Objective (Functional Requirments)
We want to create user management system: 
- user has name, email, password in the model directory  


# Non Functional Requirments
- Create user model that has a name, email, password
- Create user repository for sqlite by creating a new file that implements the IRepository interface and creates a new table in sqlite on init() and a form same of the other repos. 
- create user service handles the crud opertaion for user with the db 
- Create user controller that validates request before valling service and formulates response before sending it to the client
