mysql -uroot -p <<END
/*create database gdydb;*/
use gdydb;
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
END
