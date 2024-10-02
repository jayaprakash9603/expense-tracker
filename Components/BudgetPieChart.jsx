import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";

// Fetch expenses data
const fetchData = async () => {
  const response = await axios.get("http://localhost:3000/fetch-expenses");
  return response.data;
};

const CombinedCharts = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    const processExpenses = async () => {
      const data = await fetchData();

      // Process data for bar chart
      const monthlyData = {};
      let totalGains = 0;
      let totalLosses = 0;

      data.forEach(({ date, expense }) => {
        const month = format(new Date(date), "MMM yyyy");

        // Initialize monthly data structure
        if (!monthlyData[month]) {
          monthlyData[month] = { gains: 0, losses: 0 };
        }

        if (expense.type === "gain" && expense.paymentMethod === "cash") {
          monthlyData[month].gains += expense.netAmount;
          totalGains += expense.netAmount;
        } else if (
          expense.type === "loss" &&
          expense.paymentMethod === "cash"
        ) {
          monthlyData[month].losses += Math.abs(expense.netAmount);
          totalLosses += Math.abs(expense.netAmount);
        }
      });

      // Convert to array format for bar chart
      const barChartData = Object.keys(monthlyData).map((month) => ({
        name: month,
        gains: monthlyData[month].gains,
        losses: monthlyData[month].losses,
      }));

      // Pie chart data
      const pieChartData = [
        { name: "Total Gains", value: totalGains },
        { name: "Total Losses", value: totalLosses },
      ];

      setBarChartData(barChartData);
      setPieChartData(pieChartData);
    };

    processExpenses();
  }, []);

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div>
      <h1>Combined Charts Example</h1>

      <h2>Monthly Gains and Losses (Bar Chart)</h2>
      <BarChart
        width={600}
        height={300}
        data={barChartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="gains" fill="#82ca9d" name="Gains" />
        <Bar dataKey="losses" fill="#8884d8" name="Losses" />
      </BarChart>

      <h2>Total Gains and Losses (Pie Chart)</h2>
      <PieChart width={400} height={400}>
        <Pie
          data={pieChartData}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {pieChartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CombinedCharts;
