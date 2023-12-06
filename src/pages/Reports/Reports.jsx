import React from 'react';
import { useState,useEffect } from 'react';
import './Reports.css';
import axios from 'axios';
import { Line } from "react-chartjs-2";

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
  useEffect(() => {
    // Replace 'your-auth-token' with the actual token you have
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsInJvbGUiOiJtb3N0YWZhIiwiaWF0IjoxNzAxMzQ2NDM3LCJleHAiOjE3MDM5Mzg0Mzd9.sX16NthhX8yQ6p4U8Bw8FbsgbH8TD0iyehntAGguNig';

    axios.get('http://localhost:4000/api/transactions/transaction', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error + "hello");
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
          <button className = "Report-Date-Box-Button" >Filter</button>
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