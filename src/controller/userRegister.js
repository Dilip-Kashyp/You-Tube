const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler.js");
const apiError = require("../utils/apiErrors.js");
const User = require("../model/userModel.js");
const uploadCloudinary = require("../utils/cloudinary.js");
const apiResponse = require("../utils/apiResponse.js");

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ ValidateBeforeSave: false });
    return { refreshToken, accessToken };
  } catch (error) {
    console.log(error);
    throw new apiError(500, "something went wrong");
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;
  if (
    [username, fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All field required");
  }

  const alreadyUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (alreadyUser) {
    throw new apiError(409, "User exists with same email and user ");
  }

  const avatarLocalPath = req.files["avatar"]
    ? req.files["avatar"][0].path
    : null;
  const coverImageLocalPath = req.files["coverImage"]
    ? req.files["coverImage"][0].path
    : "";

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);

  const user = await User.create({
    fullname,
    email,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createUser) {
    throw new apiError(500, "Something happening wrong while creating user");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createUser, "User Registered Successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new apiError(400, "username or email is required!");
  }

  const foundUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!foundUser) {
    throw new apiError(400, "user not found with this username and email");
  }

  const validatedPassword = await foundUser.isPasswordCorrect(password);
  if (!validatedPassword) {
    throw new apiError(401, "password is incorrect!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    foundUser._id
  );

  const loggedIn = await User.findById(foundUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedIn,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "user logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const refreshTokenFormFE =
      req.cookies.refreshToken || req.body.Header.refreshToken;
    if (refreshTokenFormFE) {
      throw new apiError(401, "unauthorizes request");
    }

    const verifiedToken = jwt.verify(
      refreshTokenFormFE,
      process.env.REFRESH_TOKEN_SECRET
    );

    // if(!verifiedToken){
    //   throw new
    // }

    const user = await User.findById(verifiedToken?._id);

    if (!user) {
      throw new apiError(401, "invalid refresh token ");
    }

    if (verifiedToken !== user?.refreshToken) {
      throw new apiError(401, "refreshToken expried or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("access Token", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "new  Token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error?.message || "invalid refresh token");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  // get old and new password form req.body
  // get user  from req.user
  // user isPasswordCorrect for for check old password is valid
  // update the password

  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isValidPassword = await user.isPasswordCorrect(oldPassword);
  if (!isValidPassword) {
    new apiError(400, "Password is not correct");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new apiResponse(200, {}, "Password changed"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(apiResponse(200, req.user, "current user fetched"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!(fullName, email)) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "account details updated"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const updateCoverImage = req.file?.path;

  if (!updateCoverImage) {
    throw new apiError(400, "avatar file is missing");
  }
  const CoverImageUrl = await uploadCloudinary(updateCoverImage);
  try {
    if (!CoverImageUrl.url) {
      throw new apiError(400, "something want wrong while uploading");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: CoverImageUrl.url,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    return res
      .status(200)
      .json(new apiResponse(200, { user }, "avatar updated"));
  } catch (error) {
    console.log(error);
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarPath = req.file?.path;

  if (!avatarPath) {
    throw new apiError(400, "avatar file is missing");
  }
  const avatar = await uploadCloudinary(avatarPath);
  try {
    if (!avatar.url) {
      throw new apiError(400, "something want wrong while uploading");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    return res
      .status(200)
      .json(new apiResponse(200, { user }, "avatar updated"));
  } catch (error) {
    console.log(error);
  }
});

const getChannelProfile = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  if (userName) {
    throw new apiError(400, "username is missing");
  }

  const channal = User.aggregate([
    {
      $match: {
        username: userName?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: subscriptions,
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: subscriptions,
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed",
      },
    },
    {
      $addFields: {
        subCount: {
          $size: "$subscribers",
        },
        channelSubCount: {
          $size: "$subscribed",
        },

        isSubed: {
          $cond: {
            if: { $in: [req.user?._id, "subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subCount: 1,
        channelSubCount: 1,
        isSubed: 1,
        avatar: 1,
        coverImage: 1,
        timrstamps: 1,
      },
    },
  ]);
  if(!channal?.length()){
    throw new apiError(400, "channel does not exists")
  }

  res.status(200).
  json(new apiResponse(200, channal[0], "channel fetched"))
});

module.exports = {
  userRegister,
  userLogin,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateUserDetails,
  updateAvatar,
  updateCoverImage,
  getChannelProfile
};
