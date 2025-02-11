DELIMITER //
CREATE PROCEDURE sp_user_reviews_feed(IN p_user_id INT)
BEGIN
    SELECT 
        r.id AS review_id,
        r.created_at AS activity_time,
        u.username AS author,
        m.title AS media_title,
        m.type AS media_type,
        r.rating,
        r.content AS review_content,
        (SELECT COUNT(*) FROM `like` l WHERE l.review_id = r.id) AS like_count,
        (SELECT COUNT(*) FROM comment c WHERE c.review_id = r.id) AS comment_count
    FROM review r
    JOIN user u ON r.user_id = u.id
    JOIN media m ON r.media_id = m.id
    WHERE r.user_id = p_user_id
    ORDER BY r.created_at DESC;
END //
DELIMITER ;