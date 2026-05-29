import { useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Dumbbell,
  MoreVertical,
  Sparkles,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { useAIChat } from "../context/AIChatContext";
import {
  buildExerciseAIPrompt,
  type ExerciseAIAction,
} from "../lib/aiExercisePrompts";
import { cn } from "./ui/utils";

interface ExerciseAIMenuProps {
  exerciseName: string;
  className?: string;
}

const MENU_ITEMS: {
  action: ExerciseAIAction;
  label: string;
  icon: typeof Sparkles;
  description: string;
}[] = [
  {
    action: "ask",
    label: "Hỏi AI",
    icon: Sparkles,
    description: "Tổng quan bài tập",
  },
  {
    action: "explain",
    label: "Giải thích bài tập",
    icon: BookOpen,
    description: "Kỹ thuật & an toàn",
  },
  {
    action: "muscles",
    label: "Nhóm cơ tác động",
    icon: Dumbbell,
    description: "Cơ chế hoạt động",
  },
  {
    action: "mistakes",
    label: "Lỗi sai thường gặp",
    icon: AlertTriangle,
    description: "Sửa form tập",
  },
];

export default function ExerciseAIMenu({
  exerciseName,
  className,
}: ExerciseAIMenuProps) {
  const { sendAIMessage } = useAIChat();
  const [open, setOpen] = useState(false);

  const handleAction = (action: ExerciseAIAction) => {
    setOpen(false);
    sendAIMessage(buildExerciseAIPrompt(exerciseName, action));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Menu AI cho ${exerciseName}`}
          aria-expanded={open}
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-slate-400 transition-colors",
            "hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40",
            open && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
            className,
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        sideOffset={6}
        collisionPadding={16}
        className={cn(
          "z-[9999] w-60 border border-white/10 bg-[#0F172A] p-2 text-slate-200 shadow-2xl shadow-black/60",
          "opacity-100",
        )}
      >
        <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          AI Coach · {exerciseName}
        </p>

        <div className="flex flex-col gap-0.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.action}
                type="button"
                onClick={() => handleAction(item.action)}
                className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-emerald-500/10 focus-visible:bg-emerald-500/10 focus-visible:outline-none"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                  <Icon className="h-4 w-4" />
                </span>

                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium leading-tight text-slate-100">
                    {item.label}
                  </span>
                  <span className="text-[11px] leading-tight text-slate-500">
                    {item.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
