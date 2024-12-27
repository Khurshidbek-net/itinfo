const { errorHandler } = require("../helpers/error_handler");
const mongoose = require("mongoose");
const Dictionary = require("../schemas/Dictionary");
const { dictValidation } = require("../validations/dictionary.validation");


const getAllTerms = async(req, res) =>{
    try {
        const terms = await Dictionary.find({});
        res.status(200).send({terms});
    } catch (error) {
        errorHandler(error, res);rr
    }
}

const getTermByLetter = async(req, res) =>{
    try {
        const {letter} = req.body;
        const terms = await Dictionary.find({letter});

        if(!terms)
            res.status(404).send({message: "No terms for this letter"});

        res.status(200).send({terms});
    } catch (error) {
        errorHandler(error, res);
    }
}


const addTerm = async (req, res) =>{
    try {
        const {error, value} = dictValidation(req.body);

        if(error)
            return res.status(400).send({message: error.message});
        
        const {term} = value;
        
        const existTerm = await Dictionary.findOne({term});
        if(existTerm)
            return res.status(400).send({message: "This term already exists"});
        const newTerm = await Dictionary.create({term, letter: term[0]});
        res.status(201).send({message: "New term created: ", newTerm});
    } catch (error) {   
        errorHandler(error, res);
    }
}

const deleteTerm = async(req, res) =>{
    try {
        const {id} = req.params;
        if(!mongoose.isValidObjectId(id))
            return res.status(400).send({message: "Invalid term id provided"});
        const term = await Dictionary.findByIdAndDelete(id);
        if(!term)
            return res.status(400).send({message: "Term is not found"});
        res.status(200).send({message: "Term deleted successfully"});
    } catch (error) {
        errorHandler(error, res);
    }
}



const updateTerm = async(req, res) =>{
    try {
        const {id} = req.params;
        const {term} = req.body;

        if(!term)
            return res.status(400).send({message: "New term is required"});

        const newTerm = await Dictionary.findByIdAndUpdate(id, {term}, {new: true});
        if (!newTerm)
            return res.status(404).send({message: "Term not found"});

        res.status(200).send({message: "Term updated successfully"});

    } catch (error) {
        errorHandler(error, res);
    }
}



module.exports = {
    addTerm,
    getAllTerms,
    getTermByLetter,
    deleteTerm,
    updateTerm
}