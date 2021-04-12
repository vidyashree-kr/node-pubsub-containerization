const {PubSub} = require('@google-cloud/pubsub');
const pubSubClient = new PubSub();
const { retrySettings } = require('./pubsub_constant')

async function createTopic(topicName){
    try {
        console.log('in creating pub/sub topic');
        await pubSubClient.createTopic(topicName,{autoCreate: true});
        await pubSubClient.topic(topicName).createSubscription(process.env.DELIVERY_SUB_NAME);  
        await pubSubClient.topic(topicName).createSubscription(process.env.NOTIFICATION_SUB_NAME); 
        console.log('done creating pub/sub topic');
    } catch (error) {
        console.log('in error logging when creating pub/sub topic');
        console.log(error)
        console.log('done logging error when creating pub/sub topic');
    }
}

async function createTopicSubcription(topicName,subscriptionName){
    try {
        console.log('creating a new subscription');
        await pubSubClient.topic(topicName).createSubscription(subscriptionName)  
        console.log('done creating pub/sub topic subscription');
    } catch (error) {
        console.log('in error logging when creating pub/sub topic subscription');
        console.log(error)
        console.log('done logging error when creating pub/sub topic subscription');
    }
}

async function pubish(topicName,data){
    let messageId
    if(!process.env.UseRetryPolicy){

        messageId = await pubSubClient
                            .topic(topicName, {enableMessageOrdering: true})
                            .publish(data);

    }else{
        messageId =  await pubSubClient
                            .topic(topicName, {enableMessageOrdering: true,retry: retrySettings})
                            .publish(data);

    }
    return messageId;
}


module.exports = {
    publishMessage: async (topicName,payload) => {
        console.log('in publish middleware');
        console.log(`publish payalod: ${JSON.stringify(payload)}`);
        const dataBuffer = Buffer.from(JSON.stringify(payload));
        await createTopic(topicName);
        const messageId = await pubish(topicName,dataBuffer);        
        console.log(`Message ${messageId} published.`);
        return messageId;
    },

    SubscriberToTopic: async (topicName,subscriptionName) => {
        console.log('in Subscriber to topic  middleware');
        await createTopicSubcription(topicName,subscriptionName);
    },


    SubscriberToMessages: async (topicName,subscriptionName,timeout= process.env.TIME_OUT) => {
        console.log('in SubscriberToMessages  middleware');
        await createTopicSubcription(topicName,subscriptionName);
        let messageCount = 0;
        const subscription = pubSubClient.topic(topicName).subscription(subscriptionName);
        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`Data: ${message.data}`);
            console.log(`Attributes: ${message.attributes}`);
            messageCount += 1;
            message.ack();
            return message.data;
        };
        // Receive callbacks for new messages on the subscription
        subscription.on('message',messageHandler);

        // Receive callbacks for errors on the subscription
        subscription.on('error', error => {
            console.error('Received error:', error);
            process.exit(1);
        });  

        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    },


    SubscriberToMessagesv1: async (subscriptionName,timeout = process.env.TIME_OUT ) => {
        console.log('in SubscriberToMessages  middleware');
        const subscription = pubSubClient.subscription(subscriptionName);
        let messageCount = 0;
        const messageHandler = message => {
            console.log(`Received message ${message.id}:`);
            console.log(`Data: ${message.data}`);
            console.log(`Attributes: ${message.attributes}`);
            messageCount += 1;
            message.ack();
            return message.data;
        };
        // Receive callbacks for new messages on the subscription
        subscription.on('message',messageHandler);

        // Receive callbacks for errors on the subscription
        subscription.on('error', error => {
            console.error('Received error:', error);
            process.exit(1);
        });  

        setTimeout(() => {
            subscription.removeListener('message', messageHandler);
            console.log(`${messageCount} message(s) received.`);
        }, timeout * 1000);
    },

    getSubscription: async (subscriptionName) => {
        console.log('in getSubscription  middleware');
        // Gets the metadata for the subscription
        const [metadata] = await pubSubClient
          .subscription(subscriptionName)
          .getMetadata();
    
        console.log(`Subscription: ${metadata.name}`);
        console.log(`Topic: ${metadata.topic}`);
        console.log(`Push config: ${metadata.pushConfig.pushEndpoint}`);
        console.log(`Ack deadline: ${metadata.ackDeadlineSeconds}s`);
    }
    
};