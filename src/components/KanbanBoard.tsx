'use client';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { MessageSquare, Pencil, Trash2, User, Calendar, MapPin } from 'lucide-react';

interface Deal {
  id: string;
  clientName: string;
  companyName?: string | null;
  phone?: string;
  dealValue: number;
  productCategory?: string;
  customerType?: string;
  topic?: string | null;
  targetPeriod?: string;
  cityId?: number;
  city?: { name: string } | string;
  stageId: number;
  latitude?: number;
  longitude?: number;
  activities?: { id: string }[];
  createdBy?: { id: string; name: string; email: string } | null;
}

interface Stage {
  id: number;
  name: string;
  colorHex?: string;
}

export default function KanbanBoard({
  stages,
  deals,
  onStageChange,
  onOpenActivity,
  onEditDeal,
  onDeleteDeal,
}: {
  stages: Stage[];
  deals: Deal[];
  onStageChange: (dealId: string, newStageId: number) => void;
  onOpenActivity: (deal: Deal) => void;
  onEditDeal: (deal: Deal) => void;
  onDeleteDeal: (dealId: string) => void;
}) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const sourceStageId = parseInt(result.source.droppableId);
    const destStageId = parseInt(result.destination.droppableId);

    if (sourceStageId !== destStageId) {
      onStageChange(result.draggableId, destStageId);
    }
  };

  const getCustomerLabel = (type?: string) => {
    switch (type) {
      case 'B2B_CORP_GOV_CAMPUS':
        return 'B2B (Instansi/Kampus)';
      case 'B2C_STUDENT_PARENT':
        return 'B2C (Siswa/Ortu)';
      case 'B2C_PRO_SMK':
      default:
        return 'B2C (Pro/SMK)';
    }
  };

  const getStageTheme = (stageId: number) => {
    switch (stageId) {
      case 1:
        return {
          dotBg: 'bg-blue-500 ring-blue-500/20',
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
        };
      case 2:
        return {
          dotBg: 'bg-purple-500 ring-purple-500/20',
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
        };
      case 3:
        return {
          dotBg: 'bg-amber-500 ring-amber-500/20',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
        };
      case 4:
        return {
          dotBg: 'bg-emerald-500 ring-emerald-500/20',
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
        };
      case 5:
        return {
          dotBg: 'bg-rose-500 ring-rose-500/20',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
        };
      default:
        return {
          dotBg: 'bg-slate-500 ring-slate-500/20',
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        };
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 items-start">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id);
          const theme = getStageTheme(stage.id);

          return (
            <div
              key={stage.id}
              className="bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 flex flex-col min-w-[280px]"
            >
              <div className="flex items-center justify-between mb-3 px-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ring-4 ${theme.dotBg}`} />
                  <h3 className="font-bold text-xs tracking-wide uppercase text-slate-700 dark:text-slate-200">
                    {stage.name}
                  </h3>
                </div>

                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${theme.badgeBg}`}>
                  {stageDeals.length}
                </span>
              </div>

              <Droppable droppableId={stage.id.toString()}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 flex flex-col gap-3 min-h-[400px]"
                  >
                    {stageDeals.map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-slate-800/95 border rounded-xl p-3.5 transition-all relative group ${
                              snapshot.isDragging
                                ? 'shadow-xl ring-2 ring-blue-500/50 border-transparent rotate-1'
                                : 'border-slate-200/90 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0 pr-1">
                                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate tracking-tight">
                                  {deal.clientName}
                                </h4>
                                {deal.companyName && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium mt-0.5">
                                    {deal.companyName}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenActivity(deal);
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 dark:bg-slate-700/50 dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-md transition"
                                  title="Log Aktivitas & Catatan"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>{deal.activities?.length || 0}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditDeal(deal);
                                  }}
                                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition"
                                  title="Ubah Target"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Hapus prospek "${deal.clientName}"?`)) {
                                      onDeleteDeal(deal.id);
                                    }
                                  }}
                                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-md transition"
                                  title="Hapus Target"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {deal.topic && (
                              <div className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-lg px-2.5 py-1.5 font-medium line-clamp-2">
                                <span className="text-slate-400 font-normal">Kebutuhan: </span>
                                {deal.topic}
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                  deal.productCategory === 'KIDS_MENTORING'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                }`}
                              >
                                {deal.productCategory === 'KIDS_MENTORING'
                                  ? 'Mentoring Anak'
                                  : 'Pelatihan Pro'}
                              </span>

                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                                {getCustomerLabel(deal.customerType)}
                              </span>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium truncate max-w-[140px]">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">
                                  {typeof deal.city === 'object' ? deal.city?.name : deal.city}
                                </span>
                              </div>
                              <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-sm">
                                Rp {deal.dealValue.toLocaleString('id-ID')}
                              </span>
                            </div>

                            <div className="mt-2 pt-2 border-t border-slate-100/70 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-slate-400" />
                                <span className="font-medium text-slate-600 dark:text-slate-300">
                                  {deal.targetPeriod || '-'}
                                </span>
                              </div>

                              <div
                                className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 px-1.5 py-0.5 rounded-md max-w-[130px]"
                                title={`Dibuat oleh: ${deal.createdBy?.name || 'Admin'}`}
                              >
                                <User className="w-3 h-3 text-blue-500 shrink-0" />
                                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate text-[10px]">
                                  {deal.createdBy?.name ? deal.createdBy.name.split(' ')[0] : 'Admin'}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
