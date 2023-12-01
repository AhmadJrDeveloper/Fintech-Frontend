import React from 'react'
import { Line } from "react-chartjs-2";

export default function NavBar() {
  return (
    <div>
        <Line
       data={{
       // x-axis label values
       labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"],
       datasets: [
          {
              label: "# of Calories Lost",
              // y-axis data plotting values
              data: [200, 300, 1300, 520, 2000, 350,150],
              fill: false,
              borderWidth:4,
              backgroundColor: "rgb(255, 99, 132)",
              borderColor:'green',
              responsive:true
            },
          ],
        }}
      />          
    </div>
  )
}
