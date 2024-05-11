const db = require("../configs/db");

function addPost(req,res) {
    const { posted_by, caption, description} = req.body;
    const image = req.file.path;

    if ( !image || !caption || !description) {
        return res.status(400).send('All fields are required');
    }

    const query = 'INSERT INTO post (posted_by, post_image, caption, description, posted_on) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [posted_by, image, caption, description, new Date()], (err, result) => {
        if (err) {
            console.error('Error adding new post:', err);
            return res.status(500).send('Error adding new post');
        }

        res.status(201).send('Post added successfully');
    });
}

function allPosts(req,res){
    const query = `
        SELECT p.*, 
            COUNT(pl.liked_on) AS like_count,
            u.user_name,
            u.profile_pic
        FROM post p
        LEFT JOIN user_like pl ON p.id = pl.liked_on
        LEFT JOIN user u ON p.posted_by = u.id
        GROUP BY p.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ message: 'Error fetching posts', status: 500 });
        }

        res.json({data: results, status: 200});
    });
}

function likePosts(req,res){
    const userId = req.user.id;
    const postId = parseInt(req.params.postId);

    db.query('SELECT * FROM user_like WHERE liked_by = ? AND liked_on = ?', [userId, postId], (error, results, fields) => {
        if (error) {
            console.error('Error checking like relationship:', error);
            res.status(500).json({ message: 'Error checking like relationship', status: 500 });
            return;
        }

        if (results.length > 0) {
            db.query('DELETE FROM user_like WHERE liked_by = ? AND liked_on = ?', [userId, postId], (deleteError, deleteResults, deleteFields) => {
                if (deleteError) {
                    console.error('Error disliking post:', deleteError);
                    res.status(500).json({ message: 'Error disliking post', status: 500 });
                    return;
                }
                res.json({ success: true });
            });
        }else{
            db.query('INSERT INTO user_like (liked_by, liked_on) VALUES (?, ?)', [userId, postId], (insertError, insertResults, insertFields) => {
                if (insertError) {
                    console.error('Error liking post:', insertError);
                    res.status(500).json({ message: 'Error liking post' , status: 500 });
                    return;
                }
                res.json({ success: true });
            });
        }
    });
}

module.exports = {addPost, allPosts, likePosts};