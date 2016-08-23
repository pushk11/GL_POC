DROP DATABASE IF EXISTS memo;
CREATE DATABASE memo CHARACTER SET utf8 COLLATE utf8_general_ci;
DROP TABLE IF EXISTS memo.idea;
CREATE TABLE memo.idea (
	id int not null auto_increment primary key,
    title varchar(500),
    body text,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO memo.idea(title,body)
VALUES('Idea 1','Idea description')
,('Idea 2','Idea Description 2')
,('Idea 3','Idea Description 3')
,('Idea 4','Idea Description 4')
,('Idea 5','Idea Description 5')
,('Idea 6','Idea Description 6')
,('Idea 7','Idea Description 7')
,('Idea 8','Idea Description 8')
,('Idea 9','Idea Description 9')
,('Idea 10','Idea Description 10');

select * from memo.idea order by created_date desc;