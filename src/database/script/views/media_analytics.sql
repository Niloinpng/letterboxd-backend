CREATE VIEW vw_media_analytics AS
SELECT 
    m.id AS media_id,
    m.title,
    m.type,
    COUNT(DISTINCT r.id) AS total_reviews,
    AVG(r.rating) AS average_rating,
    COUNT(DISTINCT li.id) AS times_in_lists,
    GROUP_CONCAT(DISTINCT t.name) AS tags
FROM media m
LEFT JOIN review r ON m.id = r.media_id
LEFT JOIN list_items li ON m.id = li.media_id
LEFT JOIN media_tags mt ON m.id = mt.media_id
LEFT JOIN tag t ON mt.tag_id = t.id
GROUP BY m.id, m.title, m.type;
