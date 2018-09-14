const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET call for users submitted applications
router.get(`/userApplication/":id`, (req, res) => {
    let id = req.params.id
    const queryText = `SELECT job_tracker.id, location_id, user_id, job_tracker.date_applied, job_tracker.follow_up_date, job_tracker.job_title, job_type, application_phase, company_contact, company_name, job_tracker.company_url, job_tracker.comments, FROM job_tracker JOIN job_type ON job_tracker.job_type=job_type.id JOIN application_phase ON job_tracker.application_phase=application_phase.id WHERE user_id = $1;`;
    pool.query(queryText, [id])
    .then(result.rows);
})
.catch((error) => {
    console.log('error getting applications:', error);
    res.sendStatus(500);
});

router.get('/', (req, res) => {
    let param = req.query.param;
    let value = req.query.value;

    // for filtering by job type
    if (param === 'type'){
        const queryText = `SELECT job_tracker.*, job_type.type, locations.address, locations.lat, locations.lng FROM job_tracker JOIN locations ON locations.id = job_tracker.location_id JOIN job_type ON job_tracker.job_type = job_type.id WHERE job_type.id = ${value} ORDER BY id;`;
        pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error getting applications:', error);
            res.sendStatus(500);
        })
    }

    // for filtering by application phase
    else if (param === 'phase') {
        const queryText = `SELECT job_tracker.*, application_phase.phase, locations.address, locations.lat, locations.lng FROM job_tracker JOIN locations ON locations.id = job_tracker.location_id JOIN application_phase on job_tracker.application_phase = application_phase.id WHERE application_phase.id = ${value} ORDER BY id;`;
        pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error getting applications:', error);
            res.sendStatus(500);
        })
    }

    // for getting all applications
    else {
        const queryText = `SELECT job_tracker.*, locations.address, locations.lat, locations.lng FROM job_tracker JOIN locations ON locations.id = job_tracker.location_id ORDER BY id;`;
        pool.query(queryText)
        .then((result) => {
            res.send(result.rows);
        })
        .catch((error) => {
            console.log('error getting applications:', error);
            res.sendStatus(500);
        })
    }
});

router.get('/type', (req, res) => {
    const queryText = `SELECT * FROM job_type ORDER BY id;`;
    pool.query(queryText)
    .then((result) => {
        console.log('back from database with job types', result.rows);
        res.send(result.rows);
    })
    .catch((error) => {
        console.log('error getting job types'), error;
        res.sendStatus(500);
    })
});

router.get('/phase', (req, res) => {
    const queryText = `SELECT * FROM application_phase ORDER BY id;`;
    pool.query(queryText)
    .then((result) => {
        console.log('back from database with application phases', result.rows);
        res.send(result.rows);
    })
    .catch((error) => {
        console.log('error getting application phases:', error);
        res.sendStatus(500);
    })
});

// inserts into locations, returns id, then inserts into job_tracker table
router.post('/', (req, res) => {
    const address = req.body.address;
    const lat = req.body.lat;
    const lng = req.body.lng;
    const queryText = `INSERT INTO locations(address, lat, lng) VALUES ($1, $2, $3) RETURNING id;`
    pool.query(queryText, [address, lat, lng])
    .then((result) => {
        const location_id = result.rows[0].id;
        const user_id = req.body.user_id;
        const date_applied = req.body.date_applied;
        const follow_up_date  = req.body.follow_up_date;
        const job_title = req.body.job_title;
        const job_type = req.body.job_type;
        const application_phase = req.body.application_phase;
        const company_contact = req.body.company_contact;
        const company_name = req.body.company_name;
        const company_url = req.body.company_url;
        const comments = req.body.comments;
        const applicationQueryText = `INSERT INTO job_tracker(location_id, user_id, date_applied, follow_up_date, job_title, job_type, application_phase, company_contact, company_name, company_url, comments)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
        pool.query(applicationQueryText, [location_id, user_id, date_applied, follow_up_date, job_title, job_type, application_phase, company_contact, company_name, company_url, comments])
        .then(() => {
            console.log('application added successfully');
            res.sendStatus(201);
        }).catch((error) => {
            console.log('error adding application: ', error);
            res.sendStatus(500);
        })
    }).catch((error) => {
        console.log('error adding location: ', error);
        res.sendStatus(500);
    })
});

// TODO add router.put && router.delete

module.exports = router;