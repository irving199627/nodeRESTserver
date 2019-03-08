const jwt = require('jsonwebtoken');

// =================
// Verifica Token
// =================

let verificaToken = (req, res, next) =>  {
    let token = req.get('token'); //nombre del header

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

// =================
// Verifica ADMIN_ROLE
// =================
let verificaAdming_role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        });
    }
}


module.exports = {
    verificaToken,
    verificaAdming_role
};