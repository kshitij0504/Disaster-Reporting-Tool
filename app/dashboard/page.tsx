'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Report, ReportStatus, ReportType, User, Role } from "@prisma/client";
import { signOut } from "next-auth/react";
import { 
  Award, 
  Clock, 
  MapPin, 
  User as UserIcon, 
  FileText, 
  Check, 
  XCircle, 
  RefreshCw,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react";
import Link from "next/link";

// Define the complete Report type including the user relationship
type ReportWithUser = {
  id: string;
  reportId: string;
  type: ReportType;
  title: string;
  description: string;
  reportType: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: ReportStatus;
  createdAt: Date;
  userId: number;
  user: {
    id: number;
    email: string;
    password: string;
    name: string;
    role: Role;
  };
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<ReportWithUser[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportWithUser | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      const data: ReportWithUser[] = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (
    reportId: string,
    newStatus: ReportStatus
  ) => {
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchReports();
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Error updating report:", error);
    }
  };

  const filteredReports = reports.filter((report) => {
    const statusMatch = filter === "ALL" || report.status === filter;
    const typeMatch = typeFilter === "ALL" || report.type === typeFilter;
    const searchMatch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.name.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && typeMatch && searchMatch;
  });

  const getStatusIcon = (status: ReportStatus) => {
    const icons = {
      PENDING: <Clock className="text-amber-300" />,
      IN_PROGRESS: <RefreshCw className="text-sky-300" />,
      RESOLVED: <Check className="text-emerald-300" />,
      DISMISSED: <XCircle className="text-neutral-300" />
    };
    return icons[status];
  };

  const getStatusColor = (status: ReportStatus) => {
    const colors = {
      PENDING: "bg-amber-500/20 text-amber-200 border border-amber-500/30",
      IN_PROGRESS: "bg-sky-500/20 text-sky-200 border border-sky-500/30",
      RESOLVED: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/30",
      DISMISSED: "bg-neutral-500/20 text-neutral-200 border border-neutral-500/30",
    };
    return colors[status];
  };

  const openReportDetails = (report: ReportWithUser) => {
    setSelectedReport(report);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </div>
        <nav className="flex-grow">
          <ul className="py-4">
            <Link className="px-6 py-3 hover:bg-neutral-800 cursor-pointer flex items-center gap-3 text-neutral-300 hover:text-white transition-colors" href={"/dashboard"}>
              <FileText className="w-5 h-5" />
              Reports
            </Link>
            <Link className="px-6 py-3 hover:bg-neutral-800 cursor-pointer flex items-center gap-3 text-neutral-300 hover:text-white transition-colors" href={"/users"}>
              <UserIcon className="w-5 h-5" />
              Users
            </Link>
          </ul>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-neutral-300" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-medium">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-neutral-400">Administrator</p>
            </div>
            <button
              onClick={() => signOut()}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-black p-8">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="mb-8 flex justify-between items-center">
            <div className="relative flex-grow mr-4">
              <input 
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:ring-2 focus:ring-blue-500/20"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as ReportStatus | "ALL")
                  }
                  className="appearance-none bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Statuses</option>
                  {Object.values(ReportStatus).map((status) => (
                    <option key={status} value={status}>
                      {status.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              </div>

              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value as ReportType | "ALL")
                  }
                  className="appearance-none bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="ALL">All Types</option>
                  {Object.values(ReportType).map((type) => (
                    <option key={type} value={type}>
                      {type.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {filteredReports.slice(0, Math.ceil(filteredReports.length / 2)).map((report) => (
                <div
                  key={report.id}
                  onClick={() => openReportDetails(report)}
                  className={`bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border ${
                    selectedReport?.id === report.id 
                      ? 'border-blue-500/50' 
                      : 'border-neutral-800 hover:border-neutral-700'
                  } transition-all shadow-lg cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(report.status)}
                        <h2 className="text-lg font-semibold text-neutral-100 flex-grow truncate">
                          {report.title}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-sm line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6">
              {filteredReports.slice(Math.ceil(filteredReports.length / 2)).map((report) => (
                <div
                  key={report.id}
                  onClick={() => openReportDetails(report)}
                  className={`bg-neutral-900/60 backdrop-blur-sm rounded-2xl p-6 border ${
                    selectedReport?.id === report.id 
                      ? 'border-blue-500/50' 
                      : 'border-neutral-800 hover:border-neutral-700'
                  } transition-all shadow-lg cursor-pointer`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(report.status)}
                        <h2 className="text-lg font-semibold text-neutral-100 flex-grow truncate">
                          {report.title}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-neutral-300 text-sm line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="text-center py-16 text-neutral-400 bg-neutral-900/50 rounded-xl border border-neutral-800">
              <FileText className="mx-auto mb-4 w-12 h-12 text-neutral-500" />
              <p className="text-lg">No reports found matching the selected filters.</p>
            </div>
          )}
        </div>
      </main>

      {/* Report Details Sidebar */}
      {selectedReport && (
        <div className="fixed inset-y-0 right-0 w-[400px] bg-neutral-900 border-l border-neutral-800 shadow-2xl z-50 overflow-y-auto">
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Report Details</h2>
            <button 
              onClick={() => setSelectedReport(null)}
              className="text-neutral-400 hover:text-white"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-neutral-100">{selectedReport.title}</h3>
                <div className="mt-2 flex items-center gap-2">
                  {getStatusIcon(selectedReport.status)}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium uppercase ${getStatusColor(
                      selectedReport.status
                    )}`}
                  >
                    {selectedReport.status.replace("_", " ")}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <select
                  value={selectedReport.status}
                  onChange={(e) =>
                    updateReportStatus(
                      selectedReport.id,
                      e.target.value as ReportStatus
                    )
                  }
                  className="appearance-none bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500/20"
                >
                  {Object.values(ReportStatus).map((status) => (
                    <option key={status} value={status}>
                    {status.replace("_", " ")}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-300">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-neutral-400 text-sm mb-2">Description</h4>
              <p className="text-neutral-100">{selectedReport.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-neutral-400" />
                  <h4 className="text-neutral-400 text-sm">Type</h4>
                </div>
                <p className="text-neutral-100">{selectedReport.type.replace("_", " ")}</p>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-neutral-400" />
                  <h4 className="text-neutral-400 text-sm">Location</h4>
                </div>
                <p className="text-neutral-100">{selectedReport.location || "N/A"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <h4 className="text-neutral-400 text-sm">Created At</h4>
                </div>
                <p className="text-neutral-100">
                  {new Date(selectedReport.createdAt).toLocaleDateString()}
                  {' '}
                  {new Date(selectedReport.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div className="bg-neutral-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="w-4 h-4 text-neutral-400" />
                  <h4 className="text-neutral-400 text-sm">Reported By</h4>
                </div>
                <p className="text-neutral-100">{selectedReport.user.name || "Unknown User"}</p>
              </div>
            </div>

            {selectedReport.image && (
              <div className="bg-neutral-800 rounded-lg p-4">
                <h4 className="text-neutral-400 text-sm mb-2">Attached Image</h4>
                <div className="overflow-hidden rounded-xl border border-neutral-700">
                  <img
                    src={selectedReport.image}
                    alt="Report Attachment"
                    className="w-full h-auto object-cover transition-transform hover:scale-105"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
}