const Order = require("../Models/Order");
const Product = require("../Models/Product");

const cashierController = {
  getProducts: async (req, res) => {
    try {
      const shopId = req.shopId;
      if (!shopId) {
        return res.status(400).send({ message: "Please provide shop name" });
      }

      const products = await Product.find({ shop_id: shopId });
      res.status(200).send(products);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  getOrders: async (req, res) => {
    try {
      const { shopId, branchId } = req;
      if (!shopId || !branchId) {
        return res.status(400).send({ message: "Please provide ids" });
      }

      const orders = await Order.find({ shop_id: shopId, branch_id: branchId });

      res.status(200).send(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  getActiveOrders: async (req, res) => {
    try {
      const { shopId, branchId } = req;
      if (!shopId || !branchId) {
        return res.status(400).send({ message: "Please provide ids" });
      }

      const orders = await Order.find({
        shop_id: shopId,
        branch_id: branchId,
        status: "pending",
      });

      res.status(200).send(orders);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  addOrder: async (req, res) => {
    try {
      const { shopId, branchId } = req;
      if (!shopId || !branchId) {
        return res.status(400).send({ message: "Please provide ids" });
      }

      const {
        products,
        total,
        customer_name,
        payment_method,
        order_type,
        tax,
        discount,
        address,
      } = req.body;

      if (
        !products ||
        !total ||
        !customer_name ||
        !payment_method ||
        !order_type ||
        !tax ||
        !discount ||
        !address
      ) {
        return res
          .status(400)
          .send({ message: "Please provide all required fields" });
      }

      const cart = products.map((product) => {
        return {
          product_id: product.product_id,
          product_name: product.product_name,
          quantity: product.quantity,
          price: product.price,
        };
      });

      const order = new Order({
        cart,
        total,
        customer_name,
        payment_method,
        order_type,
        tax,
        discount,
        address,
        shop_id: shopId,
        branch_id: branchId,
      });

      await order.save();

      res.status(200).send({ message: "Order placed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  completeOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      if (!orderId) {
        return res.status(400).send({ message: "Please provide order id" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }

      order.status = "completed";
      await order.save();

      res.status(200).send({ message: "Order completed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  cancelOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      if (!orderId) {
        return res.status(400).send({ message: "Please provide order id" });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).send({ message: "Order not found" });
      }

      order.status = "cancelled";
      await order.save();

      res.status(200).send({ message: "Order cancelled successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = cashierController;