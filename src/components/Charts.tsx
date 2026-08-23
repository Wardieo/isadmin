import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from './ui'
import { peso } from '../types'

const colors = ['#44352b', '#9f806b', '#cfb8a6', '#e4d8cd']
const tooltipStyle = { border: '1px solid #e8dfd7', borderRadius: 10, boxShadow: '0 8px 24px rgba(50,38,30,.08)', fontSize: 12 }

export function RevenueChart({ data, title = 'Revenue trend' }: { data: Array<{ label: string; revenue: number }>; title?: string }) {
  return <Card className="chart-card"><div className="section-heading"><div><h2>{title}</h2><p>Collected revenue from paid bookings</p></div><span className="legend"><i /> Paid revenue</span></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><defs><linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#44352b" stopOpacity={.24}/><stop offset="100%" stopColor="#44352b" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#eee7e0" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#8a817a', fontSize: 11 }}/><YAxis hide/><Tooltip contentStyle={tooltipStyle} formatter={(value) => peso(Number(value))}/><Area type="monotone" dataKey="revenue" stroke="#44352b" strokeWidth={2} fill="url(#revenue)"/></AreaChart></ResponsiveContainer></div></Card>
}

export function StatusChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return <Card className="chart-card"><div className="section-heading"><div><h2>Booking status</h2><p>All bookings by current status</p></div></div><div className="donut-wrap"><div className="chart chart--donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={78} paddingAngle={3}>{data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer></div><div className="donut-legend">{data.map((item, i) => <div key={item.name}><i style={{ background: colors[i] }}/><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div></Card>
}

export function PackageChart({ data }: { data: Array<{ name: string; count: number }> }) {
  return <Card className="chart-card"><div className="section-heading"><div><h2>Most-booked packages</h2><p>Booking volume by package</p></div></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 10 }}><CartesianGrid stroke="#eee7e0" horizontal={false}/><XAxis type="number" hide/><YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} tick={{ fill: '#716a64', fontSize: 11 }}/><Tooltip contentStyle={tooltipStyle}/><Bar dataKey="count" fill="#9f806b" radius={[0, 5, 5, 0]} barSize={14}/></BarChart></ResponsiveContainer></div></Card>
}
