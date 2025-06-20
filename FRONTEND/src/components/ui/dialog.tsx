import React from "react";

interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={() => onOpenChange && onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-full max-h-full overflow-auto"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}
export const DialogContent: React.FC<DialogContentProps> = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

interface DialogHeaderProps {
  children: React.ReactNode;
}
export const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}
export const DialogTitle: React.FC<DialogTitleProps> = ({ className = "", children }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}
export const DialogFooter: React.FC<DialogFooterProps> = ({ className = "", children }) => (
  <div className={`flex justify-end gap-2 mt-4 ${className}`}>{children}</div>
); 