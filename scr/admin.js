const express = require('express');
const router = express.Router();

//ver si cookie es correcta o no 
function verificarMiddleware(req, res, next) {
    const token = req.cookies.mi_token_pos;

    //if (token === 'USUARIO_VALIDO_ABC') {
       // next(); //cuando cookie es correcta   
  //  } else {
       res.status(403).send('Sin acceso. <a href="/login">Log in</a>');
   // }
}

router.get('/panel', verificarMiddleware, (req, res) => {
    res.send('<h1>Bienvenido al Panel de Control de Kitsune</h1> <p>Solo tú puedes ver esto.</p> <a href="/logout">Salir</a>');
});
module.exports = router;
