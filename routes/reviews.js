const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');
require('dotenv').config();

// 모든 후기 조회 (관리자용, 인증 필요)
router.get('/admin', auth, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 공개된 후기만 조회 (클라이언트용)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find({ isPublic: true, isVerified: true })
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 메인페이지 노출용 후기 조회 (isMain: true)
router.get('/main', async (req, res) => {
  try {
    const reviews = await Review.find({ isPublic: true, isVerified: true, isMain: true })
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 후기 상세 조회 (관리자 인증 필요)
router.get('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 후기 생성 (공개)
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 후기 수정 (관리자 인증 필요)
router.patch('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }

    Object.keys(req.body).forEach(key => {
      review[key] = req.body[key];
    });

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 후기 삭제 (관리자 인증 필요)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: '후기를 찾을 수 없습니다.' });
    }

    await review.remove();
    res.json({ message: '후기가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 