import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { ContactSubmission } from '../types';

const AdminMessages: React.FC = () => {
    const [messages, setMessages] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('contact_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching messages:', error);
        } else {
            setMessages(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        const { error } = await supabase
            .from('contact_submissions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        } else {
            setMessages(prev => prev.filter(m => m.id !== id));
        }
    };

    if (loading) return <div className="text-white">Loading messages...</div>;

    return (
        <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6 font-serif text-white">Inbox</h2>
            {messages.length === 0 ? (
                <p className="text-slate-400">No messages yet.</p>
            ) : (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className="bg-slate-700 p-4 sm:p-5 rounded-md border border-slate-600">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white">{msg.name}</h3>
                                    <p className="text-sm sm:text-base text-slate-400 break-all">{msg.email}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {msg.created_at ? new Date(msg.created_at).toLocaleString() : 'Unknown Date'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => msg.id && handleDelete(msg.id)}
                                    className="text-red-400 hover:text-red-300 text-sm font-medium self-start sm:self-auto px-3 py-1.5 rounded bg-red-900/20 hover:bg-red-900/30 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                            <p className="text-slate-300 text-base whitespace-pre-wrap break-words">{msg.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminMessages;
