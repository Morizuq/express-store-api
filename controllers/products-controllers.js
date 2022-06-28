const Product = require("../models/product-model");

//controller for creating our product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ msg: "something went wrong" });
  }
};

//controller for getting all our products
const getProducts = async (req, res) => {
  try {
    const { featured, name, company, sort, fields, numericFilters } = req.query;
    const queryObject = {};

    //if query is 'featured'
    if (featured) {
      queryObject.featured = featured === true ? "true" : "false";
    }
    //if query is 'company'
    if (company) {
      queryObject.company = company;
    }
    //if query is 'name'
    if (name) {
      queryObject.name = { $regex: name, $options: "i" };
    }
    //f query is 'numericFilters'
    if (numericFilters) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };

      const regEx = /\b(<|>|>=|=|<|<=)\b/g;
      let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );

      const options = ["price", "rating"];
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(fields)) {
          queryObject[field] = { [operator]: Number(value) };
        }
      });
    }

    let result = Product.find(queryObject);
    //if query is 'sort
    if (sort) {
      const sortList = sort.split(",").join(" ");
      result = result.sort(sortList);
    } else {
      result = result.sort("createdAt");
    }
    //if query is 'fields/select'
    if (fields) {
      const fieldsList = fields.split(",").join(" ");
      result = result.select(fieldsList);
    }

    //For pagination purposes
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const products = await result;
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//controller for getting a single product
const getProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findById({ _id: productId });
    if (!product) {
      res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//controller for updating a product
const updateProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!product) {
      res.status(404).json({ msg: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//controller for deleting a product
const deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOneAndDelete({ _id: productId });
    if (!product) {
      res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ task: null, status: "Sucess" });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
