export const sendResponse = (res, { success = true, statusCode = 200, message = "", data = null, meta = null }) => {
  res.status(statusCode).json({
    success,
    statusCode,
    message,
    data,
    ...(meta && { meta }),
  });
};

export default sendResponse;
