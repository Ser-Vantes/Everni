const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const path = require('path')
const db = require("./models");
const Role = db.role;
const bodyParser = require('body-parser')
const redis = require("redis")
const keys = require('./config/keys')
const Minio = require('minio')
const corsOptions = {
    origin: "http://localhost:3000"
};

const port = process.env.PORT || 5000


db.mongoose.connect(keys.mongoURI)
    .then(() => {
        console.log('MongoDB connected.');
        initial()
    })
    .catch(error => {
        console.log(error);
        process.exit();
    })



function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "student"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'teacher' to roles collection");
            });
            new Role({
                name: "teacher"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'teacher' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))
app.use(require('cors')(corsOptions))

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/group.routes')(app);
require('./routes/faculty.routes')(app);
require('./routes/department.routes')(app);
require('./routes/discipline.routes')(app);
require('./routes/chapter.routes')(app);
require('./routes/lecture.routes')(app);
require('./routes/task.routes')(app);
require('./routes/taskAnswers.routes')(app);
require('./routes/mark.routes')(app);
require('./routes/award.routes')(app);
require('./routes/userAward.routes')(app);


app.listen(port, () => console.log(`Server has been started on ${port}`))
