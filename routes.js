const express = require('express');
const router = express.Router();
const schema = require(`${__dirname}/models/user`);
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const bcrypt = require('bcryptjs');

const secret =  process.env.ACCESS_KEY;

router.get('/', (req, res) => {
    res.send('Forbidden 404');
})

router.post('/register', async (req, res) => {
    try {
        console.log("Okay!Got a Register Request");
        console.log(await req.body.email);
        const textPassword = await req.body.password;
        const saltRounds = await 10;
        const salt = await bcrypt.genSaltSync(saltRounds);
        const hash = await bcrypt.hashSync(textPassword, salt);


        const user = new schema(
            {
                name: req.body.name,
                email: req.body.email,
                password: hash
            }
        );
        
        user.save((err, data) => {
            if (err) {
                res.json({
                    success: false,
                    message: err
                });
            } else {
                const token = jwt.sign(
                    {
                        id: data._id,
                        email : data.email
                    },
                    secret
                );
                res.json({success: true, message: token , text :"hi"});
            }
        });
        
    } catch (error) {
        res.json({
            success: false,
            message: "Something Went Wrong On Our Side. Please Try Again Later"
        });
    }
    
});


router.post('/login',async (req, res) => {
    try {
        console.log("Okay!Login Request")
        
        
        schema.findOne({email: req.body.email}, async (err, data) => {
            
            if (await err) {
                res.json({status:'error', message: "Unable to retrieve Data"});
                return;
            } else {
                if (data) {
                    if (bcrypt.compareSync(await req.body.password, data.password)) {
                        const token = jwt.sign(
                            {
                                id: data._id,
                                email : data.email
                            },
                            secret
                        );
                        res.json({status:'ok', message: token , text :"hi"});
                        return;
                    } else {
                        res.json({status:'error', message: 'Wrong password'});
                        return;
                    }
                } else {
                    res.json({status:'error', message: 'User not found'});
                    return;
                }
            }
        });
    } catch (error) {
        console.log("Server Error: "+error);
        res.json({status:'error', message: 'Something went Wrong'});
    }

});



router.post('/verify', async (req, res) => {
    console.log('got a call');
    console.log(req.body); 
    const token = await  req.body.token;

    jwt.verify(token , secret , (err, decoded) => {
        if(err){
            console.log('err');
            res.json({status:'error', message: err});
        }
        else{
            console.log('decoded');
            // get user's name
            var name = 'Loading.....'
            const getName = async () => {
                const user = await schema.findOne({email: decoded.email});
                name = await user.name;
                res.json({status:'ok', message: decoded , name : user.name});
            }
            try {
                getName();
            } catch (error) {
                res.json({status:'error', message: err});
            }
        }
    });
});


module.exports = router;