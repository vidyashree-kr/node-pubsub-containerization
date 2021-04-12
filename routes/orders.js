const express = require('express');
const {orders,createOrders} = require('../controllers/orders');

const router = express.Router({ mergeParams: true });

router
  .get('/',orders)
  .post('/create',createOrders);
 

module.exports = router;
