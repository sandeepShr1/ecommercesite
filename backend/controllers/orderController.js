const Order = require("../model/orderModel");
const User = require("../model/userModel");

const Product = require("../model/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");

// create a order
exports.createOrder = catchAsyncError(async (req, res, next) => {
      const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
      } = req.body;
      console.log(
            { shippingInfo },
            { orderItems },
            { paymentInfo },
            { itemsPrice },
            { taxPrice },
            { shippingPrice },
            { totalPrice }
      );

      const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id,
      });
      let itemss = {};
      orderItems.map((i) =>
            Object.entries(i).forEach(([key, value]) => (itemss[`${key}`] = value))
      );
      const message = `Thank you for ordering.
      Your total is:-  Rs. ${totalPrice}\n\n
      If you have not ordered then, please ignore it \n\n
      Your order details: \n
      Items:\n
      Name: ${itemss.name} \n
      Quantity: ${itemss.quantity} \n
      Price: ${itemss.price} \n\n
      Size: ${itemss.size} \n\n
      Your shipping address details: 
      Address: ${shippingInfo.address} \n
      Phone: ${shippingInfo.phoneNo} \n
      `;

      try {
            await sendEmail({
                  email: req.user.email,
                  subject: `Order successfully `,
                  message,
            });
            res.status(200).json({
                  success: true,
                  message: `Email sent to ${req.user.email} successfully`,
            });
      } catch (error) {
            return next(new ErrorHandler(error.message, 500));
      }
      res.status(200).json({
            success: true,
            order,
      });
});

// get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
      const order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
      );

      if (!order) {
            return next(new ErrorHander("Order not found with this Id", 404));
      }

      res.status(200).json({
            success: true,
            order,
      });
});

// get logged in user  Orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
      const orders = await Order.find({ user: req.user._id });

      res.status(200).json({
            success: true,
            orders,
      });
});

// get all  Orders admin
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
      const orders = await Order.find();

      let totalAmount = 0;
      orders.forEach((order) => {
            totalAmount += order.totalPrice;
      });

      res.status(200).json({
            success: true,
            totalAmount,
            orders,
      });
});

// get  Order status admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
      const order = await Order.findById(req.params.id);
      const userMail = await User.findById(order?.user);

      if (!order) {
            return next(new ErrorHandler("Product not found!", 404));
      }

      if (order.orderStatus === "Delivered") {
            return next(new ErrorHandler("You have already delivered this order", 400));
      }

      if (req.body.status === "Shipped") {
            order.orderItems.forEach(async (o) => {
                  await updateStock(o.product, o.quantity);
            });
            const message = `Thank you for ordering.
      If you have not ordered then, please ignore it \n\n
      Your order has been shipped.
      `;

            try {
                  await sendEmail({
                        email: userMail.email,
                        subject: `Order shipped successfully `,
                        message,
                  });
                  res.status(200).json({
                        success: true,
                        message: `Email sent to ${req.user.email} successfully`,
                  });
            } catch (error) {
                  return next(new ErrorHandler(error.message, 500));
            }

      }
      order.orderStatus = req.body.status;

      if (req.body.status === "Delivered") {
            order.deliveredAt = Date.now();
            const message = `Thank you for ordering.
      If you have not ordered then, please ignore it \n\n
      Your order has been delivered.
      
      `;

            try {
                  await sendEmail({
                        email: userMail.email,
                        subject: `Order delivered successfully `,
                        message,
                  });
                  res.status(200).json({
                        success: true,
                        message: `Email sent to ${req.user.email} successfully`,
                  });
            } catch (error) {
                  return next(new ErrorHandler(error.message, 500));
            }

      }
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
            success: true,
            order,
      });
});

async function updateStock(id, quantity) {
      const product = await Product.findById(id);

      product.stock -= quantity;

      await product.save({ validateBeforeSave: false });
}

// delete Orders admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
      const order = await Order.findById(req.params.id);

      if (!order) {
            return next(new ErrorHandler("Product not found!", 404));
      }
      await order.remove();
      res.status(200).json({
            success: true,
      });
});
