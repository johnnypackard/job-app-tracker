const express =  require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    const queryText = `SELECT user_id, username, email, contact_info, type FROM users JOIN profiles ON users.id = user_id ORDER BY users.type ASC;`;
    pool.query(queryText)
        .then((result) => {
            console.log('back from database with all users');
            res.send(result.rows);
        }).catch((error) => {
            console.log('error getting all users', error);
            res.sendStatus(500);
        })
})

router.get('/filterByLocation', (req, res) => {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(re.query.lng);
    console.log('lat:', lat);
    console.log('lng:', lng);
    const latRangeMinus = lat-2;
    const latRangePlus = lat+2;
    const lngRangeMinus = lng-2;
    const lngRangePlus = lng+2;
    console.log('lat range:', latRangeMinus);
    console.log('lat range:', latRangePlus);
    console.log('lng range:', lngRangeMinus);
    console.log('lng range:', lngRangePlus);
    
    const queryText = `SELECT articles.*, statuses.status, locations.lat, locations.lng, locations.address from articles
    RIGHT JOIN job_type ON articles.job_type = job_type.id
    JOIN job_phase ON articles.job_phase = job_phase.id
    LEFT JOIN users ON user_id = users.id
    JOIN locations on location_id = locations.id
    WHERE (lat BETWEEN ${latRangeMinus} AND ${latRangePlus})
    AND (lng BETWEEN ${lngRangeMinus} AND ${lngRangePlus})
    AND (statuses.status = 'approved' OR statuses.status = 'edit-review'
    OR statuses.status = 'edit-delete');`
    console.log('queryText: ', queryText);
    pool.query(queryText)
    .then((result) => {
        console.log('back from database with articles filtered by location: ', result.rows);
        res.send(result.rows);
    })
    .catch((error) => {
        console.log('error getting filtered list of articles: ', error);
        res.sendStatus(500);
    })
})

router.get('/reviewArticles', (req, res) => {
    const queryText = `SELECT quasi_articles.id, article_id, user_id, date_posted, job_title, institution_name, institution_url, institution_contact, related_articles, admin_comment, brief_description, summary, user_story, job_date, job_type.type, job_phase.phase, statuses.status, users.username, job_type.id AS job_type, job_phase.id AS job_phase FROM quasi_articles JOIN job_type = job_type.id JOIN job_phase ON quasi_articles.job_phase = job_phase.id JOIN statuses ON quasi_articles.status=statuses.id JOIN users ON quasi_articles.user_id=users.id;`
    pool.query(queryText)
        .then((result) => {
            console.log('back from the database with quasi articles', result);
            res.send(result.rows);
        }).catch((error) => {
            console.log('error getting approved articles', error);
            res.sendStatus(500);
        })
})

router.get('/articles', (req, res) => {
    const queryText = `SELECT articles.*, statuses.status, job_type.type, job_phase.phase, username, email FROM articles
                        JOIN statuses ON articles.status = statuses.id
                        RIGHT JOIN job_type ON articles.job_type = job_type.id
                        JOIN job_phase ON articles.job_phase = job_phase.id
                        LEFT JOIN users ON user_id = users.id
                        WHERE statuses.status = 'approved'
                        OR statuses.status = 'edit-review'
                        OR statuses.stats = 'edit-delete'
                        ORDER BY date_posted ASC;`
    pool.query(queryText)
        .then((result) => {
            console.log('back from database with all the approved articles', result);
            res.send(result.rows);
        }).catch((error) => {
            console.log('error getting approved articles', error);
            res.sendStatus(500);
        })
})

router.get('/newArticles', (req, res) => {
    const queryText = `SELECT articles.*, statuses.status, job_type.type, users.username, users.email FROM articles
    JOIN statuses ON articles.status = statuses.id
    RIGHT JOIN job_type ON articles.job_type = job_type.id
    JOIN job_phase ON articles.job_phase = job_phase.id
    LEFT JOIN users ON user_id = users.id WHERE statuses.status = 'pending'
    ORDER BY research_date ASC;`
    pool.query(queryText)
    .then((result) => {
        console.log('back from database with all approved articles', result);
        res.send(result.rows); 
    }).catch((error) => {
        console.log('error getting approved articles', error);
        res.sendStatus(500);
    })
})

