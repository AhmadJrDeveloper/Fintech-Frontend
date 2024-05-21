import React from 'react';
import { useState,useEffect } from 'react';
import './Reports.css';
import axios from 'axios';
import { Line } from "react-chartjs-2";
import TransactionsPagination from '../Transactions/Paginagion';

const ReportHeaderBox = ({ title, subTitle }) => (
  <div className="Report-Header-Box">
    <p className='Report-Header-Title'>
      {title}
    </p>
    <br />
    <p className='Report-Header-SubTitle'>
      {subTitle}
    </p>
  </div>
);

export default function ReportComponent() {
  const [transactions, setTransactions] = useState([]);
  const [totalTransactions, setTotalTransactions] = useState(0); // Initialize totalTransactions
  const itemsPerPage = 7; // Move itemsPerPage declaration before its usage
  const totalPages = Math.ceil(totalTransactions / itemsPerPage); // Move totalPages after totalTransactions is defined
  const [averageIncome, setAverageIncome] = useState(0);
  const [averageExpense, setAverageExpense] = useState(0);
  const [mostCommonIncomeCategory, setMostCommonIncomeCategory] = useState('');
  const [mostCommonExpenseCategory, setMostCommonExpenseCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchData = async () => {
    try {
      const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJtb3N0YWZhIiwiaWF0IjoxNzAxMzQ2NDM3LCJleHAiOjE3MDM5Mzg0Mzd9.sX16NthhX8yQ6p4U8Bw8FbsgbH8TD0iyehntAGguNig';

      const response = await axios.get('http://localhost:4000/api/transactions/transaction', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        params: {
          startDate,
          endDate,
        },
      });

      const trans = response.data;
      setTransactions(trans);
      setTotalTransactions(trans.length);
      calculateAverage(trans);
      findMostCommonCategories(trans);
    } catch (error) {
      console.log(error + "hello");
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleDateFilter = () => {
    const startDateValue = document.getElementById('Start-Date').value;
    const endDateValue = document.getElementById('End-Date').value;

    // Check if both start and end dates are selected
    if (startDateValue && endDateValue) {
      setStartDate(startDateValue);
      setEndDate(endDateValue);
    } else {
      alert('Please select both start and end dates.');
    }
  };


  const calculateAverage = (transactions) => {
    const incomeTransactions = transactions.filter(transaction => transaction.transaction_type === true);
    const expenseTransactions = transactions.filter(transaction => transaction.transaction_type === false);

    const sumIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const sumExpense = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    const avgIncome = incomeTransactions.length > 0 ? sumIncome / incomeTransactions.length : 0;
    const avgExpense = expenseTransactions.length > 0 ? sumExpense / expenseTransactions.length : 0;

    setAverageIncome(avgIncome);
    setAverageExpense(avgExpense);
  };


  const findMostCommonCategories = (transactions) => {
    const incomeCategories = {};
    const expenseCategories = {};

    transactions.forEach(transaction => {
      const category = transaction.category.name;
      const isIncome = transaction.transaction_type === true;

      if (isIncome) {
        incomeCategories[category] = (incomeCategories[category] || 0) + 1;
      } else {
        expenseCategories[category] = (expenseCategories[category] || 0) + 1;
      }
    });

    setMostCommonIncomeCategory(findMostCommonCategory(incomeCategories));
    setMostCommonExpenseCategory(findMostCommonCategory(expenseCategories));
  };

  const findMostCommonCategory = (categories) => {
    let mostCommonCategory = '';
    let maxCount = 0;

    for (const category in categories) {
      if (categories[category] > maxCount) {
        mostCommonCategory = category;
        maxCount = categories[category];
      }
    }

    return mostCommonCategory;
  };

  return (
    <>
      <div className="Report-Header">
        
        <ReportHeaderBox title="Total Number Of Transactions" subTitle={totalTransactions} />
        <ReportHeaderBox title=" Average  Incomes" subTitle={parseInt(averageIncome)} />
        <ReportHeaderBox title="Average Expenses" subTitle={parseInt(averageExpense)} />
        <ReportHeaderBox title="Popular Incomes category " subTitle={mostCommonIncomeCategory} />
        <ReportHeaderBox title="Popular Expenses category " subTitle={mostCommonExpenseCategory}/>
        </div>
        <div className="date-input-container">
          <label className='Report-Date-Box-Label' htmlFor="Start-Date">Start-Date</label>
          <input type="date" className='Report-Date-Box' name="Start-Date" id="Start-Date" />
          <label className='Report-Date-Box-Label' htmlFor="End-Date">End-Date</label>
          <input type="date" className='Report-Date-Box' name="End-Date" id="End-Date" />
          <button className = "Report-Date-Box-Button" onClick={handleDateFilter} >Filter</button>
        </div>
        <div className="Report-Statstics">
          <div className="Report-Chart">
          
          <Line
  data={{
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "onono"],
    datasets: [
      {
        label: "Expenses",
        data: [200, 300, 1300, 520, 4000, 350, 150],
        fill: false,
        borderWidth: 3,
        backgroundColor: "rgb(130, 99, 112)",
        borderColor: 'red',
      },
      {
        label: "Incomes",
        data: [100, 200, 800, 420, 3000, 250, 120],
        fill: false,
        borderWidth: 3,
        backgroundColor: "rgb(255, 206, 86)",
        borderColor: 'blue',
      },
    ],
  }}
  options={{
    responsive: true,
    width: 100,  // Set your desired width in pixels
    scales: {
      x: {
        type: 'category',
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "onono"],
      },
      y: {
        beginAtZero: true,
      },
    },
  }}
/>




          </div>
          <div className="Report-Recent-Transactions transaction-table">
          <p className="Report-Recent-Transactions-Header">
            Recent transactions
          </p>
          <p className="Report-Recent-Transactions-SubHeader">
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
                  <td>{transaction.date}</td>
                  <td>${transaction.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <TransactionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="pagination-transactions" // Add your desired class name here
          />

        </div>
        </div>
      
    </>
  );
}