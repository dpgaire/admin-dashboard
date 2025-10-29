import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FolderOpen,
  Layers,
  FileText,
  ExternalLink,
  Eye,
  MessageSquare,
} from "lucide-react";
import { Bar, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const barChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Blogs",
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
      {
        label: "Projects",
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: "rgba(16, 185, 129, 0.5)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Blogs", "Projects", "Skills", "Feedback"],
    datasets: [
      {
        data: [125, 42, 78, 15],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(167, 139, 250, 0.5)",
          "rgba(251, 146, 60, 0.5)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(167, 139, 250, 1)",
          "rgba(251, 146, 60, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Statistics",
      },
    },
  };

  const statCards = [
    {
      title: "Blogs",
      value: 125,
      icon: Users,
      link: "/blogs",
      description: "Total number of blogs",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Projects",
      value: 42,
      icon: FolderOpen,
      link: "/projects",
      description: "Total number of projects",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Skills",
      value: 78,
      link: "/skills",
      icon: Layers,
      description: "Total number of skills",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Feedback",
      value: 15,
      link: "/contact",
      icon: FileText,
      description: "User feedback received",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const quickLinks = [
    { title: "Create New Blog", link: "/blogs" },
    { title: "Add New Project", link: "/projects" },
    { title: "Manage Skills", link: "/skills" },
    { title: "View Feedback", link: "/contact" },
  ];

  const analyticsData = [
    {
      title: "Blog Page Views",
      value: "1.2M",
      icon: Eye,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      title: "Project Views",
      value: "850K",
      icon: Eye,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Feedbacks",
      value: 15,
      icon: MessageSquare,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your Admin Dashboard. Here's a summary of your activities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{card.value}</div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Monthly Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={barChartData} options={chartOptions} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie data={pieChartData} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyticsData.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {item.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    to={link.link}
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-50 mr-4">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">New blog post published</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="p-2 rounded-lg bg-green-50 mr-4">
                  <FolderOpen className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New project added: "Admin Dashboard"</p>
                  <p className="text-sm text-gray-500">1 day ago</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-50 mr-4">
                  <Layers className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Skill updated: "Vector Database"</p>
                  <p className="text-sm text-gray-500">3 days ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;