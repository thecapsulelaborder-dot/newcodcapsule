import React from "react";
import { OrderSubmission } from "../../types";
import { List, CheckCircle2, AlertCircle, Clock, Trash2, ShieldAlert } from "lucide-react";

interface OrdersKanbanProps {
  submissions: OrderSubmission[];
  onUpdateStatus?: (id: string, status: string) => void;
  onDeleteSubmission?: (id: string) => void;
  locale: string;
}

export const OrdersKanban: React.FC<OrdersKanbanProps> = ({
  submissions,
  onUpdateStatus,
  onDeleteSubmission,
  locale
}) => {
  const statuses = ["New inquiry", "Approved", "In production", "Ready for shipping", "Completed"];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in production":
        return "bg-amber-100 text-amber-800";
      case "ready for shipping":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-indigo-100 text-indigo-800";
    }
  };

  return (
    <div className="w-full space-y-6 select-none">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold">Orders Kanban Board</h2>
          <p className="text-xs text-gray-500">Manage real-time incoming packaging inquiries and productions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statuses.map((status) => {
          const filtered = submissions.filter(
            (s) => (s.status?.toLowerCase() || "") === status.toLowerCase() || 
                   (status === "New inquiry" && !s.status)
          );

          return (
            <div key={status} className="bg-[#f0f2f5] p-4 rounded-3xl border border-gray-150 flex flex-col min-h-[400px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black uppercase text-gray-600 tracking-wider">
                  {status}
                </span>
                <span className="bg-gray-200 text-gray-800 text-[10px] font-black rounded-full px-2 py-0.5">
                  {filtered.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                {filtered.map((sub) => (
                  <div key={sub.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[9px] font-bold text-gray-400">
                        #{sub.trackingCode || sub.id}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusColor(status)}`}>
                        {sub.status || "New"}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-gray-900">{sub.customerName || "Anonymous Customer"}</h4>
                      <p className="text-[10px] text-gray-500 font-medium truncate">{sub.customerEmail}</p>
                    </div>

                    <div className="text-[10px] font-semibold text-gray-700 bg-gray-50 p-2 rounded-xl">
                      {(sub as any).productType || sub.type || "Packaging Inquiry"}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-[11px] font-black text-[#1A3F25]">
                        AMD {sub.totalPrice?.toLocaleString() || "0"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {onDeleteSubmission && (
                          <button
                            onClick={() => onDeleteSubmission(String(sub.id))}
                            className="p-1 hover:text-red-650 text-gray-400 rounded-lg hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="h-24 flex items-center justify-center border border-dashed border-gray-200 rounded-2xl text-[10px] text-gray-400 font-bold">
                    No items
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
