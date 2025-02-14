comment-- User table
CREATE TABLE `User` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `bio` TEXT NOT NULL,
    `profile_picture` LONGBLOB NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_username_unique` (`username`),
    UNIQUE KEY `user_email_unique` (`email`)
);

CREATE INDEX idx_user_username ON `User`(`username`);
CREATE INDEX idx_user_email ON `User`(`email`);

-- Media table
CREATE TABLE `Media` (
    `id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `type` ENUM('FILME', 'SERIE', 'DOCUMENTÁRIO', 'LIVRO') NOT NULL,
    `description` TEXT NOT NULL,
    `release_date` DATE NOT NULL,
    `cover_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`)
);

CREATE INDEX idx_media_type ON `Media`(`type`);
CREATE INDEX idx_media_title ON `Media`(`title`);

-- Tag table
CREATE TABLE `Tag` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tag_name_unique` (`name`)
);

CREATE INDEX idx_tag_name ON `Tag`(`name`);

-- Media_Tags table
CREATE TABLE `Media_Tags` (
    `id` BIGINT NOT NULL,
    `media_id` BIGINT NOT NULL,
    `tag_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `media_tag_unique` (`media_id`, `tag_id`),
    FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `Tag`(`id`) ON DELETE CASCADE
);

-- Review table
CREATE TABLE `Review` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `media_id` BIGINT NOT NULL,
    `rating` DECIMAL(8, 2) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE CASCADE,
    CONSTRAINT `rating_range` CHECK (`rating` >= 0 AND `rating` <= 5)
);

CREATE INDEX idx_review_user ON `Review`(`user_id`);
CREATE INDEX idx_review_media ON `Review`(`media_id`);
CREATE INDEX idx_review_rating ON `Review`(`rating`);

-- Comment table
CREATE TABLE `Comment` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `review_id` BIGINT NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`review_id`) REFERENCES `Review`(`id`) ON DELETE CASCADE
);

CREATE INDEX idx_comment_user ON `Comment`(`user_id`);
CREATE INDEX idx_comment_review ON `Comment`(`review_id`);

-- Like table
CREATE TABLE `Like` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `review_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_review_unique` (`user_id`, `review_id`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`review_id`) REFERENCES `Review`(`id`) ON DELETE CASCADE
);

CREATE INDEX idx_like_user ON `Like`(`user_id`);
CREATE INDEX idx_like_review ON `Like`(`review_id`);

-- Follow table
CREATE TABLE `Follow` (
    `id` BIGINT NOT NULL,
    `follower_id` BIGINT NOT NULL,
    `followed_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `follower_followed_unique` (`follower_id`, `followed_id`),
    FOREIGN KEY (`follower_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`followed_id`) REFERENCES `User`(`id`) ON DELETE CASCADE,
    CONSTRAINT `prevent_self_follow` CHECK (`follower_id` != `followed_id`)
);

CREATE INDEX idx_follow_follower ON `Follow`(`follower_id`);
CREATE INDEX idx_follow_followed ON `Follow`(`followed_id`);

-- List table
CREATE TABLE `List` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `deleted_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE
);

CREATE INDEX idx_list_user ON `List`(`user_id`);

-- List_Items table
CREATE TABLE `List_Items` (
    `id` BIGINT NOT NULL,
    `list_id` BIGINT NOT NULL,
    `media_id` BIGINT NOT NULL,
    `status` ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUÍDO') NOT NULL DEFAULT 'PENDENTE',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `list_item_unique` (`list_id`, `media_id`),
    FOREIGN KEY (`list_id`) REFERENCES `List`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE CASCADE
);

CREATE INDEX idx_list_items_list ON `List_Items`(`list_id`);
CREATE INDEX idx_list_items_media ON `List_Items`(`media_id`);

-- Tabela para configurações do usuário
CREATE TABLE `user_settings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `private_profile` boolean NOT NULL DEFAULT false,
  `notifications_enabled` boolean NOT NULL DEFAULT true,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
);

-- Tabela Collection
CREATE TABLE `Collection` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `collection_name_unique` (`name`)
);

CREATE INDEX idx_collection_name ON `Collection`(`name`);

-- Tabela Collection_Media (Relacionamento muitos-para-muitos entre Collection e Media)
CREATE TABLE `Collection_Media` (
    `id` BIGINT NOT NULL,
    `collection_id` BIGINT NOT NULL,
    `media_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `collection_media_unique` (`collection_id`, `media_id`),
    FOREIGN KEY (`collection_id`) REFERENCES `Collection`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`media_id`) REFERENCES `Media`(`id`) ON DELETE CASCADE
);

CREATE INDEX idx_collection_media_collection ON `Collection_Media`(`collection_id`);
CREATE INDEX idx_collection_media_media ON `Collection_Media`(`media_id`);
