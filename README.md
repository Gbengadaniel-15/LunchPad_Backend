# Launchpad Backend

## How to get started

1. Clone the project
   git clone https://github.com/YOURNAME/launchpad-backend.git

2. Go into the folder
   cd launchpad-backend

3. Install packages
   npm install

4. Create your .env file
   copy .env.example and fill in your own values

5. Start the server
   npm run dev

## Branch Rules
- Never push to main directly
- Always work on your feature branch
- Create pull request to develop when done

## API Response Format
Every endpoint must return:
{
  "success": true/false,
  "message": "what happened",
  "data": {} or null
}