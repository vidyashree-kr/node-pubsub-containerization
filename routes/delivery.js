const express = require('express');
const {deliverys,pullDelivery} = require('../controllers/delivery');

const router = express.Router({ mergeParams: true });

router
  .get('/',deliverys)
  .post('/pull',pullDelivery);
 

module.exports = router;
