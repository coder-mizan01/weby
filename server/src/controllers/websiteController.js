import { SuccessResponse } from "../helpers/response.js";

import WebsiteModel from "../models/websiteModel.js";

export const postWebsite = async (req, res, next) => {
  try {
    const { websiteName, professionalTitle, templateId } = req.body;

    const userId = req.user._id;

    //check if a website already exist
    const existingWebsite = await WebsiteModel.findOne({ userId, templateId });

    if (existingWebsite) {
      return SuccessResponse(res, {
        statusCode: 200,
        message: "Website already exist",
        payload: existingWebsite,
      });
    }

    // Create new website with default values
    const newWebsite = new WebsiteModel({
      websiteName: websiteName || "Default Website Name",
      professionalTitle: professionalTitle || "Default Professional Title",
      templateId,
      userId,
    });

    await newWebsite.save();

    return SuccessResponse(res, {
      statusCode: 200,
      message: "successfully post data",
      payload: newWebsite,
    });
  } catch (error) {
    next(error);
  }
};



export const getSingleWebsite = async (req, res, next) => {
  try {
    const { templateId } = req.query;

    const userId = req.user._id;

    const singleWebsite = await WebsiteModel.find({ templateId, userId }).sort({
      createdAt: -1,
    });

    return SuccessResponse(res, {
      statusCode: 200,
      message: "get data successful",
      payload: { singleWebsite },
    });
  } catch (error) {
    next(error);
  }
};

export const getWebsites = async (req, res, next) => {
  try {
    const websites = await WebsiteModel.find({});

    return SuccessResponse(res, {
      statusCode: 200,
      message: "all websites",
      payload: { websites },
    });
  } catch (error) {
    next(error);
  }
};


export const updateWebsite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { websiteName, professionalTitle, templateId } = req.body;
    const userId = req.user._id;

    // Find and update the document
    const updatedWebsite = await WebsiteModel.findOneAndUpdate(
      { _id: id, userId, templateId },
      { websiteName, professionalTitle, templateId },
      { new: true }
    );

    // Check if document exists
    if (!updatedWebsite) {
      return SuccessResponse(res, {
        statusCode: 404,
        message: "website not found or unauthorized",
      });
    }

    return SuccessResponse(res, {
      statusCode: 200,
      message: "Website data updated successfully",
      payload: { updatedWebsite },
    });
  } catch (error) {
    next(error);
  }
};



export const deleteWebsite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const deletedWebsite = await WebsiteModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedWebsite) {
      return SuccessResponse(res, {
        statusCode: 404,
        message: "websiteName not found or unauthorized",
      });
    }

    return SuccessResponse(res, {
      statusCode: 200,
      message: "delete websiteName successfully",
      payload: { deletedWebsite },
    });
  } catch (error) {
    next(error);
  }
};