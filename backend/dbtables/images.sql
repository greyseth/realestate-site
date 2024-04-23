Create Table: CREATE TABLE `images` (
  `img_id` int(11) NOT NULL AUTO_INCREMENT,
  `house_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `thumbnail` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`img_id`),
  KEY `house_id` (`house_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`house_id`) REFERENCES `houses` (`house_id`) ON DELETE CASCADE
);
