export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface Toast {
  id: string;
  type: ToastType;
  message: string;
    duration?: number
  closable?: boolean;
  timestamp: number;
}
export interface ToastOptions {
  duration?: number;
  closable?: boolean;
}

export interface SpinnerState {
  isVisible: boolean
  message?: string
}

export interface DenominationValues {
  [key: string]: number;
  "50": number;
  "20": number;
  "10": number;
  "5": number;
  "2": number;
  "1": number;
  "50p": number;
  "20p": number;
  "10p": number;
  "5p": number;
  "2p": number;
  "1p": number;
}
