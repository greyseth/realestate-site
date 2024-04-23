Create Table: CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(12) DEFAULT NULL,
  `email` varchar(55) DEFAULT NULL,
  `phone` varchar(12) DEFAULT NULL,
  `login_token` varchar(10) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
);
