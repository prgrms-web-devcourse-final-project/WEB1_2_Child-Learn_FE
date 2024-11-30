import { create } from 'zustand'
import { Payment } from '../types/paymentTypes'

interface PaymentStore {
    payments: Payment[];
    addPayment: (payment: Payment) => void;
    getPaymentsByAvatar: (avatarId: number) => Payment[];
  }
  
  export const usePaymentStore = create<PaymentStore>((set, get) => ({
    payments: [],
    addPayment: (payment) => set((state) => ({ payments: [...state.payments, payment] })),
    getPaymentsByAvatar: (avatarId) =>
      get().payments.filter((payment) => payment.avatar_id === avatarId),
  }));
  