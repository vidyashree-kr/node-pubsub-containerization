const { publishMessage,SubscriberToTopic} = require('../repositories/pubsub');
const orderTopicName = process.env.ORDER_TOPIC_NAME;

module.exports = {
  orders: (req, res) => {
      return res.status(200).json({
          success: true,
          message: "Orders route confirmed :)",
      })
  },

  
  createOrders: async (req, res) => {
    const messageId = await publishMessage(orderTopicName,req.body);
    // await SubscriberToTopic(orderTopicName,process.env.DELIVERY_SUB_NAME);
    // await SubscriberToTopic(orderTopicName,process.env.NOTIFICATION_SUB_NAME);
    res.status(200).json({
      success: true,
      data: `Message ${messageId} published `
    });
  },

};



