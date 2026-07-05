import { useEffect, useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWallets, createWallet, deleteWallet, createTransfer } from '@/store/slices/walletSlice';
import { formatCurrency } from '@/lib/utils';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineArrowsRightLeft, HiOutlineWallet } from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';

const WALLET_ICONS = ['💵', '🏦', '💳', '🏛️', '💰', '🐖', '📈', '💼'];

const Wallets = () => {
    const dispatch = useAppDispatch();
    const { wallets, netWorth, isLoading, error } = useAppSelector((state) => state.wallet);

    const [walletDialog, setWalletDialog] = useState(false);
    const [transferDialog, setTransferDialog] = useState(false);

    const [walletForm, setWalletForm] = useState({
        name: '',
        type: 'cash' as 'cash' | 'bank',
        icon: '💵',
        openingBalance: '',
    });

    const [transferForm, setTransferForm] = useState({
        fromWalletId: '',
        toWalletId: '',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        dispatch(fetchWallets());
    }, [dispatch]);

    const handleCreateWallet = async (e: FormEvent) => {
        e.preventDefault();
        const result = await dispatch(createWallet({
            name: walletForm.name,
            type: walletForm.type,
            icon: walletForm.icon,
            openingBalance: parseFloat(walletForm.openingBalance) || 0,
        }));
        if (createWallet.fulfilled.match(result)) {
            setWalletDialog(false);
            setWalletForm({ name: '', type: 'cash', icon: '💵', openingBalance: '' });
        }
    };

    const handleTransfer = async (e: FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(transferForm.amount);
        if (isNaN(amount) || amount <= 0) return;
        if (transferForm.fromWalletId === transferForm.toWalletId) return;

        const result = await dispatch(createTransfer({
            fromWalletId: transferForm.fromWalletId,
            toWalletId: transferForm.toWalletId,
            amount,
            date: transferForm.date,
            note: transferForm.note || undefined,
        }));
        if (createTransfer.fulfilled.match(result)) {
            setTransferDialog(false);
            setTransferForm({ fromWalletId: '', toWalletId: '', amount: '', note: '', date: new Date().toISOString().split('T')[0] });
        }
    };

    const openTransfer = () => {
        // Pre-fill sensible defaults: first wallet -> second wallet.
        setTransferForm((f) => ({
            ...f,
            fromWalletId: wallets[0]?.id || '',
            toWalletId: wallets[1]?.id || wallets[0]?.id || '',
        }));
        setTransferDialog(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('Delete this wallet? Only wallets with no transactions can be deleted.')) {
            dispatch(deleteWallet(id));
        }
    };

    if (isLoading && wallets.length === 0) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
                    <p className="text-gray-500 mt-1">Your accounts and balances</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={openTransfer} disabled={wallets.length < 2}>
                        <HiOutlineArrowsRightLeft className="mr-2 h-5 w-5" />
                        Transfer
                    </Button>
                    <Button onClick={() => setWalletDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                        <HiOutlinePlus className="mr-2 h-5 w-5" />
                        Add Wallet
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-xl">{error}</div>
            )}

            {/* Net worth */}
            <Card className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div>
                    <p className="text-sm font-medium text-blue-100">Total Net Worth</p>
                    <h3 className="text-3xl font-bold mt-1">{formatCurrency(netWorth)}</h3>
                    <p className="text-xs text-blue-100 mt-1">{wallets.length} wallets</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                    <HiOutlineWallet className="h-7 w-7" />
                </div>
            </Card>

            {/* Wallet cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wallets.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-8">No wallets yet. Add one to get started.</p>
                ) : (
                    wallets.map((wallet) => (
                        <Card key={wallet.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl border border-gray-100">
                                    {wallet.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">{wallet.name}</p>
                                    <p className="text-xs text-gray-400 capitalize">{wallet.type}</p>
                                    <h4 className={`text-lg font-bold mt-1 ${wallet.balance < 0 ? 'text-rose-600' : 'text-gray-900'}`}>
                                        {formatCurrency(wallet.balance)}
                                    </h4>
                                </div>
                            </div>
                            <Button variant="ghost" className="text-gray-400 hover:text-red-500 p-2" onClick={() => handleDelete(wallet.id)}>
                                <HiOutlineTrash className="h-5 w-5" />
                            </Button>
                        </Card>
                    ))
                )}
            </div>

            {/* Add wallet modal */}
            <Modal isOpen={walletDialog} onClose={() => setWalletDialog(false)} title="Add New Wallet">
                <form onSubmit={handleCreateWallet} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Select Icon</label>
                        <div className="grid grid-cols-4 gap-3">
                            {WALLET_ICONS.map((icon) => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => setWalletForm({ ...walletForm, icon })}
                                    className={`text-2xl p-3 rounded-xl transition-all ${walletForm.icon === icon
                                        ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                                        : 'bg-gray-50 hover:bg-gray-100 hover:scale-105'
                                        }`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Input
                        label="Name"
                        placeholder="e.g., BOC, Cash, Commercial Bank"
                        value={walletForm.name}
                        onChange={(e) => setWalletForm({ ...walletForm, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={walletForm.type}
                            onChange={(e) => setWalletForm({ ...walletForm, type: e.target.value as 'cash' | 'bank' })}
                        >
                            <option value="cash">Cash</option>
                            <option value="bank">Bank</option>
                        </select>
                    </div>

                    <Input
                        label="Opening Balance"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={walletForm.openingBalance}
                        onChange={(e) => setWalletForm({ ...walletForm, openingBalance: e.target.value })}
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setWalletDialog(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700">Add Wallet</Button>
                    </div>
                </form>
            </Modal>

            {/* Transfer modal */}
            <Modal isOpen={transferDialog} onClose={() => setTransferDialog(false)} title="Transfer Between Wallets">
                <form onSubmit={handleTransfer} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={transferForm.fromWalletId}
                            onChange={(e) => setTransferForm({ ...transferForm, fromWalletId: e.target.value })}
                            required
                        >
                            {wallets.map((w) => (
                                <option key={w.id} value={w.id}>{w.icon} {w.name} — {formatCurrency(w.balance)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={transferForm.toWalletId}
                            onChange={(e) => setTransferForm({ ...transferForm, toWalletId: e.target.value })}
                            required
                        >
                            {wallets.filter((w) => w.id !== transferForm.fromWalletId).map((w) => (
                                <option key={w.id} value={w.id}>{w.icon} {w.name} — {formatCurrency(w.balance)}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={transferForm.amount}
                        onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                        required
                    />

                    <Input
                        label="Note (optional)"
                        placeholder="e.g., ATM withdrawal"
                        value={transferForm.note}
                        onChange={(e) => setTransferForm({ ...transferForm, note: e.target.value })}
                    />

                    <Input
                        label="Date"
                        type="date"
                        value={transferForm.date}
                        onChange={(e) => setTransferForm({ ...transferForm, date: e.target.value })}
                        required
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={() => setTransferDialog(false)}>Cancel</Button>
                        <Button type="submit" isLoading={isLoading} className="bg-blue-600 hover:bg-blue-700">Transfer</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Wallets;
