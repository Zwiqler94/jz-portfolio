/**
 * Simple Node.js app using 'pg' to connect to PostgreSQL.
 * Run: npm install pg
 */

const { Client } = require("pg");

// Connection config (replace with your actual credentials)
const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://username:password@localhost:5432/mydatabase",
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
