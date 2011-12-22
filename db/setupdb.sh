mysql -uroot -p <<END

-- create database gdy
drop database if exists gdy;
create database if not exists gdy; 

-- switch database gdy
use gdy;

-- create table player
create table player(
	id int, 
	name text, 
	nickname text,
	description text,
	password text,
	sex text,
	money int,
	lastLoginTime datetime,
	lastLogoutTime datetime,
	loginTimes int,
	level int,
	blocked int
);
create unique index idx_id_on_player on player(id);

-- grant
grant all on *.* to gdy@localhost IDENTIFIED BY 'gdypwd';
grant all on *.* to gdy@133.109.24.252;
grant all on *.* to gdy@127.0.0.1;

-- insert into player data
insert into player values(
1, 'player1', 'player1', '', 'password', 'M', 1000, null, null, 1, 1, 0
);
END
