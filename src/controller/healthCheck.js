const HealthCheck = require("../model/healthCheck.js"); 
const apiError = require("../utils/apiErrors.js");
const apiResponse = require("../utils/apiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const healthCheck = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  try {
    const healthCheckData = await HealthCheck.findOneAndUpdate(
      { event: "healthCheck" },
      { event: "healthCheck" },
      {
        new: true,
        upsert: true,
        runValidators: true, 
      }
    );
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const isUp = healthCheckData !== null;
    if (isUp) {
      return res.status(200).json(
        new apiResponse({
          event: healthCheckData.event,
          timestamp: healthCheckData.timestamp,
          DBresponseTime: `${responseTime}ms`,
        })
      );
    } else {
      throw new apiError(502, "Something went wrong");
    }
  } catch (error) {
    console.log("error in DB", error);
    throw new apiError(502, "Something went wrong");
  }
});

module.exports = healthCheck;
