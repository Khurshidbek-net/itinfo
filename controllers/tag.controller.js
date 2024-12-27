const Tag = require("../schemas/Tag");
const { tagValidation } = require("../validations/tag.validation")


const createTag = async(req, res) =>{
    try {
        // const {error, value} = tagValidation;

        if(error)
            return res.status(400).send({message: error.message});

        const {topic_id, category_id} = value;

        await Tag.create({topic_id, category_id});
        res.status(201).send({message: "Tag created successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error creating tag", error: error.message });
    }
}

const getAllTags = async(req, res) =>{
    try {
        const allTags = await Tag.find();
        res.status(200).send(allTags);
    } catch (error) {
        res.status(500).send({ message: "Error retieving tags", error: error.message });
    }
}


const updateTag = async(req, res) =>{
    const {id} = req.params;
    const {topic_id, category_id} = req.body;

    const updateTag = await Tag.findByIdAndUpdate(
        id, 
        {topic_id, category_id},
        {new: true}
    );

    if(!updateTag)
        return res.status(404).send({message: "Tag not found"});

    res.status(200).send({message: "Tag updated successfully"});
}

const deleteTag = async(req, res) =>{
    const{id} = req.body;

    const deleteTag = await Tag.findByIdAndDelete(id);

    if(!deleteTag)
        return res.status(404).send({message: "Tag not found"});

    res.status(200).send({message: "Tag deleted successfully"});

}


module.exports = {
    createTag,
    getAllTags,
    updateTag,
    deleteTag
}