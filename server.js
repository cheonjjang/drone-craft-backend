const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contactRoutes = require('./routes/contacts');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dronecraft';

mongoose.connect(mongoURI).then(() => {
  console.log('MongoDB에 연결되었습니다! 🎯');
}).catch((error) => {
  console.error('MongoDB 연결 실패:', error);
});

// 라우트 설정
app.use('/api/contacts', contactRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// 테스트 라우트
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '드론크래프트 백엔드 서버가 정상적으로 작동 중입니다! 🚁',
    timestamp: new Date().toISOString()
  });
});

// 루트 경로 핸들러
app.get('/', (req, res) => {
  res.json({
    message: '드론크래프트 백엔드 서버에 오신 것을 환영합니다!',
    endpoints: {
      root: '/',
      test: '/api/test',
      reviews: '/api/reviews'
    }
  });
});

// 서버 시작
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다! 🚀`);
}); 