router.put(`/articles/:id`, (req, res) => {
    const id = req.params.id;
    const status = req.body.approved || req.body.rejected;
    const admin_comment = req.body.comments;
    const queryText=`UPDATE articles SET status=$1, admin_comment=$3 WHERE id=$2;`
    pool.query(queryText, [status, id, admin_comment])
    .then((result) => {
        res.sendStatus(201)
    })
    .catch((error) => {
        console.log('error getting', error);
        res.sendStatus(500);
    })
})

router.delete('/deleteUser/:id', (req, res) => {
    let id = req.params.id
    console.log('this is the id in the router', id);
    const queryText = `DELETE FROM users WHERE id = $1`;
    pool.query(queryText, [id])
        .then((result) => {
            console.log('successful delete of user', result);
            res.sendStatus(200)
        })
        .catch((error) => {
            console.log('Error deleting the user', error);
            res.sendStatus(500)
        })
})

router.put(`/usertype/:id`, (req, res) => {
    let userId = req.params.id;
    let userType = req.body.payload;
    queryText = `UPDATE users SET type=$1 WHERE id=$2;`;
    pool.query(queryText, [userType, userId])
        .then((result) => {
            console.log('successful user type change');
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error changing user type in router', error);
            res.sendStatus(500);
        })
})

router.delete(`/deleteArticle/:id`, (req, res) => {
    let id = req.params.id;
    const queryText = `DELETE FROM articles WHERE id = $1`;
    pool.query(queryText, [id])
        .then((result) => {
            console.log('Successful delete of article');
            res.sendStatus(200)
        })
        .catch((error) => {
            console.log('Error deleting article', error);
            res.sendStatus(500);
        })
})

router.delete(`/deleteQuasi/:id`, (req, res) => {
    const quasi_id = req.params.id;
    queryText = `DELETE FROM quasi_articles WHERE id=$1;`;
    pool.query(queryText, [quasi_id])
    .then((result) => {
        console.log('Successful delete of Quasi article');
        res.sendStatus(200)
    })
    .catch((error) => {
        console.log('Error deleting Quasi article', error);
        res.sendStatus(500);
    })
})

router.delete(`/declineRequest/:id`, (req, res) => {
    const quasi_id = req.params.id;
    console.log('/////////////////////', req);
    
    queryText = `DELETE FROM quasi_articles WHERE id=$1; `;
    pool.query(queryText, [quasi_id])
    .then((result) => {
        console.log('Successful delete of Quasi article', error);
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('Error deleting Quasi article', error);
        res.sendStatus(500);
    })
})

router.delete(`/updateStatus/:id`, (req, res) => {
    console.log(req.params.id);
    const id = req.params.id;
    queryText = `UPDATE articles SET status = $1 WHERE id = $2`
    pool.query(queryText, [2, id])
    .then((response) => {
        console.log('successfully updated article with status');
        res.sendStatus(200);
    })
    .catch((error) => {
        console.log('error', error);
    })
})

router.put(`/editArticle/:id`, (req, res) => {
    const id = req.params.id;
    const queryText = `UPDATE articles SET job_date = $1, job_title = $2, job_type = $3,
    job_phase = $4, institution_name = $5, institution_url = $6, institution_contact = $7, related_articles = $8, status = $9 WHERE id = $10;`;
    pool.query(queryText, [req.body.job_date, req.body.job_title, req.body.job.type, req.body.job_phase, req.body.institution_name, req.body.institution_url, req.body.institution_contact, req.body.related_articles, 2, id])
        .then(() => {
            console.log('article successfully updatd', res);
            res.sendStatus(201);
        }).catch((error) => {
            console.log('error updating article: ', error);
            res.sendStatus(500);
        })
})

module.exports = router;