import { json } from "express";
import Expense from "../models/ExpenseModel.js";
import redis from "redis"
// console.log(process.env.REDIS_URI);
const redisClient = redis.createClient({
  url: "redis://redis-16422.c10.us-east-1-4.ec2.redns.redis-cloud.com:16422",
  password:"WzGQfUjCYvGIu0v07RNBrSmDNa8VGmXf",
});
 redisClient
  .connect()
  .then(async() => {
    console.log("Redis connected successfully!");
    const ExpenseData = await Expense.find({});
    await redisClient.set('expensedata', JSON.stringify(ExpenseData)); 
    // const data=await redisClient.get("expensedata");
    // console.log(JSON.parse(data));
  })
  .catch((err) => {
    console.error("Error connecting to Redis:", err);
  });
export default redisClient;
export const AddExpense = async (req, res) => {
  const { item, cost, category, date } = req.body;
  try {
    if (!item || !cost || !category || !date) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const newExpense = new Expense({
      item,
      cost,
      category,
      date,
    });
    await newExpense.save();
    return res
      .status(201)
      .json({ message: "Item Added Successfully!", newExpense });
  } catch (error) {
    console.error("Item Added error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};
export const EditExpense = async (req, res) => {
  const { _id, item, cost, category, date } = req.body;
  try {
    if (!item || !cost || !category || !date) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const expense = await Expense.findByIdAndUpdate(
      _id,
      { item, cost, category, date },
      { new: true } // Return the updated expense
    );
    if (!expense) {
      return res.status(404).send("Expense not found");
    }
    return res
      .status(201)
      .json({ message: "Item Edited Successfully!", expense });
  } catch (error) {
    console.error("Item Edit error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const GetExpense = async (req, res) => {
  try {
    const cachedData = await redisClient.get("expensedata");
    if (cachedData) {
      console.log("redis se data mil gya");
      return res.status(200).json(JSON.parse(cachedData));
    }
    const ExpenseData = await Expense.find({});
    if (ExpenseData) {
      await redisClient.set('expensedata', JSON.stringify(ExpenseData)); 
      console.log("redis se data nahi mila")
      return res.status(200).json(ExpenseData);
    }
  } catch (err) {
    return res.status(403).json({ error: "GetExpense error" });
  }
};
