// import crypto from "crypto";

// const guestMiddleware = (req, res, next) => {

//   // Check if this browser already has a guestId
//   let guestId = req.cookies.guestId;

//   // If there is no guestId, create one
//   if (!guestId) {
//     guestId = crypto.randomUUID();

//     // Save the guestId inside the browser's cookie
//     res.cookie("guestId", guestId, {
//       httpOnly: true,
//       maxAge: 1000 * 60 * 60 * 24 * 30
//     });
//   }

//   // Make the guestId available to your controllers
//   req.guestId = guestId;
//   next();
// };

// export default guestMiddleware;


import crypto from "crypto";

const guestMiddleware = (req, res, next) => {
  // Check if the browser already has a guestId cookie.
  // The ?. prevents an error if req.cookies is undefined.
  let guestId = req.cookies?.guestId;

  // If the browser does not have a guestId, generate a new one.
  if (!guestId) {
    // Generate a unique UUID for this guest.
    guestId = crypto.randomUUID();
    // Send the guestId to the browser and save it as a cookie.
    res.cookie("guestId", guestId, {
      // Prevent JavaScript running in the browser from accessing this cookie.
      httpOnly: true,

      // Allow the cookie only over HTTPS in production.
      // In development, secure will be false.
      secure: process.env.NODE_ENV === "production",
      // Helps protect against CSRF attacks by controlling cross-site cookie requests.
      sameSite: "lax",
      // Set the cookie's lifetime to 30 days (in milliseconds).
      maxAge: 1000 * 60 * 60 * 24 * 30,
      // Make the cookie available across all routes on your website.
      path: "/"
    });
  }
  req.guestId = guestId;
  next();
};

export default guestMiddleware;