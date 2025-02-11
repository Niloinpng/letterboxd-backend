DELIMITER //
CREATE PROCEDURE sp_analyze_review_engagement(
    IN p_review_id BIGINT
)
BEGIN
    SELECT 
        r.id AS review_id,
        r.rating,
        r.content,
        u.username AS author,
        m.title AS media_title,
        COUNT(DISTINCT l.id) AS like_count,
        COUNT(DISTINCT c.id) AS comment_count,
        (
            SELECT COUNT(DISTINCT l2.user_id)
            FROM `like` l2
            JOIN follow f ON l2.user_id = f.follower_id
            WHERE l2.review_id = r.id
            AND f.followed_id = r.user_id
        ) AS follower_likes,
        (
            SELECT AVG(r2.rating)
            FROM review r2
            WHERE r2.media_id = r.media_id
            AND r2.id != r.id
        ) AS avg_media_rating
    FROM review r
    JOIN user u ON r.user_id = u.id
    JOIN media m ON r.media_id = m.id
    LEFT JOIN `like` l ON r.id = l.review_id
    LEFT JOIN comment c ON r.id = c.review_id
    WHERE r.id = p_review_id
    GROUP BY r.id, r.rating, r.content, u.username, m.title;
END //
DELIMITER ;