require('dotenv').config();
const connection = require('./connection');
const https = require('https');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.put('/check', (req, res) => {
    connection.query(`SELECT * FROM cart where email = \"${req.body.email}\"`, (err, results) => {
        if (err) res.json(err);
        else if (results.length === 0) res.json(0); // no user
        else { // user is there!
            if (req.body.pass === results[0].pass) {
                res.json(results[0]);
            } else res.json(101) // wrong pasword
        }
    });
    // res.sendStatus(200);
});

app.post('/log', (req, res) => {
    let email = req.body.email;
    connection.query(`SELECT email FROM cart WHERE email like \"${email}\"`, (err, results) => {
        if (err) {
            res.json(err);
        } else if (results.length == 0) {
            // [] || [{ email: 'panda123@gmail.com' }]
            connection.query(`INSERT INTO cart(uname, email, pass, prod_id) VALUES(\"${req.body.uname}\", \"${req.body.email}\", \"${req.body.pass}\", \"[]\");`, (err, results) => {
                if (err) res.send("Error occured when inserting details.");
                else res.json(0);
            });
        } else if (results.length == 1) res.json(1);
        // res.sendStatus(201);
    });
});

app.post('/addcart', (req, res) => {
    //{ arr: [ 5, 11, 15, 18, 2, 1 ] }
    let a = JSON.stringify(req.body.arr);
    connection.query(`UPDATE cart SET prod_id = \'${a}\' WHERE   email  = \"${req.body.email}\"`, (err, results) => {
        if (err) res.json(err);
        else res.json(1);
    })
});

app.put('/remove', (req, res) => {
    const arr = JSON.stringify(req.body.arr);
    connection.query(`UPDATE cart SET prod_id = \'${arr}\' WHERE email = \"${req.body.email}\"`, (err, results) => {
        if (err) res.json('Error occured in server!');
        else {
            connection.query(`SELECT prod_id FROM cart WHERE email = \"${req.body.email}\"`, (err, results) => {
                if (err) res.json(err);
                else res.json(results[0]);
            })
        }
    })
});

app.listen(process.env.PORT, () => {
    console.log('connected successfully!');
});