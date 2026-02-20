import React, { useState } from 'react';
import { 
  CheckCircle, Circle, Clock, Calendar, Plus, Filter, 
  ChevronRight, MoreVertical, User, AlertCircle, TrendingUp,
  Sun, Moon, MapPin, Users
} from 'lucide-react';
import { Task, TaskStatus, WeddingDayEvent, TaskAssignee } from '../types';
import { MOCK_TASKS, MOCK_DAY_SCHEDULE, calculateProgress, getCategoryProgress } from '../services/timelineService';

type ViewMode = 'dashboard' | 'tasks' | 'day-of';

export const PlanningTimeline: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [schedule, setSchedule] = useState<WeddingDayEvent[]>(MOCK_DAY_SCHEDULE);
  const [filterAssignee, setFilterAssignee] = useState<TaskAssignee | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(false);

  // Computed Stats
  const progress = calculateProgress(tasks);
  const categoryProgress = getCategoryProgress(tasks);
  
  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    if (!showCompleted && task.status === 'completed') return false;
    if (filterAssignee !== 'all' && task.assignedTo !== filterAssignee && task.assignedTo !== 'both') return false;
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Task Handlers
  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { 
        ...t, 
        status: t.status === 'completed' ? 'not_started' : 'completed',
        completedAt: t.status !== 'completed' ? new Date().toISOString().split('T')[0] : undefined
      };
    }));
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'high': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-serif">Planning Timeline</h2>
          <p className="text-slate-500">Stay on track with your tasks and big day schedule.</p>
        </div>
        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
           {[
             { id: 'dashboard', label: 'Overview', icon: TrendingUp },
             { id: 'tasks', label: 'Tasks', icon: CheckCircle },
             { id: 'day-of', label: 'Wedding Day', icon: Sun },
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setViewMode(tab.id as ViewMode)}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                 viewMode === tab.id 
                 ? 'bg-slate-800 text-white shadow-md' 
                 : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
               }`}
             >
               <tab.icon size={16} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {/* --- DASHBOARD VIEW --- */}
      {viewMode === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Progress Card */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Total Progress</h3>
                  <p className="text-slate-500 text-sm">You are doing great! Keep it up.</p>
                </div>
                <div className="px-4 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100">
                  {progress}% Complete
                </div>
             </div>
             
             <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-8">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }} 
                />
             </div>

             <h4 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Category Breakdown</h4>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {categoryProgress.map(cat => (
                 <div key={cat.category} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                       <span className="font-medium text-slate-700 text-sm">{cat.category}</span>
                       <span className="text-xs font-bold text-slate-400">{cat.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-rose-500 h-full rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                 </div>
               ))}
             </div>
          </div>

          {/* Urgent Tasks Widget */}
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
             <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center gap-2">
               <AlertCircle size={20} /> This Week's Priority
             </h3>
             <div className="space-y-3">
               {tasks.filter(t => t.status !== 'completed').slice(0, 4).map(task => (
                 <div key={task.id} className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm flex items-start gap-3">
                    <button 
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-1 text-slate-300 hover:text-emerald-500 transition-colors"
                    >
                      <Circle size={18} />
                    </button>
                    <div>
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{task.title}</p>
                      <p className="text-xs text-rose-600 font-medium mt-1">Due: {task.dueDate}</p>
                    </div>
                 </div>
               ))}
               {tasks.filter(t => t.status !== 'completed').length === 0 && (
                 <p className="text-rose-700 text-sm">No pending tasks for this week!</p>
               )}
             </div>
             <button onClick={() => setViewMode('tasks')} className="w-full mt-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors">
               View All Tasks
             </button>
          </div>
        </div>
      )}

      {/* --- TASK LIST VIEW --- */}
      {viewMode === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 mb-2 block">Assigned To</label>
                    <div className="flex flex-col gap-2">
                       {['all', 'bride', 'groom', 'family'].map(role => (
                         <label key={role} className="flex items-center gap-2 cursor-pointer">
                           <input 
                              type="radio" 
                              name="assignee"
                              checked={filterAssignee === role}
                              onChange={() => setFilterAssignee(role as any)}
                              className="text-rose-500 focus:ring-rose-500"
                           />
                           <span className="text-sm text-slate-700 capitalize">{role}</span>
                         </label>
                       ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                     <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={showCompleted}
                          onChange={e => setShowCompleted(e.target.checked)}
                          className="rounded text-rose-500 focus:ring-rose-500"
                        />
                        <span className="text-sm text-slate-700">Show Completed</span>
                     </label>
                  </div>
                </div>
             </div>

             <button className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
               <Plus size={18} /> Add New Task
             </button>
          </div>

          {/* Task List */}
          <div className="lg:col-span-3 space-y-3">
             {filteredTasks.map(task => (
               <div 
                  key={task.id} 
                  className={`group bg-white p-4 rounded-xl border transition-all hover:shadow-md flex items-center gap-4 ${
                    task.status === 'completed' ? 'border-slate-100 opacity-60' : 'border-slate-200'
                  }`}
               >
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`flex-shrink-0 transition-colors ${
                      task.status === 'completed' ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-500'
                    }`}
                  >
                    {task.status === 'completed' ? <CheckCircle size={24} className="fill-emerald-50" /> : <Circle size={24} />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className={`font-bold text-slate-800 ${task.status === 'completed' ? 'line-through text-slate-500' : ''}`}>
                         {task.title}
                       </h4>
                       <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wider ${getPriorityColor(task.priority)}`}>
                         {task.priority}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                       <span className="flex items-center gap-1"><Clock size={12} /> {task.dueDate}</span>
                       <span className="flex items-center gap-1"><User size={12} /> {task.assignedTo}</span>
                       <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">{task.category}</span>
                    </div>
                  </div>

                  <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                    <MoreVertical size={18} />
                  </button>
               </div>
             ))}

             {filteredTasks.length === 0 && (
               <div className="text-center py-12 bg-white rounded-xl border border-slate-100 border-dashed">
                 <p className="text-slate-400">No tasks found matching your filters.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {/* --- DAY-OF SCHEDULE VIEW --- */}
      {viewMode === 'day-of' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Timeline Visual */}
           <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold font-serif text-slate-800">Wedding Day Timeline</h3>
                 <button className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center gap-1">
                   <Plus size={16} /> Add Event
                 </button>
              </div>

              <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                 {schedule.map((event, index) => (
                   <div key={event.id} className="relative pl-8 group">
                      {/* Dot */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-4 border-rose-400 group-hover:scale-125 transition-transform" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                         <div>
                            <span className="inline-block px-2 py-1 bg-slate-800 text-white text-xs font-bold rounded mb-2">
                              {event.time}
                            </span>
                            <h4 className="font-bold text-slate-800 text-lg">{event.title}</h4>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-500">
                               {event.location && (
                                 <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                               )}
                               {event.involvedParties.length > 0 && (
                                 <span className="flex items-center gap-1"><Users size={14} /> {event.involvedParties.join(', ')}</span>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Details / Export */}
           <div className="space-y-6">
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                 <h3 className="font-bold text-rose-900 mb-2">Share Schedule</h3>
                 <p className="text-sm text-rose-700 mb-4">Ensure everyone knows where to be.</p>
                 <div className="space-y-2">
                    <button className="w-full py-2 bg-white text-rose-700 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors">
                      Email to Vendors
                    </button>
                    <button className="w-full py-2 bg-white text-rose-700 border border-rose-200 rounded-lg text-sm font-bold hover:bg-rose-100 transition-colors">
                      Print PDF
                    </button>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                 <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                       <span className="text-slate-500">Start Time</span>
                       <span className="font-medium">{schedule[0]?.time}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">End Time</span>
                       <span className="font-medium">{schedule[schedule.length - 1]?.time}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Total Duration</span>
                       <span className="font-medium">11 Hours</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-500">Total Events</span>
                       <span className="font-medium">{schedule.length}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
