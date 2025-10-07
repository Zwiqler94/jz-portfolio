/**
 * Simple Node.js app using 'pg' to connect to PostgreSQL.
 * Run: npm install pg
 */

const { Client } = require("pg");

// Connection config (replace with your actual credentials)
const client = new Client({
  connectionString:
    "postgresql://jake:en-3m8yyx_carYc7XaihjpMVCJFat8WFq6NHN_E8xmyzwtBAybwEuUT%40k%21hhpCbiXnpkeEUCLYkV8@ep-late-bush-aeo42bfj-pooler.c-2.us-east-2.aws.neon.tech/jz-local?sslmode=require&channel_binding=require",
});

async function main() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Example query
    const res = await client.query("SELECT NOW()");
    console.log("Server time:", res.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
  } finally {
    await client.end();
    console.log("Connection closed");
  }
}

main();
