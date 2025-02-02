import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const senderId = req.user._id;
        const {id:receiverId} = req.params;

        if(!message || !senderId || !receiverId) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        // logic to send message
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }); 

        if(!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([newMessage.save(), conversation.save()]); 

        res.status(200).json({ message: 'Message sent' });
    }
    catch (err) {
        console.log(`Error in sendMessage: ${err.message}`);
        return res.status(500).json({ message: err.message });
    }
};


export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};