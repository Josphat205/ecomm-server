import express from "express";
import ProductModel from "../models/Products.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { category, name, description, price, image, quantity } = req.body;
  const newProduct = new ProductModel({
    category,
    name,
    description,
    price,
    image,
    quantity
  });
  try {
    const product = await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


export { router as productRouter };
