import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const element = ref.current!;
    const focusables = () =>
      Array.from(
        element.querySelectorAll<HTMLElement>('button,input,select,a[href],[tabindex="0"]'),
      ).filter((e) => !(e as HTMLButtonElement).disabled);
    focusables()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeRef.current();
      }
      if (e.key === 'Tab') {
        const f = focusables();
        if (!f.length) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f.at(-1)!.focus();
        } else if (!e.shiftKey && document.activeElement === f.at(-1)) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    element.addEventListener('keydown', key);
    return () => {
      element.removeEventListener('keydown', key);
      if (previous?.isConnected) previous.focus();
    };
  }, [title]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="modal"
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-heading">
          <h2>{title}</h2>
          <button onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
