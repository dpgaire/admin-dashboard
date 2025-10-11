import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FolderOpen,
  Layers,
  FileText,
  MessageSquare,
  Phone,
} from "lucide-react";

import LoadingSpinner from "@/components/LoadingSpinner";
import {
  statsAPI,
  quickLinksAPI,
  userQueryAPI,
  contactAPI,
} from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FileSymlink } from "lucide-react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";


const Dashboard = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      try {
        const response = await statsAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
        return { users: 0, categories: 0, subcategories: 0, items: 0 };
      }
    },
  });

  const { data: quickLinks, isLoading: isLoadingQuickLinks } = useQuery({
    queryKey: ["quickLinks"],
    queryFn: async () => {
      try {
        const response = await quickLinksAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching quick links:", error);
        toast.error("Failed to load quick links");
        return [];
      }
    },
  });

  const { data: queries, isLoading: isLoadingQueries } = useQuery({
    queryKey: ["queries"],
    queryFn: async () => {
      try {
        const response = await userQueryAPI.getAll();
        return response.data.queries;
      } catch (error) {
        console.error("Error fetching queries:", error);
        toast.error("Failed to load queries");
        return [];
      }
    },
  });

  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      try {
        const response = await contactAPI.getAll();
        return response.data;
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toast.error("Failed to load contacts");
        return [];
      }
    },
  });

  const statCards = [
    {
      title: "Blogs",
      value: stats?.blogs || 0,
      icon: Users,
      link: "/blogs",
      description: "Registered users in the system",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Projects",
      value: stats?.projects || 0,
      icon: FolderOpen,
      link: "/projects",
      description: "Main content categories",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Skills",
      value: stats?.skills || 0,
      link: "/skills",
      icon: Layers,
      description: "Content subcategories",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Feedback",
      value: stats?.projects || 0,
      link: "/contact",
      icon: FileText,
      description: "User feedback",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (
    isLoadingStats ||
    isLoadingQuickLinks ||
    isLoadingQueries ||
    isLoadingContacts
  ) {
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
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-xs mt-1">{card.description}</p>
                  </div>
                  <Link
                    to={card.link}
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <FileSymlink className="h-6 w-6 text-blue-500 cursor-pointer" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:underline"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {queries?.slice(0, 10)?.map((query) => (
                <li key={query.id} className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {query.query}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {contacts.slice(0, 5).map((contact) => (
                <li key={contact._id} className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  {contact.name} - {contact.email}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
