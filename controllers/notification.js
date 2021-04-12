const subscriptionName = process.env.NOTIFICATION_SUB_NAME;
const { SubscriberToMessagesv1 } = require('../repositories/pubsub');

module.exports = {
    notifications: (req, res) => {
        return res.status(200).json({
            success: true,
            message: "Notifications route confirmed ",
        })
    },

    pullNotification: async (req, res) => {
        try {
           await SubscriberToMessagesv1(subscriptionName, timeout);            
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Couldn't recieve orders object :)",
                data: error
            })                        
        }
    }

};