const { SubscriberToMessagesv1 } = require('../repositories/pubsub');
const subscriptionName = process.env.DELIVERY_SUB_NAME;

module.exports = {
    deliverys: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Deliveries route confirmed :)",
        })
    },

    pullDelivery: async (req, res) => {
        try {
            await SubscriberToMessagesv1(subscriptionName);            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't recieve orders object :)",
                data: error
            })                        
        }
        
    }
};