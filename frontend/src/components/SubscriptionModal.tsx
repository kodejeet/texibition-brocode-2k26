import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Subscription } from '../context/SubscriptionContext';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Subscription, 'id'>) => void;
  initialData?: Subscription | null;
};

type FormValues = {
  name: string;
  price: number;
  currency: string;
  renewalDate: string;
  notifyBeforeDays: number;
  notes: string;
};

export default function SubscriptionModal({ isOpen, onClose, onSubmit, initialData }: ModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          price: initialData.price,
          currency: initialData.currency,
          renewalDate: initialData.renewalDate,
          notifyBeforeDays: initialData.notifyBeforeDays,
          notes: initialData.notes ?? '',
        }
      : {
          name: '',
          price: 0,
          currency: 'INR',
          renewalDate: '',
          notifyBeforeDays: 3,
          notes: '',
        },
  });

  const handleFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      price: Number(data.price),
      notifyBeforeDays: Number(data.notifyBeforeDays),
    });
    reset();
    onClose();
  };

  const inputClass =
    'block w-full rounded-lg border-0 bg-white/5 py-2 px-3 text-foreground shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 placeholder:text-muted-foreground/50';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg mx-4 glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {initialData ? 'Edit Subscription' : 'Add New Subscription'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="sub-name" className="block text-sm font-medium text-foreground mb-1.5">
                  Service Name
                </label>
                <input
                  id="sub-name"
                  {...register('name', { required: 'Service name is required' })}
                  className={inputClass}
                  placeholder="Netflix, Spotify, Gym..."
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Price + Currency */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label htmlFor="sub-price" className="block text-sm font-medium text-foreground mb-1.5">
                    Price
                  </label>
                  <input
                    id="sub-price"
                    type="number"
                    step="0.01"
                    {...register('price', { required: 'Price is required', min: { value: 0, message: 'Must be positive' } })}
                    className={inputClass}
                    placeholder="499"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="sub-currency" className="block text-sm font-medium text-foreground mb-1.5">
                    Currency
                  </label>
                  <select
                    id="sub-currency"
                    {...register('currency')}
                    className={inputClass}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Renewal Date + Notify Days */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="sub-renewal" className="block text-sm font-medium text-foreground mb-1.5">
                    Renewal Date
                  </label>
                  <input
                    id="sub-renewal"
                    type="date"
                    {...register('renewalDate', { required: 'Renewal date is required' })}
                    className={inputClass}
                  />
                  {errors.renewalDate && (
                    <p className="mt-1 text-xs text-red-400">{errors.renewalDate.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="sub-notify" className="block text-sm font-medium text-foreground mb-1.5">
                    Alert Days Before
                  </label>
                  <input
                    id="sub-notify"
                    type="number"
                    {...register('notifyBeforeDays', { required: true, min: 1 })}
                    className={inputClass}
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="sub-notes" className="block text-sm font-medium text-foreground mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  id="sub-notes"
                  rows={2}
                  {...register('notes')}
                  className={inputClass + ' resize-none'}
                  placeholder="Any additional notes..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-all"
                >
                  {initialData ? 'Save Changes' : 'Add Subscription'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
