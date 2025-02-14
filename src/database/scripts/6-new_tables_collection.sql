CREATE TABLE `Collection` (
    `id` BIGINT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `collection_name_unique` (`name`)
);

CREATE INDEX idx_collection_name ON `Collection`(`name`);

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