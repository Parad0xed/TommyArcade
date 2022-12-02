drop database if exists TommysArcade;
create database TommysArcade;
use TommysArcade;

create table Users (
	id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    uname VARCHAR(50) NOT NULL UNIQUE,
    pwd VARCHAR(50) NOT NULL,
    chips INT(11) default 2000,
    chipsClaimed BOOLEAN default FALSE,
    claimTime DATETIME 
);

