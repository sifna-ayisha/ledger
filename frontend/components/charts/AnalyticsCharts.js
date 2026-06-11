"use client";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const colors = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#0891b2"];

export function SaleExpenseBarChart({ data }) {
  return <div className="card h-80"><h2 className="mb-4 font-bold">Monthly Sale vs Expense</h2><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="credit" fill="#16a34a" /><Bar dataKey="expense" fill="#dc2626" /></BarChart></ResponsiveContainer></div>;
}

export function BalanceTrendChart({ data }) {
  return <div className="card h-80"><h2 className="mb-4 font-bold">Monthly Balance Trend</h2><ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="balance" stroke="#2563eb" strokeWidth={2} /></LineChart></ResponsiveContainer></div>;
}

export function ExpensePieChart({ data }) {
  return <div className="card h-80"><h2 className="mb-4 font-bold">Expense Categories</h2><ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="_id" outerRadius={95} label>{data?.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>;
}
