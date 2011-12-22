mysql -uroot -p <<END
if exists(select * from mysql.user where user='gdy')
drop user gdy

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
	sex text,
	money int,
	lastLoginTime datetime,
	lastLogoutTime datetime,
	loginTimes int,
	level int,
	blocked int
);
create unique index idx_id_on_player on player(id);

-- create user gdy;
create user gdy identified by "gdypwd1!";
END
