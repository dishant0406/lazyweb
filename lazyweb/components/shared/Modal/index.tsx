// @ts-nocheck

import cn from "classnames";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
  closeButtonClassName?: string;
  footer?: React.ReactNode;
};

export const ModalFooter: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({ className, children }) => (
  <div className={cn("border-t bg-popover p-4", className)}>{children}</div>
);

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  overlayClassName,
  contentClassName,
  closeButtonClassName,
  footer,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest(".modal-handle")
      ) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  if (!isVisible && !isOpen) return null;

  const modalContent = (
    <div
      onClick={onClose}
      className={cn(
        "fixed inset-0 dark z-[999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-[2px] transition-all duration-300 ease-out",
        isOpen ? "opacity-100" : "opacity-0",
        overlayClassName
      )}
    >
      <div
        ref={modalRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
        }}
        className={cn(
          "bg-popover max-h-[90vh] border overflow-hidden text-popover-foreground rounded-lg w-full  transform transition-all duration-300 ease-out flex flex-col",
          "shadow-[rgba(255,255,255,_0.15)_0px_2px_5px_0px,_rgba(255,_255,_255,_0.05)_0px_1px_1px_0px]",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={handleMouseDown}
      >
        {title && (
          <div className="p-4 border-b bg-popover z-10 flex justify-between items-center modal-handle cursor-move">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className={cn(
                "p-1 rounded-full text-foreground/50 hover:text-foreground/75 focus:outline-none",
                closeButtonClassName
              )}
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className={cn("flex-grow overflow-y-auto", contentClassName)}>
          <div className="p-6">{children || <></>}</div>
        </div>
        {footer && <div className="bg-popover z-[1]">{footer}</div>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default Modal;
