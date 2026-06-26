'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  show: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: 'danger' | 'default';
}

interface PendingConfirm extends Required<ConfirmOptions> {
  resolve: (value: boolean) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const ConfirmContext = createContext<((options: ConfirmOptions) => Promise<boolean>) | null>(null);

const toastIcons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

let toastId = 0;

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((current) => [...current, { id, type, message }]);
    window.setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const toast = useMemo<ToastContextValue>(() => ({
    show,
    success: (message) => show(message, 'success'),
    error: (message) => show(message, 'error'),
    warning: (message) => show(message, 'warning'),
    info: (message) => show(message, 'info'),
  }), [show]);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPendingConfirm({
        title: options.title || 'Confirm action',
        message: options.message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        tone: options.tone || 'default',
        resolve,
      });
    });
  }, []);

  const closeConfirm = (value: boolean) => {
    pendingConfirm?.resolve(value);
    setPendingConfirm(null);
  };

  return (
    <ToastContext.Provider value={toast}>
      <ConfirmContext.Provider value={confirm}>
        {children}

        <div className="toast-container" aria-live="polite" aria-atomic="true">
          {toasts.map((toastItem) => {
            const Icon = toastIcons[toastItem.type];
            return (
              <div key={toastItem.id} className={`toast toast-${toastItem.type}`} role="status">
                <Icon className="toast-icon" aria-hidden="true" />
                <div className="toast-message">{toastItem.message}</div>
                <button className="toast-close" type="button" onClick={() => removeToast(toastItem.id)} aria-label="Dismiss notification">
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        {pendingConfirm && (
          <div className="modal-backdrop" role="presentation" onMouseDown={() => closeConfirm(false)}>
            <div
              className="confirm-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-modal-title"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className={`confirm-modal-icon confirm-modal-icon-${pendingConfirm.tone}`}>
                <AlertTriangle size={22} aria-hidden="true" />
              </div>
              <div className="confirm-modal-content">
                <h2 id="confirm-modal-title">{pendingConfirm.title}</h2>
                <p>{pendingConfirm.message}</p>
                <div className="confirm-modal-actions">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => closeConfirm(false)}>
                    {pendingConfirm.cancelText}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${pendingConfirm.tone === 'danger' ? 'btn-danger-solid' : 'btn-primary'}`}
                    onClick={() => closeConfirm(true)}
                  >
                    {pendingConfirm.confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within FeedbackProvider');
  }
  return context;
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within FeedbackProvider');
  }
  return context;
}
