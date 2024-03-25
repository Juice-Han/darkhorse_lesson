const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.listen(8080,()=>{
    console.log('Listening on 8080 port');
})

app.get('/',(req,res)=>{
    res.render('login.ejs');
})