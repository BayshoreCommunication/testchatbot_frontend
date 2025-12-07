"use client";

import { useState } from "react";
import {
  BiDownload,
  BiEnvelope,
  BiFile,
  BiGroup,
  BiRefresh,
  BiUser,
} from "react-icons/bi";

// Dummy leads data
const dummyLeads = [
  {
    id: 1,
    name: "Sahak",
    email: "arsahak@gmail.com",
    phone: "None",
    inquiry:
      "Hello | Do you take personal injury cases? | How much fee do you take for this?",
    sessionId: "test_ses...",
  },
  {
    id: 2,
    name: "John Doe",
    email: "johndoe@gmail.com",
    phone: "+1 (555) 123-4567",
    inquiry: "I need help with a car accident case. Can you assist?",
    sessionId: "sess_abc123",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "janesmith@email.com",
    phone: "None",
    inquiry: "Looking for legal consultation regarding property dispute",
    sessionId: "sess_def456",
  },
  {
    id: 4,
    name: "Mike Johnson",
    email: "mikej@company.com",
    phone: "+1 (555) 987-6543",
    inquiry: "Need information about business law services",
    sessionId: "sess_ghi789",
  },
];

const LeadsDetailsView = () => {
  const [leads] = useState(dummyLeads);

  // Calculate statistics
  const totalLeads = leads.length;
  const withEmail = leads.filter((lead) => lead.email !== "").length;
  const withName = leads.filter((lead) => lead.name !== "").length;
  const totalProfiles = leads.length;

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      subtitle: "Complete contact information",
      icon: <BiUser size={20} />,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "With Email",
      value: withEmail,
      subtitle: "Email addresses collected",
      icon: <BiEnvelope size={20} />,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "With Name",
      value: withName,
      subtitle: "Names collected",
      icon: <BiGroup size={20} />,
      color: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Total Profiles",
      value: totalProfiles,
      subtitle: "All user profiles",
      icon: <BiFile size={20} />,
      color: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const handleRefresh = () => {
    console.log("Refreshing leads...");
  };

  const handleDownloadCSV = () => {
    console.log("Downloading CSV...");
  };

  return (
    <div className="flex flex-col gap-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="rounded border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Visitor Leads</h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage all visitor contact information collected by your
              chatbot
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <BiRefresh size={18} />
              Refresh
            </button>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <BiDownload size={18} />
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
              >
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-700">
                {stat.title}
              </h3>
            </div>
            <p className="mb-1 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Leads Table */}
      <div className="rounded border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Inquiry
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Session ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm ${
                        lead.phone === "None"
                          ? "text-yellow-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {lead.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 max-w-md truncate">
                      {lead.inquiry}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {lead.sessionId}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {leads.length === 0 && (
          <div className="text-center py-12">
            <BiUser size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No leads found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsDetailsView;
