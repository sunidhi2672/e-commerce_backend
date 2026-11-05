const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Yeh line add karein

const productModel = require("./models/productmodel");

app.get("/cart/getProduct", async (req, res) => {
  const products = await productModel.find();
  res.status(200).json(products);
});

// console.log(req.body)
// try{
//const product = await productModel.create(req.body);
// res.status(201).json({
//     message: "Product added to backend cart", product: product
//  });

//     } catch (error) {
//         res.status(500).json({
//             message: "Error adding product",
//             error: error.message
//         });

app.post("/cart/decrease", async (req, res) => {
  const productdata = req.body;

  console.log(productdata);
  const decreaseCart = await productModel.findOneAndUpdate(
    { productIdNumber: productdata.productIdNumber },
    { $set: productdata },
    { returnDocument: "after" },
  );
  res
    .status(200)
    .json({ data: decreaseCart, message: "decreased succesfully" });
});

app.post("/cart/increase", async (req, res) => {
  const productdata = req.body;
  console.log(productdata);
  const increaseCart = await productModel.findOneAndUpdate(
    { productIdNumber: productdata.productIdNumber },
    { $set: productdata },
    { returnDocument: "after" },
  );
  res.status(200).json({
    data: increaseCart,
    message: "increased successfully",
  });
});

app.post("/cart/delete", async (req, res) => {
  try {
    const productdata = req.body;

    console.log(productdata);

    const deleteCart = await productModel.findOneAndDelete({
      _id: productdata._id,
    });

    if (!deleteCart) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      data: deleteCart,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// app.post("/cart/increase", async (req, res) => {
//   const increaseCart = await productModel.findOneAndUpdate(
//     { productId: productdata.productId },
//     { $set: productdata },
//     { returnDocument: "after" },
//   );
//   res
//   .status(200)
//   .json({data: increaseCart, message: "increased succesfully"});
// });

// app.post("/cart/create", async (req, res) => {
//   const productdata = req.body;
//   const existing = await productModel.find({
//     productId: productdata.productId,
//   });
//   console.log({productdata,existing});
//   if (existing) {
//     const updatedCart = await productModel.findOneAndUpdate(
//       { productId: productdata.productId },
//       { $set: productdata }, // The update operation
//       // { $set:{complete:true} },   // The update operation
//       { returnDocument: "after" }, //  Modern option replacing { new: true }
//     );

//     res.status(200).json({ data: updatedCart, message: "updated succesfully" });
//   } else {
//     const createdcart = await productModel.create({
//       productIdNumber: productdata._id,
//       title: productdata.title,
//       isNew: productdata.isNew,
//       oldPrice: productdata.oldPrice,
//       price: productdata.price,
//       discountedPrice: productdata.discountedPrice,
//       description: productdata.description,
//       category: productdata.category,
//       type: productdata.type,
//       stock: productdata.stock,
//       brand: productdata.brand,
//       size: productdata.size,
//       image: productdata.image,
//       rating: productdata.rating,
//       quantity: productdata.quantity,
//     });

//     res.status(201).json(createdcart);
//   }

//   //}

//   // res.send("ok")
// });
// app.post("/cart/create", async (req, res) => {
//   try {
//     const productdata = req.body;

//     console.log("Frontend se data:", productdata);

//     // Fake Store API ki ID
//     const productId = productdata.productIdNumber ?? productdata._id;

//     // Check product cart me already hai ya nahi
//     const existing = await productModel.findOne({
//       productIdNumber: productId,
//     });

//     console.log("Existing product:", existing);

//     if (existing) {
//       // _id ko update nahi karna
//       const updatedCart = await productModel.findOneAndUpdate(
//         {
//           productIdNumber: productId,
//         },
//         {
//           $set: {
//             title: productdata.title,
//             isNew: productdata.isNew,
//             oldPrice: productdata.oldPrice,
//             price: productdata.price,
//             discountedPrice: productdata.discountedPrice,
//             description: productdata.description,
//             category: productdata.category,
//             type: productdata.type,
//             stock: productdata.stock,
//             brand: productdata.brand,
//             size: productdata.size,
//             image: productdata.image,
//             rating: productdata.rating,
//             quantity: productdata.quantity,
//           },
//         },
//         {
//           new: true,
//         },
//       );

//       return res.status(200).json({
//         data: updatedCart,
//         message: "Cart updated successfully",
//       });
//     }

//     // Product cart me nahi hai -> new document
//     const createdCart = await productModel.create({
//       productIdNumber: productId,

//       title: productdata.title,
//       isNew: productdata.isNew,
//       oldPrice: productdata.oldPrice,
//       price: productdata.price,
//       discountedPrice: productdata.discountedPrice,
//       description: productdata.description,
//       category: productdata.category,
//       type: productdata.type,
//       stock: productdata.stock,
//       brand: productdata.brand,
//       size: productdata.size,
//       image: productdata.image,
//       rating: productdata.rating,
//       quantity: productdata.quantity || 1,
//     });

//     return res.status(201).json({
//       data: createdCart,
//       message: "Product added to cart successfully",
//     });
//   } catch (error) {
//     console.log("CREATE CART ERROR:", error);

//     return res.status(500).json({
//       message: error.message,
//     });
//   }
// });
app.post("/cart/create", async (req, res) => {
  try {
    const productdata = req.body;

    console.log("Frontend data:", productdata);

    const productId = productdata.productIdNumber || productdata._id;

    // Check existing product
    const existing = await productModel.findOne({
      productIdNumber: productId,
    });

    if (existing) {
      // Increase quantity
      existing.quantity = (existing.quantity || 0) + 1;

      await existing.save();

      return res.status(200).json({
        message: "Product quantity increased",
        data: existing,
      });
    }

    // Add new product
    const createdCart = await productModel.create({
      productIdNumber: productId,
      title: productdata.title,
      isNew: productdata.isNew,
      oldPrice: productdata.oldPrice,
      price: productdata.price,
      discountedPrice: productdata.discountedPrice,
      description: productdata.description,
      category: productdata.category,
      type: productdata.type,
      stock: productdata.stock,
      brand: productdata.brand,
      size: productdata.size,
      image: productdata.image,
      rating: productdata.rating,
      quantity: 1,
    });

    res.status(201).json({
      message: "Product added successfully",
      data: createdCart,
    });

  } catch (error) {
    console.log("Cart Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server connected to port " + PORT);
});

mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    console.log("DB connected");
  })
  .catch((e) => {
    console.log("mongoose error", e);
  });
