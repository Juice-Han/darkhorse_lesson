const express = require('express');
const path = require('path')
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,'public')));

app.listen(8080,()=>{
    console.log('Listening on 8080 port');
})

app.get('/',(req,res)=>{
    res.render('login.ejs');
})