export const catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // forwarded to globalErrorHandler — nothing ever crashes the process
    }
  };
};

export default catchAsync;
