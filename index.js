const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Use Supabase Session Pooler (IPv4) connection string
const pool = new Pool({
  connectionString: "postgresql://postgres.ykqrfpbkxnnohffjdbdt:Chandan1@singh@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.urlencoded({ extended: true }));

// Serve a simple HTML form
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Insert Data</title>
      </head>
      <body style="font-family: Arial; margin: 40px;">
        <h2>Insert Data into Test Table</h2>
        <form action="/insert" method="POST">
          <label>Name:</label><br/>
          <input type="text" name="name" required/><br/><br/>
          <label>Phone:</label><br/>
          <input type="text" name="phone" required/><br/><br/>
          <button type="submit">Insert</button>
        </form>
      </body>
    </html>
  `);
});

// Insert data into Supabase Postgres
app.post("/insert", async (req, res) => {
  const { name, phone } = req.body;
  try {
    await pool.query("INSERT INTO test (name, phone) VALUES ($1, $2)", [name, phone]);
    res.send(`<p>✅ Data inserted successfully!</p><a href="/">Go back</a>`);
  } catch (err) {
    console.error(err);
    res.send(`<p>❌ Error inserting data: ${err.message}</p><a href="/">Go back</a>`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
