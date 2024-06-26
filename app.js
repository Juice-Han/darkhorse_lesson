const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path')
const session = require('express-session');
const app = express();
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 5 //5분동안 쿠키 유효
    }
}))

const uri = `mongodb+srv://${process.env.MONGODB_CONNECT_ID}:${process.env.MONGODB_CONNECT_PASSWORD}@cluster0.uyhgcoc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const dbName = 'darkhorse_lesson';
let db;
const client = new MongoClient(uri);
async function connectMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        db = client.db(dbName);
        app.listen(8080, () => {
            console.log('Listening on 8080 port');
        })
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}
connectMongoDB();

app.get('/', (req, res) => {
    res.render('login.ejs');
})

//회원가입 기능 삭제
// app.get('/user/register', (req, res) => {
//     res.render('register.ejs');
// })


// app.post('/user/register', (req, res) => {
//     res.render('login.ejs');
// })

app.post('/user/login', async (req, res) => {
    let { name, password } = req.body
    //만약 아이디 값이 공백으로 채워져있다면 오류 표시
    if (!name.trim()) {
        res.render('loginError.ejs', { message: "이름을 입력해주세요", name: name });
        return;
    }
    const user = await db.collection('user').findOne({ name: name });
    //만약 아이디가 존재하지 않는다면 입력받은 비밀번호와 함께 계정 생성
    if (user === null) {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.collection('user').insertOne({ name: name, password: hashedPassword })
            .catch(err => {
                console.error('db 유저 생성 실패', err);
                res.render('loginError.ejs', { message: "계정 생성을 실패하였습니다. 다시 시도해주세요.", name: name });
                return;
            })
    } else { //만약 아이디가 존재한다면 입력받은 비밀번호와 저장된 비밀번호 비교 및 확인
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            res.render('loginError.ejs', { message: '비밀번호가 틀렸습니다.', name: name });
            return;
        }
    }
    //사용자 세션 생성 코드 작성
    req.session.isLogined = true;
    req.session.name = name;
    res.redirect('/choose');
})

app.get('/choose', async (req, res) => {
    //로그인 정보 세션 없으면 접근 불가
    if(!req.session.isLogined){
        res.redirect('/');
        return;
    }
    let dayList = [];
    const schedule = await db.collection('schedule').find().toArray();
    schedule.forEach((day)=>{
        switch(day.day){
            case 0:
                dayList.push('월요일');
                break;
            case 1:
                dayList.push('화요일');
                break;
            case 2:
                dayList.push('수요일');
                break;
            case 3:
                dayList.push('목요일');
                break;
            case 4:
                dayList.push('금요일');
        }
    })
    res.render('choose.ejs', { dayList });
})

app.get('/choose/:day', (req, res) => {
    //로그인 정보 세션 없으면 접근 불가
    if(!req.session.isLogined){
        res.redirect('/');
        return;
    }
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

app.post('/choose/:day',(req,res)=>{
    console.log(req.params.day);
    console.log(req.body);
    console.log(req.session);
    //레슨 신청 정보 저장할 때 필요한 정보
    // 1. 신청자 이름
    // 2. 신청 요일
    // 3. 신청 시간대
    
})

app.get('/choose/:day/detail', (req, res) => {
    //로그인 정보 세션 없으면 접근 불가
    if(!req.session.isLogined){
        res.redirect('/');
        return;
    }
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

app.get('*',(req,res)=> {
    res.redirect('/');
})