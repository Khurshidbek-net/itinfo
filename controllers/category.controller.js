const Category = require("../schemas/Category");
const Joi = require('joi');
const { categoryValidation } = require("../validations/category.validation");

const createCategory = async(req, res) =>{
    try {
        const {error, value} = categoryValidation(req.body);
        
        if(error)
            return res.status(400).send({message: error.message});

        const {category_name, parent_category_id} = value;
        
        if(parent_category_id){
            const parentExists = await Category.findById(parent_category_id);

            if(!parentExists){
                return res.status(404).send({message: "Parent category not found"});
            }
        }

        const category = new Category({category_name, parent_category_id});
        await category.save();

        res.status(201).send({message: "Category created successfully"});
    } catch (error) {
        res.status(500).send({ message: "Error creating category", error: error.message });
    }
}


const getAllCategories = async(req, res) =>{
    try {
        const categories = await Category.find()
            .populate('parent_category_id', 'category_name');
        
        res.status(200).json({ data: categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }

}


const getCategoryById = async(req, res) =>{
    try {
        const {id} = req.params;

        const category = await Category.findById(id)
            .populate('parent_category_id', 'category_name');

        if(!category)
            return res.status(404).send({message: "Category not found"});

        res.status(200).send({ data: category });
    } catch (error) {
        res.status(500).json({ message: "Error fetching category", error: error.message });
    }

}


const updateCategory = async(req, res) =>{
    try {
        const {id} = req.params;
        const{category_name, parent_category_id} = req.body;

        if(parent_category_id){
            const parentExists = await Category.findById(parent_category_id);

            if(!parentExists){
                return res.status(404).send({message: "Parent category not found"});
            }
        }

        const updateCategory = await Category.findByIdAndUpdate(
            id, 
            {category_name, parent_category_id},
            {new: true}
        );

        if(!updateCategory)
            return res.status(404).send({message: "Category not found"});

        res.status(200).json({ message: "Category updated successfully", data: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error: error.message });
    }
}


const deleteCategory = async(req, res )=>{
    try {
        const {id} = req.params;

        const category = await Category.findByIdAndDelete(id);
        if(!category)
            return res.status(404).send({message: "Category not found"});
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error: error.message });
    }
}



module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
}