const Customer = require("../models/Customer");
const Cart = require("../models/Cart");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Product = require("../models/Products");

const app = express();
app.use(cookieParser());

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Customer's Registration & Create Customer
const registerCustomer = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, status } = req.body;
    console.log(req.body);

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.send({ success: false, msg: "Passwords do not match" });
    }
    const customer = await Customer.create({
      username: username,
      email: email,
      password: password,
      status: status,
    });
    return res.send({
      success: true,
      msg: "Customer added successfully",
      customer,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Customer's Login
const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.send({ success: false, msg: "Please fill all required fields" });
  }

  try {
    // Check if the customer exists
    const customer = await Customer.findOne({ email });
    console.log(customer);

    if (!customer) {
      return res.send({ success: false, msg: "User not found" });
    }

    // Check if the password is correct
    const passwordIsCorrect = await bcrypt.compare(password, customer.password);

    if (passwordIsCorrect) {
      // Generate Token
      const token = generateToken(customer._id);

      // Fetch the customer's cart items
      const cart = await Cart.findOne({ CustomerId: customer._id });

      // Send HTTP-only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), // 1 day
        sameSite: "none",
        secure: true,
      });

      return res.send({
        success: true,
        msg: "Successfully LoggedIn",
        token: token,
        cart: cart,
      });
    } else {
      return res.send({ success: false, msg: "Invalid user data" });
    }
  } catch (err) {
    // Handle any errors that might occur during await operations
    return res.send({ success: false, msg: "Server error" });
  }
};

// Customer's Logout
const logoutCustomer = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0), // 1 day
    sameSite: "none",
    secure: true,
  });
  return res.send({
    message: "Successfully logged out",
  });
};

// Get All Customers
const getCustomers = async (req, res) => {
  const customers = await Customer.find({ deleted: false }).lean();
  if (customers) {
    res.send({ customers });
  } else {
    res.send({ success: false, msg: "User not found" });
  }
};

// Get LoggedIn Customer
const getLoggedInCustomer = async (req, res) => {
  let customerId = req.body.id;
  const customer = await Customer.findById(customerId);

  if (customer) {
    return res.send({
      success: true,
      customer,
    });
  } else {
    return res.send({ success: false, msg: "User not found" });
  }
};

// Get Specific Cutomer By Id
const getSpecificCustomer = async (req, res) => {
  try {
    let customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (customer) {
      return res.send({
        success: true,
        customer,
      });
    } else {
      return res.send({ success: false, msg: "User not found" });
    }
  } catch (error) {
    // Handle any errors that might occur during the execution of the function
    return res.send({ success: false, msg: "Internal Server Error" });
  }
};

// Get LoggedIn Status
const loginStatus = async (req, res) => {
  const token = req.body.token;
  // console.log(token);
  if (!token) {
    return res.send({ success: false });
  }

  // Verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.send({ success: true });
  } else {
    return res.send({ success: false });
  }
};

// Update Customer
const updateCustomer = async (req, res) => {
  try {
    const CustomerId = req.body.id;
    console.log(CustomerId);
    const customer = await Customer.findById(CustomerId);
    if (!customer) {
      return res.send({ error: "Id not found" });
    }
    const updateData = {
      username: req.body.username,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      orderHistory: req.body.orderHistory,
      paymentMethods: req.body.paymentMethods,
      status: req.body.status,
      deleted: req.body.deleted,
      updatedAt: Date.now(),
    };

    await Customer.findByIdAndUpdate(CustomerId, updateData);
    const updatedRecord = await Customer.findById(CustomerId);
    res.send({
      success: true,
      msg: "Customer updated successfully",
      updatedRecord,
    });
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Update Password
const updateCustomerPassword = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    const { oldPassword, newPassword } = req.body;
    console.log(req.body);
    if (!customer) {
      return res.send({
        success: false,
        msg: "User not found , Please signup",
      });
    }
    // Validate
    if (!oldPassword || !newPassword) {
      return res.send({
        success: false,
        msg: "Please add old and new password",
      });
    }

    // check if old password matches password in DB
    const passwordMatches = await bcrypt.compare(
      oldPassword,
      customer.password
    );
    if (!passwordMatches) {
      return res.send({ success: false, msg: "Old password is incorrect" });
    }

    if (oldPassword === newPassword) {
      return res.send({
        success: false,
        msg: "New Password cannot be same as Old password",
      });
    } else {
      const secPass = await bcrypt.hash(newPassword, 10);
      await Customer.findByIdAndUpdate(customerId, {
        password: secPass,
      });
      return res.send({ success: true, msg: "Password changed successfully" });
    }
  } catch (error) {
    return res.send({ error: error.message });
  }
};

