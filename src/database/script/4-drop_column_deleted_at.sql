ALTER TABLE `Media`
    DROP COLUMN `deleted_at`,
    MODIFY `release_date` DATE NULL
    MODIFY `cover_url` LONGBLOB NULL;

ALTER TABLE `Review`
    DROP COLUMN `deleted_at`;

ALTER TABLE `Comment`
    DROP COLUMN `deleted_at`;

ALTER TABLE `List`
    DROP COLUMN `deleted_at`;
