const Hapi = require('hapi')
const server = new Hapi.Server();
const conn = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

server.connection({
    port: 8080,
    host: "localhost"
});
function hashPassword(password, cb) {
    // Generate a salt at level 10 strength
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            return cb(err, hash);
        });
    });
}

server.register(require('hapi-auth-jwt'), (err) => {
    server.auth.strategy('jwt', 'jwt', {
        key: "abcdefghijklmldfdf1212323",
        verifyOptions: { algorithms: ['HS256'] }
    });

});


server.route({
    method: "POST",
    path: "/account",
    handler: (req, res) => {
        res(req.payload);

        let email = req.payload.email;
        let password = req.payload.password;
        let sql = `insert into users(email,password) values('${email}','${password}');`
        conn.query(sql, (err, result) => {
            if (err) {
                throw err
            } else {
                const data={ data:result}
              return res.response(data).code(200)
               
            }

        })
        // hashPassword(req.payload.password, (err, hash) => {

        //     // if (err) {
        //     //     throw Boom.badRequest(err);
        //     // }
        //     // let password = hash;

         
        // })
    }
});
server.route({
    method: "GET",
    path: "/",
    handler: (req, res) => {
        res("hello data")
    }
});
server.route({
    method: "POST",
    path: "/login",
    handler: (req, res) => {
        let tokenHolder = req.headers['authorization'].split(' ');
        const token = tokenHolder[1];
        let sql = `select * from users where email='${req.payload.email}' AND password='${req.payload.password}'`
        jwt.sign({user:req.payload},'secret',{ expiresIn: '24h' },(err,tokendata)=>{
            conn.query(sql, (err, result) => {
                if (err) {
                    throw err
                }
                else {
                    const data={'token':tokendata}
                  return res.response(data).code(201)
                    
                }
            })
        });
        // jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoie1xuXHRcImVtYWlsXCI6XCJhamF5eTQ1MTJcIixcblx0XCJwYXNzd29yZFwiOlwiMTIzNDU0NTY3OFwiXG59IiwiaWF0IjoxNTQ1MjAxNTMzLCJleHAiOjE1NDUyODc5MzN9.Bljc0kZ_7bytheLBPj4WnhrrAsf09aQaJpIAbVmO78g",'secret',(err,tokenverify)=>{
        //     console.log("tokenver",tokenverify)
        // })
       
    }
});

server.start(err => {

    if (err) {
        console.error(err);
    }
    console.log(`Server started at ${server.info.uri}`);

});


