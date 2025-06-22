const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

const MONGO_URL = 'mongodb://127.0.0.1:27017/dronecraft';

async function createAdmin() {
  await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  const username = 'wdc2025';
  const password = '1q2w3e4r5t';
  const hashed = await bcrypt.hash(password, 10);
  const exists = await Admin.findOne({ username });
  if (exists) {
    console.log('이미 계정이 존재합니다.');
    process.exit(0);
  }
  await Admin.create({ username, password: hashed });
  console.log('관리자 계정이 생성되었습니다!');
  process.exit(0);
}

createAdmin(); 