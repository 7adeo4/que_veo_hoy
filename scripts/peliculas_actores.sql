create table `actor_pelicula`(
    `id` int(10) not null auto_increment,
    `actor_id` int(10),
    `pelicula_id`int(10),
    primary key(`id`)
);

alter table actor_pelicula add foreign key (actor_id) references actor(id);

alter table actor_pelicula add foreign key (pelicula_id) references pelicula(id);