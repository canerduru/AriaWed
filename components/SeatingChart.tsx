import React, { useState, useRef, useEffect } from 'react';
import { Table, Guest, SeatingConflict, TableShape } from '../types';
import { MOCK_TABLES, MOCK_CONFLICTS, hasConflict, autoAssignGuests } from '../services/seatingService';
import { MOCK_GUESTS } from '../services/guestService';
import { 
  Users, Move, AlertTriangle, Plus, RotateCw, Trash2, 
  Download, GripHorizontal, Search, Wand2, Armchair
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const SeatingChart: React.FC = () => {
  const [tables, setTables] = useState<Table[]>(MOCK_TABLES);
  // In a real app, guests would come from props or global state context
  const [guests, setGuests] = useState<Guest[]>(MOCK_GUESTS);
  const [conflicts] = useState<SeatingConflict[]>(MOCK_CONFLICTS);
  
  const [draggedTable, setDraggedTable] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null); // For mobile/click assignment
  const [searchTerm, setSearchTerm] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- Actions ---

  const handleAddTable = () => {
    const newTable: Table = {
      id: `t${Date.now()}`,
      name: `Table ${tables.length + 1}`,
      shape: 'round',
      capacity: 8,
      x: 100,
      y: 100,
    };
    setTables([...tables, newTable]);
  };

  const handleUpdateTable = (id: string, updates: Partial<Table>) => {
    setTables(tables.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleDeleteTable = (id: string) => {
    if (confirm('Delete table? assigned guests will be unseated.')) {
      setTables(tables.filter(t => t.id !== id));
      setGuests(guests.map(g => g.tableId === id ? { ...g, tableId: undefined } : g));
    }
  };

  const handleAutoAssign = () => {
    const newAssignments = autoAssignGuests(guests, tables);
    setGuests(newAssignments);
  };

  const handleExportPDF = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = await html2canvas(canvasRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('seating-chart.pdf');
    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to export PDF");
    }
  };

  // --- Drag & Drop Logic (Guests) ---

  const handleDragStartGuest = (e: React.DragEvent, guestId: string) => {
    e.dataTransfer.setData('guestId', guestId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropOnTable = (e: React.DragEvent, tableId: string) => {
    e.preventDefault();
    const guestId = e.dataTransfer.getData('guestId');
    if (guestId) {
      assignGuest(guestId, tableId);
    }
  };

  const assignGuest = (guestId: string, tableId: string) => {
    // Capacity Check
    const table = tables.find(t => t.id === tableId);
    const seatedCount = guests.filter(g => g.tableId === tableId).length;
    
    // Calculate how many seats this guest takes (1 + plusOne + children)
    // For simplicity in this demo, we assume 1 seat per guest object record logic in MOCK
    // In real app, check children count etc.
    if (table && seatedCount >= table.capacity) {
      if (!confirm(`Table ${table.name} is full. Add anyway?`)) return;
    }

    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, tableId } : g));
    setSelectedGuest(null); // Clear selection if any
  };

  const unassignGuest = (guestId: string) => {
    setGuests(prev => prev.map(g => g.id === guestId ? { ...g, tableId: undefined } : g));
  };

  // --- Drag & Drop Logic (Tables - Mouse Events) ---

  const handleTableMouseDown = (e: React.MouseEvent, tableId: string, x: number, y: number) => {
    e.stopPropagation(); // Prevent canvas drag
    setDraggedTable(tableId);
    // Calculate offset relative to table top-left
    const rect = (e.target as Element).getBoundingClientRect();
    // Use client coordinates for smoother drag calc
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedTable && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - (30); // Center cursor roughly
      const newY = e.clientY - canvasRect.top - (30);
      
      setTables(prev => prev.map(t => 
        t.id === draggedTable ? { ...t, x: Math.max(0, newX), y: Math.max(0, newY) } : t
      ));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedTable(null);
  };

  // --- Render ---

  const unassignedGuests = guests.filter(g => !g.tableId && g.rsvpStatus === 'attending')
    .filter(g => g.fullName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-in fade-in duration-500">
      
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold font-serif text-slate-800 flex items-center gap-2">
                <Armchair className="text-rose-500" /> Seating Chart
            </h2>
            <div className="h-6 w-px bg-slate-200" />
            <button onClick={handleAddTable} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                <Plus size={16} /> Add Table
            </button>
             <button onClick={handleAutoAssign} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100">
                <Wand2 size={16} /> Auto-Assign
            </button>
        </div>
        <div className="flex gap-2">
            <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 shadow-lg shadow-slate-200 transition-colors">
                <Download size={18} /> Export PDF
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar (Guest List) */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col z-10 shadow-xl">
            <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-700 mb-2 flex justify-between">
                    <span>Guests ({unassignedGuests.length})</span>
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Unseated</span>
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search guests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                </div>
                {selectedGuest && (
                    <div className="mt-3 p-2 bg-rose-50 border border-rose-100 rounded text-xs text-rose-700 flex justify-between items-center animate-in fade-in">
                        <span>Tap a table to seat <strong>{selectedGuest.fullName}</strong></span>
                        <button onClick={() => setSelectedGuest(null)}><RotateCw size={12} /></button>
                    </div>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {unassignedGuests.map(guest => (
                    <div 
                        key={guest.id}
                        draggable
                        onDragStart={(e) => handleDragStartGuest(e, guest.id)}
                        onClick={() => setSelectedGuest(selectedGuest?.id === guest.id ? null : guest)}
                        className={`p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                            selectedGuest?.id === guest.id 
                            ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300' 
                            : 'bg-white border-slate-200 hover:border-rose-200'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <span className="font-medium text-slate-800 text-sm">{guest.fullName}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase ${guest.side === 'bride' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                {guest.side}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-1 text-xs text-slate-400">
                             <span>{guest.group}</span>
                             {guest.plusOneAllowed && <span>• +1</span>}
                        </div>
                    </div>
                ))}
                {unassignedGuests.length === 0 && (
                    <div className="text-center p-8 text-slate-400 text-sm">
                        All attending guests are seated!
                    </div>
                )}
            </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-slate-50 bg-grid-pattern overflow-auto relative cursor-grab active:cursor-grabbing p-8">
            <div 
                ref={canvasRef}
                className="w-[1200px] h-[800px] bg-white shadow-2xl rounded-xl relative mx-auto my-4 border border-slate-200"
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #f8fafc 25%, transparent 25%, transparent 75%, #f8fafc 75%, #f8fafc), repeating-linear-gradient(45deg, #f8fafc 25%, #fff 25%, #fff 75%, #f8fafc 75%, #f8fafc)',
                  backgroundPosition: '0 0, 10px 10px',
                  backgroundSize: '20px 20px'
                }}
            >
                <div className="absolute top-4 left-4 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-50 pointer-events-none">
                    Reception Hall (1200x800)
                </div>

                {tables.map(table => {
                    const seatedGuests = guests.filter(g => g.tableId === table.id);
                    const isFull = seatedGuests.length >= table.capacity;
                    const isConflict = hasConflict(seatedGuests, conflicts);
                    
                    return (
                        <div
                            key={table.id}
                            className={`absolute transition-shadow group ${draggedTable === table.id ? 'cursor-grabbing z-50 shadow-2xl scale-105' : 'cursor-grab z-0 shadow-md hover:shadow-lg'}`}
                            style={{ 
                                left: table.x, 
                                top: table.y,
                                width: table.shape === 'head' ? 300 : (table.shape === 'rectangular' ? 160 : 160),
                                height: table.shape === 'rectangular' ? 240 : 160,
                            }}
                            onMouseDown={(e) => handleTableMouseDown(e, table.id, table.x, table.y)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDropOnTable(e, table.id)}
                            onClick={() => selectedGuest && assignGuest(selectedGuest.id, table.id)}
                        >
                            {/* Visual Shape */}
                            <div className={`w-full h-full border-2 ${isFull ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'} ${table.shape === 'round' ? 'rounded-full' : 'rounded-lg'} flex flex-col items-center justify-center relative overflow-hidden transition-colors`}>
                                
                                {/* Header */}
                                <div className="absolute top-3 text-center w-full px-2">
                                    <input 
                                        type="text" 
                                        value={table.name}
                                        onChange={(e) => handleUpdateTable(table.id, { name: e.target.value })}
                                        className="text-center font-bold text-slate-700 bg-transparent outline-none w-full text-sm"
                                    />
                                    <p className={`text-[10px] ${seatedGuests.length > table.capacity ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                                        {seatedGuests.length}/{table.capacity}
                                    </p>
                                </div>

                                {/* Guest List (Mini) */}
                                <div className="mt-6 w-full px-4 max-h-[100px] overflow-y-auto scrollbar-hide space-y-1">
                                    {seatedGuests.map(g => (
                                        <div key={g.id} className="flex justify-between items-center text-[10px] bg-slate-100 rounded px-1.5 py-0.5 group/guest">
                                            <span className="truncate max-w-[80px]">{g.fullName.split(' ')[0]}</span>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); unassignGuest(g.id); }}
                                                className="text-slate-400 hover:text-rose-500 opacity-0 group-hover/guest:opacity-100"
                                            >
                                                <XIcon size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Indicators */}
                                {isConflict && (
                                    <div className="absolute top-1 right-1 text-amber-500 bg-white rounded-full shadow-sm p-0.5" title="Conflict detected!">
                                        <AlertTriangle size={14} />
                                    </div>
                                )}
                                
                                {/* Edit Controls (Hover) */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white rounded-lg p-1 shadow-xl">
                                     <button 
                                        className="p-1 hover:text-rose-300" 
                                        title="Delete Table"
                                        onClick={(e) => { e.stopPropagation(); handleDeleteTable(table.id); }}
                                    >
                                        <Trash2 size={12} />
                                     </button>
                                     <button 
                                        className="p-1 hover:text-blue-300" 
                                        title="Rotate/Resize (Mock)"
                                        onClick={(e) => { e.stopPropagation(); }}
                                    >
                                        <RotateCw size={12} />
                                     </button>
                                </div>
                            </div>

                            {/* Chairs Visualization (Decorative) */}
                            {Array.from({ length: Math.min(table.capacity, 8) }).map((_, i) => {
                                const angle = (i / Math.min(table.capacity, 8)) * 2 * Math.PI;
                                const radius = table.shape === 'round' ? 85 : 90; // Just outside
                                const cx = table.shape === 'head' ? 150 : 80; // Center X
                                const cy = table.shape === 'rectangular' ? 120 : 80; // Center Y
                                
                                // Simplified chair positioning for demo
                                const left = cx + Math.cos(angle) * (table.shape === 'round' ? 88 : (table.shape === 'head' ? 140 : 88)) - 10;
                                const top = cy + Math.sin(angle) * (table.shape === 'rectangular' ? 128 : 88) - 10;

                                return (
                                    <div 
                                        key={i}
                                        className="absolute w-5 h-5 bg-slate-200 rounded-full border border-slate-300 -z-10"
                                        style={{ left: left, top: top }}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

// Helper Icon Component
const XIcon = ({ size }: { size: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);
