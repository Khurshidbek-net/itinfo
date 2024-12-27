const Social = require("../schemas/Social");
const { socialValidation } = require("../validations/social.validation");

const createSocial = async(req, res) =>{
    try {

        const {error, value} = socialValidation(req.body);

        if(error)
            return res.status(400).send({message: error.message});

        const {social_name, social_icon_file} = value;

        await Social.create({social_name, social_icon_file});
        res.status(201).send({ message: "Social created successfully" });

    } catch (error) {
        res.status(500).send({ message: "Error creating category", error: error.message });
    }
}


const getAllSocial = async(req, res) =>{
    try {
        const allSocails = await Social.find();
        res.status(200).send(allSocails);
    } catch (error) {
        res.status(500).send({ message: "Error creating category", error: error.message });
    }
}


const updateSocial = async(req, res) =>{
    try {
        const {id} = req.params;
        const {social_name, social_icon_file} = req.body;

        const updateSocial = await Social.findByIdAndUpdate(
            id,
            {social_name, social_icon_file},
            {new: true}
        );

        if(!updateSocial)
            return res.status(404).send({message: "Category not found"});

        res.status(200).json({ message: "Category updated successfully", data: updateSocial});
    } catch (error) {
        res.status(500).json({ message: "Error updating social", error: error.message });
    }
}


const deleteSocial = async(req, res) =>{
    try {
        const {id} = req.params;

        const deleteSocial = await Social.findByIdAndDelete(id);
        if(!deleteSocial)
            return res.status(404).send({message: "Social not found"});
        res.status(200).json({ message: "Social deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating social", error: error.message });
    }
}


module.exports = {
    createSocial,
    getAllSocial,
    updateSocial,
    deleteSocial
}