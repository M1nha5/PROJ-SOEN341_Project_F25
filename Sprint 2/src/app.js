const express = require("express");
const cors = require("cors");
const eventsRouter = require("./routes/events");
const calendarRouter = require("./routes/calendar");
const ticketsRouter = require("./routes/tickets");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/events", eventsRouter);
app.use("/calendar", calendarRouter);
app.use("/tickets", ticketsRouter);

// Root simple message
app.get("/", (req, res) => {
  res.json({ message: "Campus Events Backend (Student Event Experience) is running." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
