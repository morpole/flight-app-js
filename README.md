# Dublin Airport Arrivals Tracker



This project fetches real-time flight arrival data for Dublin Airport (DUB) using the AviationStack API, stores it in a SQLite database, and generates a bar chart visualizing the number of flights by departure airport.



## Features

- Fetches flight data for arrivals at Dublin Airport (DUB) using the AviationStack API.

- Processes and logs flight details (flight number, departure airport, scheduled arrival).

- Stores flight data in a SQLite database (`flight_data.db`).

- Groups flights by departure airport and counts occurrences.

- Generates a bar chart visualization saved as `flight_chart.png`.



## Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)

- An [AviationStack API key](https://aviationstack.com/) (free tier available)



## Installation

1. Clone this repository:

   ```bash

   git clone https://github.com/morpole/flight-app-js.git

   cd dublin-airport-arrivals
   ```
1. Install dependencies:
```bash
npm install
```
2. Create a .env file in the root directory and add your AviationStack API key:
   
```bash
AVIATIONSTACK_API_KEY=your_api_key_here
```

## Usage

Run the script to fetch flight data, store it, and generate a chart:
```bash
node flight.js
```

 The script will:
+ Fetch up to 10 recent arrivals at Dublin Airport.
+ Log flight details to the console.
+ Save the data to flight_data.db.
+ Generate and save a bar chart as flight_chart.png.

#  Dependencies

+ axios - For making HTTP requests to the API.
+ dotenv - For loading environment variables.
+ sqlite3 - For database storage.
+ chartjs-node-canvas - For generating charts.

Install them using:
```bash
npm install axios dotenv sqlite3 chartjs-node-canvas
```
# Output

+ Console Output: Flight details and departure airport counts.
+ Database: flight_data.db containing flight records.
+ Chart: flight_chart.png, a bar chart of flights by departure airport.

# Example Chart


# Notes

+ The API request is limited to 10 results for demonstration purposes. Adjust the limit parameter in params to fetch more data (subject to API plan limits).
+ The free AviationStack API tier has usage limits; ensure your key is valid and within quota.
+ The chart uses a sky-blue color scheme and is saved as an 800x600 PNG.

# Troubleshooting

+ API Key Error: Ensure AVIATIONSTACK_API_KEY is correctly set in .env.
+ Request Failed: Check your internet connection or API status at AviationStack.
+ Chart Not Generated: Verify chartjs-node-canvas dependencies are installed correctly.
