const conex = require('../lib/conexionbd');

function mostrarpelis(req, res) {
    let anio = req.query.anio;
    let titulo = req.query.titulo;
    let genero = req.query.genero;
    let columna_orden = req.query.columna_orden;
    let tipo_orden = req.query.tipo_orden;
    let pagina = Number(req.query.pagina);
    let cantidad = Number(req.query.cantidad);
    let paginacion = (pagina - 1) * cantidad;

    let sql = "SELECT * FROM pelicula";
    let where = "";

    if (titulo) {
        where = " titulo like '%" + titulo + "%'";
    }
    if (genero) {
        if (titulo) {
            where = where + " and genero_id = " + genero;
        }
        where = " genero_id = " + genero;
    }
    if (anio) {
        if (titulo || genero) {
            where = where + " AND ";
        }

        where = where + "anio = " + anio;
    }
    if (where) {
        sql = sql + " where " + where;
    }
    sql = sql + " order by " + columna_orden + " " + tipo_orden;

    conex.query(sql, (error, resultado, fields) => {
        if (error) {
            console.log("hubo un error en la consulta ", error.message);
            return res.status(404).send("Hubo un error");
        };
        if (resultado.length == 0) {
            console.log("No se encontro ninguna pelicula con los filtros propuestos")
            return res.status(404).send("No se encontro ninguna pelicula con los filtros propuestos");
        }
        total = resultado.length;
        if (cantidad) {
            sql += " limit " + cantidad + " offset " + paginacion;
        }
        conex.query(sql, function (error, respuesta, fields) {
            if (error) {
                console.log("hubo un error en la consulta ", error.message);
                return res.status(404).send("hubo un error en la consulta");
            }
            else {
                var response = {
                    'peliculas': respuesta,
                    'total': total
                };
            }
            res.send(response);
        })
    });
};

function buscarGenero(req, res) {
    let sql = "select * from genero";
    conex.query(sql, (error, respuesta, fields) => {
        if (error) {
            console.log("hubo un error en la consulta", error.message);
            return res.status(404).send("hubo un error");
        };
        let response = {
            'generos': respuesta
        };
        res.send(response);
    });
};

function obtenerPelicula(req, res) {

    let id = req.params.id;
    //Consulta pelicula y genero
    let sql = "SELECT * FROM pelicula JOIN genero ON genero_id = genero.id WHERE pelicula.id = " + id;
    conex.query(sql, (error, resultado) => {
        if (error) {
            return res.status(404).send("Hubo un error en la consulta");
        }
        //Consulta actores
        sql = "SELECT * FROM actor_pelicula JOIN actor ON actor_id = actor.id WHERE pelicula_id = " + id;
        conex.query(sql, (error, resultadoActores) => {
            if (error) {
                return res.status(404).send("Hubo un error en la consulta");
            };
            let response = {
                'pelicula': resultado[0],
                'genero': resultado[0].nombre,
                'actores': resultadoActores
            };
            res.send(response);
        });
    });
};

function recomendarPeli(req, res) {
    let genero = req.query.genero;
    let anio_inicio = req.query.anio_inicio;
    let anio_fin = req.query.anio_fin;
    let puntuacion = req.query.puntuacion;
    let sql = 'SELECT pelicula.id, pelicula.poster, pelicula.trama, pelicula.titulo, genero.nombre FROM pelicula INNER JOIN genero ON pelicula.genero_id = genero.id';
    let where ="";
    if (genero) {
        where += `where g.nombre = ${genero}`;
    }

    if (anio_inicio && genero) {
        where += ` and p.anio between '${anio_inicio}' and '${anio_fin}`;
        }

    if (puntuacion){ 
    if(genero || anio_fin) {
        where+=` and p.puntuacion= '${puntuacion}`;
    }else{
        where += ` where p.puntuacion= '${puntuacion}`;
    }
}
    conex.query(sql, function (error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta ", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        } else {
            let response = {
                'peliculas': resultado
            };
            res.send(response);
        }
    })
};


module.exports = {
    mostrarpelis,
    buscarGenero,
    obtenerPelicula,
    recomendarPeli
}

