-- make sure the websiteuser account is set up and has the correct privileges
CREATE USER IF NOT EXISTS websiteuser IDENTIFIED BY 'websitepassword';
GRANT INSERT, SELECT, UPDATE, DELETE ON website.* TO websiteuser;
DROP TABLE IF EXISTS accounts;
CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT,
  user VARCHAR(25) NOT NULL,
  pass VARCHAR(70) NOT NULL,
  auth VARCHAR(70) NOT NULL DEFAULT "student",
  PRIMARY KEY(id)
);

DROP TABLE IF EXISTS contents;

CREATE TABLE IF NOT EXISTS contents (
  id INT AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  content VARCHAR(600) NOT NULL,
  author INT NOT NULL,
  image LONGBLOB,
  submitDate datetime DEFAULT CURRENT_TIMESTAMP,
  question VARCHAR(300),
  answer1 VARCHAR(150),
  answer2 VARCHAR(150),
  answer3 VARCHAR(150),
  answer4 VARCHAR(150),
  answer INT,
  questionImage LONGBLOB,
  PRIMARY KEY(id),
  FOREIGN KEY(author) References accounts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


DROP TABLE IF EXISTS answers;

CREATE TABLE IF NOT EXISTS answers (
	contentID INT AUTO_INCREMENT,
	accountID INT NOT NULL, 
	answer VARCHAR(1) NOT NULL,
  PRIMARY KEY(contentID,accountID),
  FOREIGN KEY(accountID) References accounts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY(contentID) References contents(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS accesses (
	accountID INT NOT NULL,
	contentID INT NOT NULL, 
	accessed INT NOT NULL,
  PRIMARY KEY(accountID, contentID),
  FOREIGN KEY(accountID) References accounts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY(contentID) References contents(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO accounts(user, pass, auth)
	VALUES("doeje", "$2b$10$gL33obKAFUT5DK3pEbh72OIHztsWBniBBh.PdeKOrF1yr5KFAsdZO","teacher");