USE que_veo_hoy;
create table pelicula(
id int not null auto_increment,
titulo varchar(100),
duracion int(5),
director varchar(400),
anio int(5),
fecha_lanzamiento date,
puntuacion int(2),
poster varchar(300),
trama varchar(700),
primary key (id)
);

alter table pelicula add column genero_id int;
alter table pelicula add foreign key (genero_id) references genero(id);