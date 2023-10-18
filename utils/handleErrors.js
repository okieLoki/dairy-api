const handleErrors = (error, res) => {

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    const err = error.errors || null;

    return res.status(statusCode).json({
        status: false,
        message: message,
        errors: err
    });

};

module.exports = handleErrors;