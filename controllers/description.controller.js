const Description = require("../schemas/Description");
const { descValidation } = require("../validations/desc.validation");

const createDesc = async(req, res) =>{
    try {

        const {error, value} = descValidation(req.body);
        if(error)
            return res.status(400).send({message: error.message});

        const{category_id, description} = value;

        if(!category_id || !description)
            return res.status(404).send({message: "Category Id or description not provided"});

        const desc = new Description({category_id, description});
        await desc.save();
        res.status(201).send({message: "Description created successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error creating description", error: error.message });
    }
}

const getAllDesc = async(req, res) =>{
    try {
        const desc = await Description.find().populate('category_id');
        res.status(200).send({data: desc});
    } catch (error) {
        res.status(500).send({ message: 'Error fetching descriptions', error: error.message });
    }
}


const getDescById = async(req, res) =>{
    try {
        const {id} = req.params;
        const desc = await Description.findById(id).populate('category_id', 'category_name');

        if (!desc) 
            return res.status(404).send({ message: 'Description not found' });
        res.status(200).send({ data: desc });

    } catch (error) {
        res.status(500).send({ message: 'Error fetching description', error: error.message });
    }
}

const updateDesc = async(req, res) =>{
    try {
        const {id} = req.params;
        const{category_id, description} = req.body;

        const updateDesc = await Description.findByIdAndUpdate(
            id,
            {category_id, description},
            {new: true}
        );
        if (!updatedDescription) 
            return res.status(404).json({ message: 'Description not found' });

        res.status(200).json({ message: 'Description updated successfully', data: updatedDescription });
    } catch (error) {
        res.status(500).json({ message: 'Error updating description', error: error.message });
    }
}

const deleteDesc = async(req, res) =>{
    try {
        const {id} = req.params;

        const desc = await Description.findByIdAndDelete(id);
        if(!desc)
            return res.status(404).send({message: "Description not found"});

        res.status(200).json({ message: 'Description deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting description', error: error.message });
    }
}


module.exports = {
    createDesc,
    getAllDesc,
    getDescById,
    updateDesc,
    deleteDesc
}