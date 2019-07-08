CREATE TABLE IF NOT EXISTS book (
   id varchar(36) PRIMARY KEY,
   issue_date date ,
   title varchar(50),
   author VARCHAR(50) NOT NULL,
   description VARCHAR(255),
   image VARCHAR(36) DEFAULT '00000000-0000-0000-0000-000000000000'
);

CREATE INDEX book_title ON book(title);
CREATE INDEX book_author ON book(author);
