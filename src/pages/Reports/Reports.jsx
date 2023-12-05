import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

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

export default function Reports() {
  const [chartData, setChartData] = useState({});
  const [sortedTransactions, setSortedTransactions] = useState([]);

  useEffect(() => {
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJtb3N0YWZhIiwiaWF0IjoxNzAxMzQ2NDM3LCJleHAiOjE3MDM5Mzg0Mzd9.sX16NthhX8yQ6p4U8Bw8FbsgbH8TD0iyehntAGguNig';
    axios.get('http://localhost:4000/api/transactions/transaction', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then((response) => {
      console.log(response.data)
      const transactions = response.data;

      // Sort transactions by date
      const sortedTransactions = transactions.sort((a, b) => {
        const date1Obj = new Date(a.date);
        const date2Obj = new Date(b.date);
        return date1Obj - date2Obj;
      });

      // Separate incomes and expenses
      const incomes = sortedTransactions.filter(transaction => transaction.transaction_type === true);
      const expenses = sortedTransactions.filter(transaction => transaction.transaction_type === false);

      // Extract data for chart
      const chartData = {
        labels: sortedTransactions.map(transaction => transaction.date),
        datasets: [
          {
            label: 'Expenses',
            data: expenses.map(expense => expense.amount),
            fill: false,
            borderWidth: 3,
            backgroundColor: 'rgb(130, 99, 112)',
            borderColor: 'red',
          },
          {
            label: 'Incomes',
            data: incomes.map(income => income.amount),
            fill: false,
            borderWidth: 3,
            backgroundColor: 'rgb(255, 206, 86)',
            borderColor: 'blue',
          },
        ],
      };

      // Update chart data and sorted transactions
      setChartData(chartData);
      setSortedTransactions(sortedTransactions);
    })
    .catch((error) => {
      console.log(error + 'hello');
    });
  }, []);


  return (
    <>
        <div className="Report-Header">
        
        <ReportHeaderBox title="Total Number Of Transactions" subTitle="45" />
        <ReportHeaderBox title=" Average  Incomes per month" subTitle="80,000$" />
        <ReportHeaderBox title="Average Expenses  per month" subTitle="25,000$" />
        <ReportHeaderBox title="Popular Incomes category " subTitle="Markting" />
        <ReportHeaderBox title="Popular Expenses category " subTitle="Food" />
        </div>
        <div className="date-input-container">
          <label className='Report-Date-Box-Label' htmlFor="Start-Date">Start-Date</label>
          <input type="date" className='Report-Date-Box' name="Start-Date" id="Start-Date" />
          <label className='Report-Date-Box-Label' htmlFor="End-Date">End-Date</label>
           <input type="date" className='Report-Date-Box' name="End-Date" id="End-Date" />
          <input className = "Report-Date-Box-Button" type="button" value="Filter" />
        </div>

      <div className="Report-Statistics">
        <div className="Report-Chart">
          <Line
            data={chartData}
            options={{
              responsive: true,
              width: 100,
              scales: {
                x: {
                  type: 'category',
                  labels: chartData.labels,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
          <div className="Report-Recent-Transactions">
  <p className='Report-Recent-Transactions-Header'> Recent transactions</p>
  <p className='Report-Recent-Transactions-SubHeader'> Check the last transactions in your account</p>
  <table className='Report-Recent-Transactions-Table'>
    <thead>
      <tr className='Report-Recent-Transactions-Table-Header'>
        <th>Category</th>
        <th>Type</th>
        <th>Date</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr className='Report-Recent-Transactions-Table-Row'>
        <td>Anom</td>
        <td>19</td>
        <td>Male</td>
        <td>Male</td>
      </tr>
    </tbody>
  </table>
</div>
          
        </div>
      
    </>
  );
}
