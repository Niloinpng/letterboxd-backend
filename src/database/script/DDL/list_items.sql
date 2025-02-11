CREATE TABLE `list_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `list_id` bigint NOT NULL,
  `media_id` bigint NOT NULL,
  `status` enum('PENDENTE','EM_ANDAMENTO','CONCLUÍDO') NOT NULL DEFAULT 'PENDENTE',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `list_item_unique` (`list_id`,`media_id`),
  KEY `idx_list_items_list` (`list_id`),
  KEY `idx_list_items_media` (`media_id`),
  CONSTRAINT `list_items_ibfk_1` FOREIGN KEY (`list_id`) REFERENCES `list` (`id`) ON DELETE CASCADE,
  CONSTRAINT `list_items_ibfk_2` FOREIGN KEY (`media_id`) REFERENCES `media` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci