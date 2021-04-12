const express = require('express');
const {notifications,pullNotification} = require('../controllers/notification');

const router = express.Router({ mergeParams: true });

router
  .get('/',notifications)
  .post('/pull',pullNotification);
 

module.exports = router;
