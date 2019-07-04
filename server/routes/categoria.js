const express = require('express');

let { verificaToken, verificaAdming_role } = require('../middlewares/autenticacion');

let app = express();
const _ = require('underscore')
let Categoria = require('../models/categoria');

// =======================================
// ===== Mostrar todas las categorias=====
// =======================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});

// =======================================
// ===== Mostrar una categoria por id=====
// =======================================
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se encuentró una categoría con ese id'
                }
            });
        }
        res.json({
            ok: true,
            categoria
        });
    });
});

// =======================================
// ====== crear una nueva categoria ======
// =======================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        })
        // regresa la nueva categoria
        //  req.usuario._id
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// =======================================
// ====== actualizar una categoria ======
// =======================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaActualizada) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No se encuentró una categoría con ese id'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaActualizada
        })
    })
});

// =======================================
// ======= Eliminar una categoria =======
// =======================================
app.delete('/categoria/:id', [verificaToken, verificaAdming_role], (req, res) => {
    // solo un administrador puede borrar categorias
    // pedit token
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaEliminada) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaEliminada
        });
    });
});

module.exports = app;