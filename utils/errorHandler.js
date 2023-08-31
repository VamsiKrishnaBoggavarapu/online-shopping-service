export const catchError = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => next(err));

// export const catchError = function (fn) {
//   return function (req, res, next) {
//     fn(req, res, next).catch(next);
//   };
// };
