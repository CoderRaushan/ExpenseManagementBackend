import Expense from "../models/ExpenseModel.js";
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
  const {_id, item, cost, category, date } = req.body;
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
      return res.status(404).send('Expense not found');
    }
    return res
      .status(201)
      .json({ message: "Item Edited Successfully!", expense});
  } catch (error) {
    console.error("Item Edit error:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

export const GetExpense = async(req, res) => {
  try {
    const ExpenseData=await Expense.find({});
    return res.status(200).json(ExpenseData); 
  } catch (err) {
    return res.status(403).json({ error: "GetExpense error" });
  }
};
