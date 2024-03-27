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

app.get('/user/register',(req,res)=>{
    res.render('register.ejs');
})

app.post('/user/register',(req,res)=>{
    res.render('login.ejs');
})

app.post('/user/login',(req,res)=>{
    //로그인 확인 코드 작성
    res.redirect('/choose');
})

app.get('/choose', (req,res)=>{
    //로그인 정보 세션 없으면 들어가지 접근 못하게 막는 코드 작성
    res.render('choose.ejs');
})

app.get('/choose/:day',(req,res)=>{
    const day = req.params.day
    res.render('chooseDetail.ejs',{ day });
})