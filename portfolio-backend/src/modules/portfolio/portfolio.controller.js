import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { portfolioService } from "./portfolio.service.js";

const getPublicPortfolio = catchAsync(async (req, res) => {
  const data = await portfolioService.getPublicPortfolio(req.query);
  sendResponse(res, { statusCode: 200, message: "Portfolio retrieved", data });
});

const getAdminPortfolio = catchAsync(async (req, res) => {
  const data = await portfolioService.getAdminPortfolio(req.query);
  sendResponse(res, { statusCode: 200, message: "Admin portfolio retrieved", data });
});

export const portfolioController = {
  getPublicPortfolio,
  getAdminPortfolio,
};

export default portfolioController;
