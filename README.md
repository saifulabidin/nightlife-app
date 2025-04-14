# Nightlife Coordination App

A full-stack JavaScript application that helps users coordinate their nightlife activities. Users can search for bars in their area, indicate which bars they plan to visit, and see who else is going.

[🔗 Live Demo]([https://weather-checker-eu.netlify.app/](https://nightlife-app-production.up.railway.app/))

## Features

- Search bars in any area using Foursquare API
- User authentication system
- RSVP to bars you plan to visit
- View how many people are going to each bar
- Persistent search results across login/logout

## Technologies Used

- Node.js & Express
- MongoDB & Mongoose
- Express Session for authentication
- Tailwind CSS for styling
- Foursquare Places API for venue data

## Prerequisites

- Node.js (v14 or higher)
- MongoDB account
- Foursquare API key

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/saifulabidin/nightlife-app.git
   cd nightlife-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the root directory with the following variables:
   ```
   FOURSQUARE_API_KEY=your_foursquare_api_key
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Railway

1. Create a Railway account at [railway.app](https://railway.app)

2. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

3. Login to Railway:
   ```bash
   railway login
   ```

4. Initialize Railway project:
   ```bash
   railway init
   ```

5. Add environment variables:
   - Go to your project dashboard on Railway
   - Navigate to Variables tab
   - Add the following variables:
     - FOURSQUARE_API_KEY
     - NODE_ENV=production
     - MONGODB_URI
     - SESSION_SECRET
     - BASE_URL (your Railway app URL)

6. Deploy your application:
   ```bash
   railway up
   ```

7. Set up auto-deployments:
   - Connect your GitHub repository to Railway
   - Enable automatic deployments for your main/master branch

## Environment Variables

- `FOURSQUARE_API_KEY`: Your Foursquare API key
- `PORT`: Port number for the server (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `MONGODB_URI`: MongoDB connection string
- `SESSION_SECRET`: Secret for session management
- `BASE_URL`: Application base URL

## API Endpoints

- `GET /api/venues/search`: Search for bars in a location
- `GET /api/bars/:barId/attendees`: Get users attending a bar
- `POST /api/bars/:barId/attend`: RSVP to a bar
- `DELETE /api/bars/:barId/attend`: Remove RSVP from a bar

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
