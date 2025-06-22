const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

// 모든 견적 문의 조회 (최신순, 관리자 인증 필요)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 견적 문의 상세 조회 (관리자 인증 필요)
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: '견적 문의를 찾을 수 없습니다.' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 견적 문의 생성 (공개)
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    res.status(201).json({ success: true, contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 견적 문의 삭제 (관리자 인증 필요)
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: '견적 문의를 찾을 수 없습니다.' });
    }
    await contact.remove();
    res.json({ message: '견적 문의가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 모든 견적 문의 전체 삭제 (관리자 인증 필요)
router.delete('/', auth, async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ message: '모든 견적 문의가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 