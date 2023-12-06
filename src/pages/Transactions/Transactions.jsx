import React, { useEffect, useState } from "react";
import "./Transactions.css";
import addIcon from "../../images/add-icon.png";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';

import TransactionsPagination from "./Paginagion";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Transactions() {
  const [selectedButton, setSelectedButton] = useState(1);
  const [balance, setBalance] = useState(0);
  const [incomes, setIncomes] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showForm2, setShowForm2] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [categoriesIncome, setCategoriesIncome] = useState(1);
  const [amountIncome, setAmountIncome] = useState("");
  const [descriptionIncome, setDescriptionIncome] = useState("");

  const [categoriesExpense, setCategoriesExpense] = useState("1");
  const [amountExpense, setAmountExpense] = useState("");
  const [descriptionExpense, setDescriptionExpense] = useState("");

  const [userID, setUserID] = useState("");

  const totalTransactions = transactions.length;
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchTransactions = async () => {
    const response = await axios.get(
      "http://localhost:4000/api/transactions/transaction",
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setTransactions(response.data);
  };

  const fetchCategories = async () => {
    const response = await axios.get(
      "http://localhost:4000/api/categories/category",
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setCategories(response.data);
  };

  const fetchCompanies = async () => {
    const response = await axios.get(
      "http://localhost:4000/api/companies/balance",
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setBalance(response.data.balance);
  };

  const showFormHandler = () => {
    setShowForm(true);
  };

  const hideFormHandler = () => {
    setShowForm(false);
  };

  const showFormHandler2 = () => {
    setShowForm2(true);
  };

  const hideFormHandler2 = () => {
    setShowForm2(false);
  };

  const addIncomesHandler = async () => {
    try {
      let date = new Date();
      let type = 1;

      if (
        !amountIncome ||
        !date ||
        !descriptionIncome ||
        !userID ||
        !categoriesIncome ||
        !type
      ) {
        console.error("Some required fields are missing.");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/transactions/transaction",
        {
          amount: amountIncome,
          data: date,
          description: descriptionIncome,
          user_id: userID,
          category_id: categoriesIncome,
          transaction_type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDescriptionIncome("");
      setAmountIncome("");
      alert("Transactions added successfully");
      console.log(response.data);
      fetchTransactions();
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  const addExpensesHandler = async () => {
    try {
      let date = new Date();
      let type = 0;

      if (
        !amountExpense ||
        !date ||
        !descriptionExpense ||
        !userID ||
        !categoriesExpense
      ) {
        console.error("Some required fields are missing.");
        return;
      }

      const response = await axios.post(
        "http://localhost:4000/api/transactions/transaction",
        {
          amount: amountExpense,
          data: date,
          description: descriptionExpense,
          user_id: userID,
          category_id: categoriesExpense,
          transaction_type: type,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDescriptionExpense(" ");
      setAmountExpense(" ");
      alert("Transactions added successfully");
    } catch (error) {
      console.error("Error adding expense:", error);
    }
    fetchTransactions();
  };

  const calculateIncomes = async () => {
    let sum = 0;
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    const monthDaysAgo = new Date();
    const yearDaysAgo = new Date();

    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    monthDaysAgo.setDate(currentDate.getDate() - 30);
    yearDaysAgo.setDate(currentDate.getDate() - 365);

    if (selectedButton === 1) {
      for (let i = 0; i < transactions.length; i++) {
        let transactionDate = new Date(transactions[i].data);

        if (
          transactions[i].transaction_type &&
          transactionDate >= sevenDaysAgo &&
          transactionDate <= currentDate
        ) {
          sum += transactions[i].amount;
        }
      }
    }

    if (selectedButton === 2) {
      for (let i = 0; i < transactions.length; i++) {
        let transactionDate = new Date(transactions[i].data);

        if (
          transactions[i].transaction_type &&
          transactionDate >= monthDaysAgo &&
          transactionDate <= currentDate
        ) {
          sum += transactions[i].amount;
        }
      }
    }

    if (selectedButton === 3) {
      for (let i = 0; i < transactions.length; i++) {
        let transactionDate = new Date(transactions[i].data);

        if (
          transactions[i].transaction_type &&
          transactionDate >= yearDaysAgo &&
          transactionDate <= currentDate
        ) {
          sum += transactions[i].amount;
        }
      }
    }

    setIncomes(sum);
  };

  const calculateExpenses = async () => {
    let sum = 0;
    const currentDate = new Date();
    const sevenDaysAgo = new Date();
    const monthDaysAgo = new Date();
    const yearDaysAgo = new Date();

    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    monthDaysAgo.setDate(currentDate.getDate() - 30);
    yearDaysAgo.setDate(currentDate.getDate() - 365);

    if (selectedButton === 1) {
      for (let i = 0; i < transactions.length; i++) {
        let transactionDate = new Date(transactions[i].data);

        if (
          !transactions[i].transaction_type &&
          transactionDate >= sevenDaysAgo &&
          transactionDate <= currentDate
        ) {
          sum += transactions[i].amount;
        }
      }
    }

    if (selectedButton === 2) {
      for (let i = 0; i < transactions.length; i++) {
        let transactionDate = new Date(transactions[i].data);

        if (
          !transactions[i].transaction_type &&
          transactionDate >= monthDaysAgo &&
          transactionDate <= currentDate
        ) {
          sum += transactions[i].amount;
        }
      }
    }

    if (selectedButton === 3) {
      for (let i = 0; i < transactions.length; i++) {
        let transactionDate = new Date(transactions[i].data);

        if (
          !transactions[i].transaction_type &&
          transactionDate >= yearDaysAgo &&
          transactionDate <= currentDate
        ) {
          sum += transactions[i].amount;
        }
      }
    }

    setExpenses(sum);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    setUserID(decoded.id);

    fetchCompanies();
    calculateIncomes();
    fetchCategories();
    fetchTransactions();
  }, []);

  useEffect(() => {
    calculateIncomes();
    calculateExpenses();
    fetchCompanies();
  }, [transactions, selectedButton]);
  console.log(categoriesIncome);

  return (
    <>
      <div className="button-container-transaction">
        <button
          className={
            selectedButton === 1 ? "selected-transaction" : "button-transaction"
          }
          onClick={() => setSelectedButton(1)}
        >
          Week
        </button>
        <button
          className={
            selectedButton === 2 ? "selected-transaction" : "button-transaction"
          }
          onClick={() => setSelectedButton(2)}
        >
          Month
        </button>
        <button
          className={
            selectedButton === 3 ? "selected-transaction" : "button-transaction"
          }
          onClick={() => setSelectedButton(3)}
        >
          Year
        </button>
      </div>
      <div className="first-line-transaction">
        <div className="myBalecence-transaction">
          <p className="myBalence-txt-transaction">My Balance</p>
          <p className="myBalence-txt-value-transaction">${balance}</p>
        </div>
        <div className="incomes-transaction">
          <p className="incomes-txt-transaction">Incomes</p>
          <p className="incomes-txt-value-transaction">${incomes}</p>
          <a
            href="#"
            className="add-incomes-transaction"
            onClick={showFormHandler}
          >
            <img
              src={addIcon}
              className="add-icon-transction"
              alt="Add Income"
            />
            <p>
              Add new income
              <br />
              <p> Create a new income</p>
            </p>
          </a>
        </div>
        <div className="expenses-transaction">
          <p className="expenses-txt-transaction">Expenses</p>
          <p className="expenses-txt-value-transaction">${expenses}</p>
          <a
            href="#"
            className="add-expenses-transaction"
            onClick={showFormHandler2}
          >
            <img
              src={addIcon}
              className="add-icon-transction"
              alt="Add Expense"
            />
            <p>
              Add new expense
              <br />
              <p> Create a new expense</p>
            </p>
          </a>
        </div>
      </div>

      <div className="second-line-transaction">
        <div className="chart-container">
          <div className="first-line-chart-container">
            <p className="chart-description">
              Incomes and expenses by categories
            </p>
            <select>
              <option>Expenses</option>
              <option>Incomes</option>
            </select>
          </div>
          <Pie
            data={{
              labels: ["Food", "Rent", "Marketing", "Salary"],
              datasets: [
                {
                  label: "categories",
                  data: [200, 300, 1300, 200],
                  backgroundColor: ["#421C5F", "#B293D8", "#D694EE"],
                  borderColor: "white",
                },
              ],
            }}
            options={{
              responsive: true,
            }}
          />
        </div>
        <div className="Report-Recent-Transactions transaction-table">
          <p className="Report-Recent-Transactions-Header">
            {" "}
            Recent transactions
          </p>
          <p className="Report-Recent-Transactions-SubHeader">
            {" "}
            Check the last transactions in your account
          </p>
          <table className="Report-Recent-Transactions-Table transaction-table-table">
            <thead>
              <tr className="Report-Recent-Transactions-Table-Header">
                <th>Category</th>
                <th>Type</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="Report-Recent-Transactions-Table-Row"
                >
                  <td>{transaction.category.name}</td>
                  <td>{transaction.transaction_type ? "Income" : "Expense"}</td>
                  <td>{transaction.data}</td>
                  <td>${transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <TransactionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="pagination-transactions"
          />
        </div>
      </div>
      {showForm && (
        <div className="expense-income-form">
          <p className="title">
            <strong>Add new Income</strong>
          </p>
          <select onChange={(event) => setCategoriesIncome(event.target.value)}>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            onChange={(event) => setAmountIncome(event.target.value)}
            value={amountIncome}
          />
          <input
            type="text"
            placeholder="Description"
            onChange={(event) => setDescriptionIncome(event.target.value)}
            value={descriptionIncome}
          />

          <button onClick={hideFormHandler}>Cancel</button>
          <button onClick={addIncomesHandler}>Add</button>
        </div>
      )}

      {showForm2 && (
        <div className="expense-income-form">
          <p className="title">
            <strong>Add new Expense</strong>
          </p>
          <select
            onChange={(event) => setCategoriesExpense(event.target.value)}
          >
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            onChange={(event) => setAmountExpense(event.target.value)}
            value={amountExpense}
          />
          <input
            type="text"
            placeholder="Description"
            onChange={(event) => setDescriptionExpense(event.target.value)}
            value={descriptionExpense}
          />

          <button onClick={hideFormHandler2}>Cancel</button>
          <button onClick={addExpensesHandler}>Add</button>
        </div>
      )}
    </>
  );
}
