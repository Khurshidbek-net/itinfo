const Topic = require("../schemas/Topic");
const { topicValidation } = require("../validations/topic.validation")


const createTopic = async(req, res) =>{
    try {
        const {error, value} = topicValidation(req.body);
        if(error)
            return res.status(400).send({message: error.message});

        const {author_id, topic_title, topic_text, is_checked, is_approved, expert_id} = value;

        await Topic.create({author_id, topic_title, topic_text, is_checked, is_approved, expert_id});
        res.status(201).send({message: "Topic created successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error creating topic", error: error.message });
    }
}


const getAllTopics = async(req, res) =>{
    try {
        const topics = await Topic.find();
        res.status(200).send(topics);
    } catch (error) {
        res.status(500).send({ message: "Error retieving topics", error: error.message });
    }
}

const updateTopic = async(req, res) =>{
    try {
        const {id} = req.params;
        const {author_id, topic_title, topic_text, is_checked, is_approved, expert_id} = req.body;

        const updateTopic = await Topic.findByIdAndUpdate(
            id,
            {author_id, topic_title, topic_text, is_checked, is_approved, expert_id},
            {new: true}
        )
        if(!updateTopic)
            return res.status(404).send({message: "Topic not found"});

        res.status(200).send({message: "Topic updated successfully"});

    } catch (error) {
        res.status(500).send({ message: "Error updating topic", error: error.message });
    }
}


const deleteTopic = async(req, res) =>{
    try {
        const {id} = req.params;

        const deleteTopic = await Topic.findByIdAndDelete(id);
        if(!deleteTopic)
            return res.status(404).send({message: "Topic not found"});
        res.status(200).send({message: "Topic deleted successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error deleting topic", error: error.message });
    }
}


module.exports = {
    createTopic,
    getAllTopics,
    updateTopic,
    deleteTopic
}