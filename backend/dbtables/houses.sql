Create Table: CREATE TABLE `houses` (
  `house_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `type` varchar(15) DEFAULT NULL,
  `promo` int(3) DEFAULT NULL,
  `room_count` int(11) DEFAULT NULL,
  `bathroom_count` int(11) DEFAULT NULL,
  `electricity` int(11) DEFAULT NULL,
  `land_area` int(11) DEFAULT NULL,
  `building_area` int(11) DEFAULT NULL,
  `certificate` varchar(255) DEFAULT NULL,
  `listing` varchar(4) DEFAULT NULL,
  `last_modified` date DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  PRIMARY KEY (`house_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `houses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
);
