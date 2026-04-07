// scr/red/respuestas.js
function success(req, res, mensaje, status = 200) {
    res.status(status).json({
        error: false,
        status,
        body: mensaje
    });
}

function error(req, res, mensaje, status = 500) {
    res.status(status).json({
        error: true,
        status,
        body: mensaje
    });
}

module.exports = {
    success,
    error
};


