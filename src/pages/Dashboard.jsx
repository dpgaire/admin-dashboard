import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  FolderOpen,
  Layers,
  FileText,
} from "lucide-react";

import LoadingSpinner from "@/components/LoadingSpinner";

const Dashboard = () => {
  let isLoadingStats = false;

  // const { data: stats, isLoading: isLoadingStats } = useQuery({
  //   queryKey: ["dashboardStats"],
  //   queryFn: async () => {
  //     try {
  //       const response = await statsAPI.getAll();
  //       return response.data;
  //     } catch (error) {
  //       console.error("Error fetching stats:", error);
  //       toast.error("Failed to load dashboard statistics");
  //       return { users: 0, categories: 0, subcategories: 0, items: 0 };
  //     }
  //   },
  // });


  const statCards = [
    {
      title: "Blogs",
      value: 5,
      icon: Users,
      description: "Registered users in the system",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Projects",
      value: 5,
      icon: FolderOpen,
      description: "Main content categories",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Skills",
      value: 6,
      icon: Layers,
      description: "Content subcategories",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Queries",
      value: 7,
      icon: FileText,
      description: "Total content items",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (isLoadingStats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold ">Dashboard</h1>
        <p className="mt-2">Welcome to Admin Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold ">{card.value}</div>
                <p className="text-xs  mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
