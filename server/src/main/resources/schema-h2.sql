DROP TABLE IF EXISTS user;

CREATE TABLE user (
  user_id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  sex VARCHAR(64) NOT NULL,
  active int(11) DEFAULT NULL,
  email varchar(255) UNIQUE NOT NULL,
  password varchar(255),
  PRIMARY KEY (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `role`;

CREATE TABLE `role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) DEFAULT NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `user_role`;

CREATE TABLE `user_role` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `photo`;

CREATE TABLE `photo` (
 `photo_id` int(11) NOT NULL AUTO_INCREMENT,
 `name` varchar (255),
 `body` blob,
 PRIMARY KEY (`photo_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `user_photo`;

CREATE TABLE `user_photo` (
 `user_id` int(11) NOT NULL,
 `photo_id` int(11) NOT NULL,
 PRIMARY KEY (`user_id`,`photo_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `book`;

CREATE TABLE `book` (
`book_id` int(11) NOT NULL,
`author` varchar (255),
`title` varchar (255),
`price` float (10),
PRIMARY KEY (`book_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `book_photo`;

CREATE TABLE `book_photo` (
`book_id` int(11) NOT NULL,
`photo_id` int(11) NOT NULL,
PRIMARY KEY (`book_id`,`photo_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
`order_id` int(11) NOT NULL AUTO_INCREMENT,
`unique_id` BIGINT (15) NOT NULL,
`user_id` int(11) NOT NULL,
`book_id` int(11) NOT NULL,
`amount` int(11) NOT NULL,
`date` timestamp NOT NULL,
PRIMARY KEY (`order_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- DROP TABLE IF EXISTS `user_order`;
--
-- CREATE TABLE `user_order` (
-- `order_id` int(11) NOT NULL,
-- `user_id` int(11) NOT NULL,
-- PRIMARY KEY (`order_id`, `user_id`),
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `catalog`;

CREATE TABLE `catalog` (
`category_id` int(11) NOT NULL AUTO_INCREMENT,
`category_name` varchar (255),
PRIMARY KEY (`category_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `book_catalog`;

CREATE TABLE `book_catalog` (
`book_id` int(11) NOT NULL,
`category_id` int(11) NOT NULL,
PRIMARY KEY (`book_id`,`category_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8;