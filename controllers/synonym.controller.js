const Synonym = require("../schemas/Synonym");
const { sysnonymValidation } = require("../validations/synonym.validation");

const createSyn = async(req, res) =>{
    try {

        const {error, value} = sysnonymValidation(req.body);
        if(error)
            return res.status(400).send({message: error.message});

        const {desc_id, dict_id} = value;

        const syn = new Synonym({desc_id, dict_id});
        await syn.save();

        res.status(201).send({message: "Synonym created successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error creating synonym", error: error.message });
    }
}

const getAllSyns = async(req, res) =>{
    try {
        const allSyns = await Synonym.find().populate('desc_id', 'description')
            .populate('dict_id', 'term')
        
        res.status(200).send({data: allSyns});
    } catch (error) {
        res.status(500).send({ message: "Error retrieving synonyms", error: error.message });
    }
}

const getSynByid = async(req, res) =>{
    try {
        const {id} = req.params;
        const syn = await Synonym.findById(id)
            .populate('desc_id', 'description')
            .populate('dict_id', 'term');
        if(!syn)
            return res.status(404).send({message: "Synonym not found"});

        res.status(200).send({data: syn});
    } catch (error) {
        res.status(500).send({ message: "Error retrieving synonym by id", error: error.message });
    }
}


const updateSyn = async(req, res) =>{
    try {
        const{id} = req.params;
        const {desc_id, dict_id} = req.body;

        const newSyn = await Synonym.findByIdAndUpdate(
            id,
            {desc_id, dict_id},
            {new: true}
        );
        if (!newSyn)
            return res.status(404).send({message: "Synonym not found"});

        res.status(200).send({message: "Synonym updated successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error updating synonym", error: error.message });
    }
}


const deleteSyn = async(req, res) =>{
    try {

        const {id} = req.params;

        const syn = await Synonym.findByIdAndDelete(id);
        if(!syn)
            return res.status(404).send({message: "Synonym not found"});
        res.status(200).send({message: "Synonym deleted successfully"});

    } catch (error) {
        res.status(500).send({ message: "Error updating synonym", error: error.message });
    }
}



module.exports = {
    createSyn,
    getAllSyns,
    getSynByid,
    updateSyn,
    deleteSyn
}