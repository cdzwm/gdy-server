mysql -uroot -p <<END
create database gdydb;
use gdydb;
create table player(id int, name text, nickname text);
END
