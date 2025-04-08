const axios = require('axios');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

// Load environment variables from .env file
dotenv.config();

// Get the API key from environment variables
const apiKey = process.env.AVIATIONSTACK_API_KEY;
if (!apiKey) {
    console.error("Error: AVIATIONSTACK_API_KEY not found in .env file");
    process.exit(1);
}

// API endpoint for flights
const url = "http://api.aviationstack.com/v1/flights";

// Parameters: flights arriving at DUB
const params = {
    access_key: apiKey,
    arr_iata: "DUB",  // Arrivals at Dublin Airport
    limit: 10         // Limit to 10 results
};

// Fetch flight data
async function fetchFlightData() {
    try {
        const response = await axios.get(url, { params });
        const data = response.data;

        // Check if the request was successful
        if (response.status === 200) {
            console.log("Success! Here's the flight data:");
            data.data.forEach(flight => {
                console.log(`Flight ${flight.flight.iata} from ${flight.departure.iata}: ` +
                            `Scheduled Arrival: ${flight.arrival.scheduled}`);
            });

            // Process data
            const flights = data.data;
            const processedData = flights.map(flight => ({
                flight_number: flight.flight.iata,
                departure_airport: flight.departure.iata,
                arrival_time: flight.arrival.scheduled
            }));

            // Group by departure airport
            const departureCounts = processedData.reduce((acc, flight) => {
                acc[flight.departure_airport] = (acc[flight.departure_airport] || 0) + 1;
                return acc;
            }, {});
            const departureArray = Object.entries(departureCounts).map(([airport, count]) => ({ departure_airport: airport, flight_count: count }));
            console.log("Departure Counts:", departureArray);

            // Save to SQLite database
            const db = new sqlite3.Database('flight_data.db');
            db.serialize(() => {
                db.run("CREATE TABLE IF NOT EXISTS flights (flight_number TEXT, departure_airport TEXT, arrival_time TEXT)");
                const stmt = db.prepare("INSERT INTO flights VALUES (?, ?, ?)");
                processedData.forEach(flight => {
                    stmt.run(flight.flight_number, flight.departure_airport, flight.arrival_time);
                });
                stmt.finalize();

                // Query with SQL
                db.all("SELECT departure_airport, COUNT(*) as flight_count FROM flights GROUP BY departure_airport", (err, rows) => {
                    if (err) {
                        console.error("SQL Error:", err);
                    } else {
                        console.log("SQL Query Result:");
                        console.table(rows);
                    }
                });
            });
            db.close();

            // Create bar chart
            const width = 800;
            const height = 600;
            const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

            const configuration = {
                type: 'bar',
                data: {
                    labels: departureArray.map(d => d.departure_airport),
                    datasets: [{
                        label: 'Number of Flights',
                        data: departureArray.map(d => d.flight_count),
                        backgroundColor: 'rgba(135, 206, 235, 0.8)', // Skyblue
                        borderColor: 'black',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: { display: true, text: 'Departure Airport' },
                            ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 }
                        },
                        y: {
                            title: { display: true, text: 'Number of Flights' },
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: { display: true, text: 'Flights Arriving at DUB by Departure Airport' }
                    }
                }
            };

            // Render and save the chart
            (async () => {
                const image = await chartJSNodeCanvas.renderToBuffer(configuration);
                require('fs').writeFileSync('flight_chart.png', image);
                console.log("Plot saved to flight_chart.png");
            })();

        } else {
            console.error(`Error: ${response.status}, ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.error("Request failed:", error.message);
    }
}

// Run the function
fetchFlightData();