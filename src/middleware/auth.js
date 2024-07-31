const apiError = require("../utils/apiErrors.js");
const asyncHandler = require("../utils/asyncHandler.js");
const  User  = require("../model/userModel.js");
const jwt = require("jsonwebtoken");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      apiError(401, "unauthorized request");
    }

    const validateToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(validateToken?._id).select(
      "-password -refreshToken"
    );

    req.user = user;

    next();
  } catch (error) {
    throw new apiError(401, error.message || "invalid access");
  }
});

module.exports = { verifyJWT };
