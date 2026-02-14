const { pool } = require("../db/connect");

const handleResponse = (
  res,
  status,
  { success, message, error, details, data, arrayName, pagination }
) => {
  if (success) {
    const responseBody = {
      success: true,
      message: message || "Operação realizada com sucesso.",
      details: details || null,
    };

    if (pagination !== undefined) {
      responseBody.pagination = pagination;
    }

    if (data !== undefined && arrayName) {
      responseBody[arrayName] = Array.isArray(data) ? data : [data];
    }

    return res.status(status || 200).json(responseBody);
  } else {
    const responseBody = {
      success: false,
      error: error || "Ocorreu um erro na operação.",
      details: details || null,
    };
    return res.status(status || 500).json(responseBody);
  }
};

const queryAsync = (query, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  queryAsync,
  handleResponse,
};

