const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path')
const app = express();
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const uri = `mongodb+srv://${process.env.MONGODB_CONNECT_ID}:${process.env.MONGODB_CONNECT_PASSWORD}@cluster0.uyhgcoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'darkhorse_lesson';
const client = new MongoClient(uri);
async function connectMongoDB(){
    try{
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db(dbName);
        app.listen(8080, () => {
            console.log('Listening on 8080 port');
        })
    }catch(error){
        console.error('Failed to connect to MongoDB', error);
    }
}
connectMongoDB();

app.get('/', (req, res) => {
    res.render('login.ejs');
})

app.get('/user/register', (req, res) => {
    res.render('register.ejs');
})

//회원가입 기능 삭제
// app.post('/user/register', (req, res) => {
//     res.render('login.ejs');
// })

app.post('/user/login', (req, res) => {
    //로그인 확인 코드 작성
    res.redirect('/choose');
})

app.get('/choose', (req, res) => {
    //로그인 정보 세션 없으면 들어가지 접근 못하게 막는 코드 작성
    const dayList = ['월요일', '화요일', '수요일', '목요일', '금요일']
    res.render('choose.ejs', { dayList });
})

app.get('/choose/:day', (req, res) => {
    let day = 0;
    if (req.params.day === '0') day = '월요일';
    else if (req.params.day === '1') day = '화요일';
    else if (req.params.day === '2') day = '수요일';
    else if (req.params.day === '3') day = '목요일';
    else if (req.params.day === '4') day = '금요일';

    //요일 별 타임 리스트 작성해야함
    const timeList = ['10:30 ~ 10:45', '10:45 : 11:00', '11:00 ~ 11:15', '11:15 ~ 11:30'];
    res.render('chooseDetail.ejs', { dayIndex: req.params.day, day, timeList });
})

app.get('/choose/:day/detail', (req, res) => {
    let day = 0;
    if (req.params.day === '0') day = '월요일';
    else if (req.params.day === '1') day = '화요일';
    else if (req.params.day === '2') day = '수요일';
    else if (req.params.day === '3') day = '목요일';
    else if (req.params.day === '4') day = '금요일';

    //요일 별 타임 리스트 작성해야함
    const timeList = [
        {
            time: '10:30 ~ 10:45',
            first: '김노랑',
            waiting: [
                '홍길동',
                '최파랑'
            ]
        },
        {
            time: '10:45 ~ 11:00',
            first: '이시온',
            waiting: [
                '강보라',
                '이초록'
            ]
        },

    ];
    res.render('chooseStatus.ejs', { day, timeList })
})