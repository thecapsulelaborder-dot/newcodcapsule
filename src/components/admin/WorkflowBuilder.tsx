import React, { useState } from "react";
import { Plus, Play, Sparkles, AlertCircle, Cpu, FileJson } from "lucide-react";

interface WorkflowBuilderProps {
  workflows: any[];
  onAddWorkflow?: (wf: any) => void;
  locale: string;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  workflows,
  onAddWorkflow,
  locale
}) => {
  const [name, setName] = useState("");
  const [trigger, setTrigger] = useState("Order Submitted");
  const [action, setAction] = useState("Send Customer Telegram/WhatsApp notification");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (onAddWorkflow) {
      onAddWorkflow({
        id: "wf_" + Date.now(),
        name,
        triggerEvent: trigger,
        actionType: action,
        enabled: true
      });
    }
    setName("");
  };

  return (
    <div className="w-full space-y-6 select-none">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-serif text-[#1A3F25] font-bold">Workflow Automation Builder</h2>
          <p className="text-xs text-gray-500">Visually orchestrate messaging protocols when data changes in the PostgreSQL DB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creation Box */}
        <form onSubmit={handleCreate} className="lg:col-span-4 bg-[#f0f2f5] p-6 rounded-[2rem] border border-gray-150 space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Configure Flow Event</h3>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase block">Automation Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. WhatsApp Status Alert"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-gray-850 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase block">Database Trigger</label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none"
            >
              <option value="Order Submitted">Order Submitted / Completed</option>
              <option value="Status Updated">Status Updated / Transitioned</option>
              <option value="Account Created">Account Created / Verified</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase block">Automation Webhook Action</label>
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 outline-none"
            >
              <option value="Send Customer Telegram/WhatsApp notification">Dispatch WhatsApp Client API Notification</option>
              <option value="Sync with Google Sheets CRM">Sync with external CRM / Webhook Endpoint</option>
              <option value="Trigger AI agent classification">Trigger Gemini package-dimension safety advisory</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#ff2300] hover:bg-[#e61f00] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Plus size={12} /> Register Flow Pipeline
          </button>
        </form>

        {/* Workflows Monitor */}
        <div className="lg:col-span-8 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider">Decoupled Automation Workflows ({workflows.length})</h3>

          <div className="space-y-3">
            {workflows.map((wf) => (
              <div key={wf.id} className="p-4 rounded-2xl bg-[#f0f2f5] border border-gray-150 flex items-center justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-black text-[#1A3F25] block">{wf.name || "Flow Automation Client"}</span>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-400 font-semibold">
                    <span className="bg-amber-50 text-amber-800 px-2 py-0.2 rounded-lg border border-amber-100 uppercase text-[9px]">
                      Trigger: {wf.triggerEvent || "DB Insert"}
                    </span>
                    <span className="bg-indigo-50 text-indigo-800 px-2 py-0.2 rounded-lg border border-indigo-100 uppercase text-[9px]">
                      Action: {wf.actionType || "API Hook"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-green-650 font-black">ACTIVE</span>
                </div>
              </div>
            ))}

            {workflows.length === 0 && (
              <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-250 rounded-[1.5rem] p-4 text-center">
                <Cpu size={20} className="text-gray-300 mb-2" />
                <span className="text-xs text-gray-400 font-bold">No registered background flow automations</span>
                <span className="text-[10px] text-gray-400">Trigger real-time pipelines when transactions execute in PostgreSQL</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
