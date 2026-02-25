const parseValidationErr = (err) => {
  const errors = {};
  if (err.inner) {
    err.inner.forEach((e) => {
      if (!errors[e.path]) errors[e.path] = e.message;
    });
  } else if (err.path) {
    errors[err.path] = err.message;
  }
  return errors;
};

module.exports = parseValidationErr;