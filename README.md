# 1 month 6 days

The Link Hangouts Web Application
This repository contains the source code for The Link Hangouts web application, a platform designed for [briefly describe what it does, e.g., "event management and ticketing"].

Table of Contents
Prerequisites

Installation

Configuration

Redis Client

File Upload Directories

Database Setup

Running the Application

Development Mode

Production Mode with PM2

PM2 Management Commands

1. Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js: Version 14.x or higher (LTS recommended).

npm: Node Package Manager (comes with Node.js).

Redis Server: A running instance of Redis.

PM2: A production process manager for Node.js applications.

You can install PM2 globally using npm:

npm install -g pm2

2. Installation
Follow these steps to set up the project locally:

Clone the repository:

git clone <your-repository-url>
cd <your-repository-name>

Install server dependencies:
Navigate into the server directory and install the required packages.

cd server
npm install

Install client dependencies (if applicable):
If your project has a separate client-side application (e.g., in a client directory), navigate to it and install its dependencies.

# Assuming a client directory at the root level
cd ../client
npm install

(Adjust path if your client directory is named differently or located elsewhere.)

3. Configuration
Redis Client
Ensure your Redis server is running. The application will connect to it for caching and worker queue management. No specific client installation steps are typically needed beyond having the Redis server operational, as Node.js libraries will handle the connection.

File Upload Directories
For file management, you need to create specific directories within the server's parent directory (i.e., at the root level of your project, alongside the server folder). These directories are used for storing uploaded media, profiles, galleries, and event-related files.

From your project's root directory, execute the following commands:

mkdir file_manager
cd file_manager
mkdir media profile gallery events

This will create the following structure:

your-project-root/
├── server/
├── file_manager/
│   ├── media/
│   ├── profile/
│   ├── gallery/
│   └── events/
|   └── newsletter/
|   └── products/
|   └── compact-pics/
└── ...

4. Database Setup
To initialize your database and create an administrator account, use the seed:db script. This script must be run from the server directory.

Navigate to the server directory:

cd server

Run the seed script, providing the administrator's email, password, full name, and username:

npm run seed:db [admin_email_here] [password] "Full Name" "username_no_spaces"

Example:

npm run seed:db admin@example.com mySecurePassword "Admin User" "adminuser"

5. Running the Application
Development Mode
To run the application in development mode (typically with hot-reloading and debugging features):

Start the server:
From the server directory:

npm start # Or 'npm run dev' if your package.json uses that script

Start the client (if separate):
From your client directory:

npm start # Or 'npm run dev'

Production Mode with PM2
PM2 is recommended for managing your Node.js applications in a production environment. It ensures your applications run continuously and can be easily monitored.

Navigate to the server directory:

cd server

Start the main server process:
This command starts your index.js as a PM2 process named tlh-server.

pm2 start index.js --name tlh-server

Start the worker process:
This command starts your orderWorker.js as a PM2 process named tlh-worker.

pm2 start orderWorker.js --name tlh-worker

6. PM2 Management Commands
Here are essential PM2 commands for managing your application in production:

List all running PM2 processes:

pm2 list

Stop specific PM2 instances:
To stop both the server and worker processes:

pm2 stop tlh-server tlh-worker

Restart specific PM2 instances:
To restart both the server and worker processes:

pm2 restart tlh-server tlh-worker

View logs for a specific PM2 instance:
To view real-time logs for the server:

pm2 logs tlh-server

To view real-time logs for the worker:

pm2 logs tlh-worker

Reload application after updates:
If you've pushed new code updates (e.g., via git pull), you can reload your applications without downtime (for most changes).

Stop the instances:

pm2 stop tlh-server tlh-worker

Pull the latest code:

git pull

Restart the instances:

pm2 start tlh-server tlh-worker

Note: For major dependency changes (package.json), you might need to run npm install in the server directory before restarting.

Delete specific PM2 instances:
To remove processes from PM2's list (they will stop if running):

pm2 delete tlh-server tlh-worker

This README provides a comprehensive guide to getting your Link Hangouts web application up and running. If you encounter any issues, please refer to the PM2 documentation or check your server logs for errors.











NEW FEATURES TO BE ADDED IN FUTURE UPDATE

Preminum members available to users only excluding organizers
- user should contain a new field
    - hasPremium: Boolean
    - premiummStatus: Fan, Mega Fan, Ultimate, blah blah blah or just one

- Home page header should contain a premium members field
    - Onclick should go to normal user sign up, but show subscription type, or just one subscription
    - user selects subscription, fill in sign up details, fill in card information (handled by paystack)
    - Card will be saved on user profile (User can manage cards now)
    - on payment successful, create user account, set them to premium, show them 'You're a premium member on the dashboard'

- Creating events, admin will have the option to set events to only premium members, and what type of premimum members or just all premiumm members

- Creating tickets admin will have the option to create tickets for premium, or selected premium memberships

- Creating coupon admin will have the option to create for selected premium memberships or all premium

- Premium members will be added to a different newsletter, mailing list, where admin can communicate to them
    - Also different mailing list can be created to communicate to certain premium memberships

- Also they'll be invited to join a whatsapp group, i'll look at how it can be automated, maybe a whatsapp bot that notifies admin whatsapp and show them a button that allows them send a message to the member, to join a whatsapp, group, 
    - This will be enabled for premium members that add their phone Number

