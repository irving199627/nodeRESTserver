const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// =======================================
// ===== Mostrar todas los productos =====
// =======================================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: Usuarios y Categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productos
            })
        })
});

// =======================================
// ===== Mostrar un producto por  id =====
// =======================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: Usuarios y Categoria
    // paginado
    let id = req.params.id;
    Producto.findById(id, (err, producto) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!producto) {
                res.status(500).json({
                    ok: false,
                    err: {
                        message: 'No existe el ID'
                    }
                })
            }
            res.json({
                ok: true,
                producto
            })
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
});

// =======================================
// ===== buscar productos=====
// =======================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productos
            })
        })

});


// =======================================
// ===== Crear un producto =====
// =======================================
app.post('/productos', verificaToken, (req, res) => {
    // Grabar el usuario
    // grabar una categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripción: body.descripción,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

});

// =======================================
// ===== actualizar un producto =====
// =======================================
app.put('/productos/:id', verificaToken, (req, res) => {
    // Grabar el usuario
    // grabar una categoria
    let body = req.body;
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        });
    })

});

// =======================================
// ===== Borrar un producto =====
// =======================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    // actualizar disponible = false
    let id = req.params.id;

    let cambiarDisp = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiarDisp, { new: true }, (err, productoEliminado) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoEliminado) {
            res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe el ID'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoEliminado
        })
    });
});

module.exports = app;