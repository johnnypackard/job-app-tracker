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
