const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'dronecraft-secret';

// 관리자 로그인
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: '존재하지 않는 계정입니다.' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 계정 추가 (인증 필요)
router.post('/add', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: '아이디와 비밀번호를 입력하세요.' });
  try {
    const exists = await Admin.findOne({ username });
    if (exists) return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ username, password: hashed });
    res.json({ message: '관리자 계정이 추가되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 비밀번호 변경 (인증 필요)
router.patch('/password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  if (!username || !oldPassword || !newPassword) return res.status(400).json({ message: '모든 값을 입력하세요.' });
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: '계정을 찾을 수 없습니다.' });
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: '기존 비밀번호가 일치하지 않습니다.' });
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    res.json({ message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 계정 삭제 (마스터만 가능)
router.delete('/:username', auth, async (req, res) => {
  try {
    // 요청한 관리자 정보
    const requester = await Admin.findById(req.admin.id);
    if (!requester || !requester.isMaster) {
      return res.status(403).json({ message: '마스터 계정만 삭제할 수 있습니다.' });
    }
    // 삭제 대상
    const { username } = req.params;
    const target = await Admin.findOne({ username });
    if (!target) {
      return res.status(404).json({ message: '삭제할 계정을 찾을 수 없습니다.' });
    }
    if (target.isMaster) {
      return res.status(400).json({ message: '마스터 계정은 삭제할 수 없습니다.' });
    }
    await target.deleteOne();
    res.json({ message: '관리자 계정이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

// 관리자 목록 조회 (마스터만 가능)
router.get('/list', auth, async (req, res) => {
  try {
    const requester = await Admin.findById(req.admin.id);
    if (!requester || !requester.isMaster) {
      return res.status(403).json({ message: '마스터 계정만 관리자 목록을 볼 수 있습니다.' });
    }
    const admins = await Admin.find({}, { password: 0, __v: 0 });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: '서버 오류' });
  }
});

module.exports = router; 