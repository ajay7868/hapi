const mysql=require('mysql');
var conntetion =mysql.createConnection({
    host :'localhost',
    user:"root",
    password:"root",
    database:'sip'
});

conntetion.connect(function(err){
    if(err) throw err;
});
module.exports=conntetion;