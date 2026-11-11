'use client';

import { useState, useEffect } from 'react';
import { X, Send, Paperclip, FileText, CheckCircle2 } from 'lucide-react';

export default function SendProposalModal({
    deal,
    isOpen,
    onClose,
    onSuccess,
}: {
    deal: any | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (updatedDeal: any) => void;
}) {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (deal) {
            setRecipientEmail(deal.email || '');
            const program =
                deal.productCategory === 'KIDS_MENTORING'
                    ? 'Mentoring Pemrograman Anak'
                    : 'Pelatihan Profesional IT';
            const topik = deal.topic ? ` - Topik ${deal.topic}` : '';
            const instansi = deal.companyName ? ` untuk ${deal.companyName}` : '';

            setSubject(`Penawaran Proposal & Silabus: ${program}${topik}${instansi}`);
            setMessage(
                `Yth. ${deal.clientName},\n\nTerima kasih telah berkomunikasi dengan tim kami. Bersama pesan ini, kami lampirkan dokumen proposal penawaran serta silabus kurikulum sesuai dengan kebutuhan yang telah kita diskusikan.\n\nJika ada penyesuaian materi atau skema pelatihan, silakan menghubungi kami kembali.\n\nSalam hangat,\nTim Digital Marketing & Pelatihan`
            );
            setAttachment(null);
            setErrorMsg('');
        }
    }, [deal, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!deal) return;

        setLoading(true);
        setErrorMsg('');

        const formData = new FormData();
        formData.append('dealId', deal.id);
        formData.append('recipientEmail', recipientEmail);
        formData.append('subject', subject);
        formData.append('message', message);
        if (attachment) {
            formData.append('attachment', attachment);
        }

        try {
            const res = await fetch('/api/proposals/send', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            setLoading(false);

            if (res.ok) {
                onSuccess(data.deal);
                onClose();
            } else {
                setErrorMsg(data.error || 'Gagal mengirim email proposal');
            }
        } catch (err) {
            setLoading(false);
            setErrorMsg('Terjadi kesalahan jaringan.');
        }
    };

    if (!isOpen || !deal) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <Send className="w-4 h-4 text-blue-600" />
                            Kirim Proposal & Silabus
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Klien: <span className="font-semibold text-slate-700 dark:text-slate-300">{deal.clientName}</span> ({deal.phone})
                        </p>
                    </div>
                    <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {errorMsg && (
                    <div className="mt-3 p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 text-xs">
                    <div>
                        <label className="font-semibold text-slate-600 dark:text-slate-400">Email Tujuan Klien *</label>
                        <input
                            required
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="klien@instansi.com"
                            className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-slate-600 dark:text-slate-400">Subjek Email *</label>
                        <input
                            required
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="mt-1 w-full border rounded-lg p-2 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-slate-600 dark:text-slate-400">Pesan Pengantar *</label>
                        <textarea
                            required
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1 w-full border rounded-lg p-2.5 border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-slate-600 dark:text-slate-400">Lampirkan PDF Proposal / Silabus</label>
                        <div className="mt-1 flex items-center gap-2">
                            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                                <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                                <span>Pilih File PDF</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                            </label>
                            {attachment && (
                                <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[250px]">
                                    <FileText className="w-3 h-3 text-blue-500 shrink-0" />
                                    {attachment.name}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-[11px] text-blue-700 dark:text-blue-300 flex items-start gap-2 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <p>
                            Email akan dikirimkan via server resmi kantor. Jika sukses, email tersimpan otomatis ke deal, kuota harian terpotong 1, dan kartu deal langsung pindah ke tahap <strong>Proposal</strong>.
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                            <Send className="w-3.5 h-3.5" />
                            {loading ? 'Mengirim Email...' : 'Kirim Proposal Sekarang'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}