Create Table: CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) DEFAULT NULL,
  `tag` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tag_id`),
  KEY `house_id` (`house_id`),
  CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `houses` (`house_id`)
);
