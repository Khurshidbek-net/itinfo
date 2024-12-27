const Author_Social = require("../schemas/Author_Social");
const { authSocialValidation } = require("../validations/auth_social.validation")


const createAuthSocial = async(req, res) =>{
    try {
        const {error, value} = authSocialValidation(req.body);
        if(error)
            return res.status(400).send({message: error.message});

        // const {author_id, social_id, social_link} = value;
        res.status(201).send({message: "Author Social created successfully"})

    await Author_Social.create({...value});
    } catch (error) {
        res.status(500).send({ message: "Error creating author social", error: error.message });
    }
}


const getAllAuthSocial = async(req, res) =>{
    try {
        const socials = await Author_Social.find();
        res.status(200).send({data: socials});
    } catch (error) {
        res.status(500).send({ message: "Error retrieving author social", error: error.message });
    }
    
}

const updateAuthSocial = async(req, res) =>{
    try {
        const {id} = req.params;

        const {author_id, social_id, social_link} = req.body;

        const update = await Author_Social.findByIdAndUpdate(
            id,
            {author_id, social_id, social_link},
            {new: true}
        );

        if(!update)
            return res.status(404).send({message: "Author social not found"});

        res.status(200).json({ message: "Author Social updated successfully", data: update });
    } catch (error) {
        res.status(500).send({ message: "Error updating author social", error: error.message });
    }
}

const deleteAuthSocial = async(req, res) =>{
    try {
        const {id} = req.params;

        const deleteSocial = await Author_Social.findByIdAndDelete(id);

        if(!deleteSocial)
            return res.status(404).send({message: "Author social not found"});

        res.status(200).send({message: "Author Social deleted successfully"})
    } catch (error) {
        res.status(500).send({ message: "Error deleting author social", error: error.message });
    }
}




module.exports = {
    createAuthSocial,
    getAllAuthSocial,
    updateAuthSocial,
    deleteAuthSocial
}