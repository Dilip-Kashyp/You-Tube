const asyncHandler = require('../utils/asyncHandler.js');

const userRegister = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "hello"
    });
});

module.exports = { userRegister };