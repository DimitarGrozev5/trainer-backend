const express = require("express");

const HttpError = require("./models/HttpError");
const authRouter = require("./routers/authRoutes");
const workoutsRoutes = require("./routers/workoutsRoutes");
const { errorHandler } = require("./controllers/errorHandler");

const app = express();

// Set up cors headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// Set up form data parsing
app.use(express.json({ extended: false }));

// Setup routes
app.use("/api/users", authRouter); // Auth routes
app.use("/api/users/:userId", workoutsRoutes); // Workouts Routes

// 404 route
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route!", 404));
});

// Global error handler
app.use(errorHandler);

app.listen(process.env.PORT, async () => {
  // Delete expired JWTs on startup
  // try {
  //   await deleteExpiredJWTs();
  // } catch (err) {
  //   console.log("Could not delete expired blacklisted JWTs: " + err);
  // }

  console.log(`Server is running on port ${process.env.PORT}`);
});