// Forget Password
const forgotCustomerPassword = async (req, res) => {
  let { email } = req.body;
  const customer = await Customer.findOne({ email });
  if (!customer) {
    res.send({ success: false, msg: "User does not exist" });
  }
  // Delete Token if it exist in DB
  await Token.findOneAndDelete({ userId: customer.id });

  // Create Rest Token
  let resetToken = crypto.randomBytes(32).toString("hex") + customer._id;
  console.log(resetToken);

  // Hash token before saving to db
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // /Save token to DB
  await new Token({
    userId: customer.id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 Minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

  // Reset Email
  const message = `
    <h2>Hello ${customer.username}</h2>
    <p>Please use this URL below to reset your password</p>
    <p>This reset link is valid for 30 Minutes</p>
  
  
    <a href=${resetUrl} clicktraking = off> ${resetUrl}</a>
  
    <p>Regards .... </p>
    `;
  const subject = "Password reset request";
  const send_to = customer.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.send({ success: true, msg: "Reset Email Sent" });
  } catch (error) {
    res.send(error);
  }
};

// Rset Customers Password
const resetCustomerPassword = async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // Hash token  then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find Token in DB
  const customerToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!customerToken) {
    res.send("Invalid or Expired Token");
  }

  // Find User
  const customer = await Customer.findOne({ _id: customerToken.userId });
  customer.password = password;
  // console.log(customer);
  customer.save();

  res.send({
    success: true,
    msg: "Password Reset Successful,Please Login",
  });
};

// Delete Specific Customer
const DeleteCustomer = async (req, res, next) => {
  try {
    const customerId = req.body.id;
    const record = await Customer.findByIdAndUpdate(
      customerId,
      {
        deleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!record) {
      return res.send({ success: true, message: "record not found" });
    }

    return res.send({ success: true, message: "Successfully Deleted" });
  } catch (error) {
    return res.send({ success: false, error: error.message });
  }
};

const addToCart = async (req, res) => {
  const CustomerId = req.params.id;
  const { productId, quantity } = req.body;

  try {
    // Find the customer by ID and populate the cartItems field with product details
    const customer = await Customer.findById(CustomerId).populate(
      'cartItems.product'
    );

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: 'Customer not found',
      });
    }

    // Check if the product already exists in the cart
    const existingCartItem = customer.cartItems.find(
      (item) => item.product._id.toString() === productId
    );

    if (existingCartItem) {
      // If the product already exists in the cart, update the quantity
      existingCartItem.quantity += parseInt(quantity);
    } else {
      // If the product does not exist in the cart, add it as a new item
      const product = await Product.findById(productId); // Replace 'Product' with your actual model name

      if (!product) {
        return res.status(404).json({
          success: false,
          msg: 'Product not found',
        });
      }

      customer.cartItems.push({
        product: product,
        quantity: parseInt(quantity),
      });
    }

    // Save the updated cart
    await customer.save();

    res.json({
      success: true,
      msg: 'Cart updated successfully',
      updatedCart: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: 'Internal Server Error',
    });
  }
};


// Remove a product from the customer's cart
const removeFromCart = async (req, res) => {
  const customerId = req.params.id; // Customer ID
  const {productId} = req.body; // Product ID

  try {
    // Find the customer by ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        success: false,
        msg: 'Customer not found',
      });
    }

    // Check if the product exists in the cart
    const cartItemIndex = customer.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: 'Product not found in the cart',
      });
    }

    // Remove the product from the cart
    customer.cartItems.splice(cartItemIndex, 1);

    // Save the updated cart
    await customer.save();

    res.json({
      success: true,
      msg: 'Product removed from the cart successfully',
      updatedCart: customer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: 'Internal Server Error',
    });
  }
};



module.exports = {
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomers,
  getLoggedInCustomer,
  getSpecificCustomer,
  loginStatus,
  updateCustomerPassword,
  forgotCustomerPassword,
  resetCustomerPassword,
  updateCustomer,
  DeleteCustomer,
  addToCart,
  removeFromCart
};
