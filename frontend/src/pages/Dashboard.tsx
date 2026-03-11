import { useState } from 'react';
import { useSubscriptions, type Subscription } from '../context/SubscriptionContext';
import { Plus, Wallet, CalendarDays, Activity, Trash2, Edit2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SubscriptionModal from '../components/SubscriptionModal';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

export default function Dashboard() {
  const { isSignedIn, isLoaded } = useAuth();
  const {
    subscriptions,
    totalMonthlySpend,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  // Show nothing while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  const handleAddOrEdit = async (data: Omit<Subscription, 'id'>) => {
    if (editingSub) {
      await updateSubscription(editingSub.id, data);
      setEditingSub(null);
    } else {
      await addSubscription(data);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSubscription(id);
  };

  const openEditModal = (sub: Subscription) => {
    setEditingSub(sub);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSub(null);
  };

  // Sort subscriptions by renewal date for display
  const upcomingRenewals = [...subscriptions].sort((a, b) =>
    new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  );
  const nextRenewal = upcomingRenewals.length > 0 ? upcomingRenewals[0] : null;

  const stats = [
    {
      name: 'Total Monthly Spend',
      value: `₹${totalMonthlySpend.toLocaleString()}`,
      icon: Wallet,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      name: 'Active Subscriptions',
      value: subscriptions.length.toString(),
      icon: Activity,
      color: 'text-brand-500',
      bg: 'bg-brand-500/10',
    },
    {
      name: 'Next Renewal',
      value: nextRenewal ? nextRenewal.name : 'None',
      subtext: nextRenewal ? `On ${new Date(nextRenewal.renewalDate).toLocaleDateString()}` : '',
      icon: CalendarDays,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your recurring expenses and upcoming renewals.</p>
        </div>
        <button
          onClick={() => { setEditingSub(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 transition-all"
        >
          <Plus size={18} /> Add Subscription
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400"
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading your subscriptions...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 flex items-start gap-4"
              >
                <div className={`rounded-xl p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  {stat.subtext && (
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Subscription List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Your Subscriptions</h2>
              {loading && subscriptions.length > 0 && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">Service Name</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Renewal Date</th>
                    <th className="px-6 py-4 font-medium">Alert Days Before</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {subscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                        No subscriptions found. Start by adding one!
                      </td>
                    </tr>
                  ) : (
                    upcomingRenewals.map((sub) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{sub.name}</td>
                        <td className="px-6 py-4">
                          ₹{sub.price.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {new Date(sub.renewalDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center rounded-full bg-brand-500/10 px-2 py-1 text-xs font-medium text-brand-400 ring-1 ring-inset ring-brand-500/20">
                            {sub.notifyBeforeDays} days
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(sub)}
                            className="p-2 text-muted-foreground hover:text-brand-400 transition-colors bg-white/5 rounded-lg border border-white/5"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-white/5 rounded-lg border border-white/5"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* Add / Edit Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleAddOrEdit}
        initialData={editingSub}
      />
    </div>
  );
}
