CREATE VIEW vw_user_statistics AS
SELECT 
    u.id AS user_id,
    u.username,
    COUNT(DISTINCT r.id) AS total_reviews,
    COUNT(DISTINCT l.id) AS total_likes_given,
    (SELECT COUNT(*) FROM `like` WHERE review_id IN (SELECT id FROM review WHERE user_id = u.id)) AS total_likes_received,
    COUNT(DISTINCT f1.id) AS following_count,
    COUNT(DISTINCT f2.id) AS followers_count,
    AVG(r.rating) AS average_rating,
    COUNT(DISTINCT li.id) AS total_lists
FROM user u
LEFT JOIN review r ON u.id = r.user_id
LEFT JOIN `like` l ON u.id = l.user_id
LEFT JOIN follow f1 ON u.id = f1.follower_id
LEFT JOIN follow f2 ON u.id = f2.followed_id
LEFT JOIN list li ON u.id = li.user_id
GROUP BY u.id, u.username;