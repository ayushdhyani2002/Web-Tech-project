const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const routes = require('./routes');
const links = require('./links');
const path  = require('path');
const cors = require('cors');

const schema_user = require('./models/user');
const schema_link = require('./models/link');
const schema_visit = require('./models/usercount');


// allow all cross origin requests
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}


const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, 'client/build')));




app.use(cors(corsOptions));
app.use('/app' , routes);
app.use('/api' , links);

app.get('/' , (req,res)=>{
    res.send('Hello, This is Surya, connect with me at => <a href="https://www.linkedin.com/in/suryateja222/">LinkedIn!</a>');
})


app.get('/verify' , (req, res) => {
    // send a json response
    res.json({
        validity: 'ok',
        message: 'Connected!'
    });
});


app.post('/increase' , (req, res) => {
    // if there are no visits,i.e. the first time the server is accessed create a new visit
    try{
        schema_visit.findOne({} , (err, data) => {
            if(err){
                console.log("Increase error");
                res.json({
                    validity: 'not ok',
                    message: 'Error Occured'
                });
            }
            else if(data === null){
                const visit = new schema_visit({
                    visit: 1
                });
                visit.save();
                res.json({
                    validity: 'ok',
                    message: 'First Time'
                });
            }
            else{
                // increment the visit count
                schema_visit.findOneAndUpdate({} , {$inc : {visit: 1}} , (err, data) => {
                    if(err){
                        console.log("Increase error");
                        res.json({
                            validity: 'not ok',
                            message: 'Error Occured'
                        });
                    }
                    else{
                        console.log('incremented');
                        res.json({
                            validity: 'ok',
                            message: 'Incremented'
                        });
                    }
                });
            }
        });
    }
    catch(err){
        console.log("Increase error")
    }

});


app.get('/getcount' , (req, res) => {
    // send a json response
    try{
        schema_visit.findOne({} , (err, data) => {
            if(err){
                console.log("Get Count error");
                res.json({
                    validity: 'not ok',
                    count: 'Error Occured'
                });
            }
            else{
                res.json({
                    validity: 'ok',
                    count: data.visit
                });
            }
        });
    }
    catch(err){
        console.log("Get Count error")
    }
});


app.post('/log' , async (req, res) => {
    console.log("Okay!Got a Log data Request");
    // get message from request
    const msg = await req.body.message;
    console.log(await msg);
    // send a json response
    res.json({
        validity: 'ok',
        message: msg
    });

});


// if some one click on a smallLink , then find its long link and increment its clicks, take him to long link
app.get('/:smallLink', async (req, res) => {
    console.log("Got a request for a smallLink: " + req.params.smallLink);
    try {
        const smallLink = req.params.smallLink;
        console.log(smallLink);
        const link = await schema_link.findOne({ smallLink: smallLink });
        if (link) {
            const clicks = link.clicks + 1;
            
            // if this code is hosted on server, get the remote client ip address
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            // get time in india in format HH:MM AM/PM DD/MM/YYYY
            const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
            
            const updated_link = await schema_link.findOneAndUpdate({ smallLink: smallLink }, { clicks: clicks, usedip: ip, usedtime: time });
            res.redirect(updated_link.bigLink);
        } else {
            console.log("No such link found (1)");
            res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
        }
    } catch (err) {
        console.log("No such link found (2)  "+ err);
        res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
    }
});






mongoose.connection.on('connected', () => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});