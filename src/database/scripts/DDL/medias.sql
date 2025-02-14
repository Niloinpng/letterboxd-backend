CREATE TABLE `media` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` enum('FILME','SERIE','DOCUMENTÁRIO','LIVRO') NOT NULL,
  `description` text NOT NULL,
  `release_date` date DEFAULT NULL,
  `cover_url` longblob,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_media_type` (`type`),
  KEY `idx_media_title` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci