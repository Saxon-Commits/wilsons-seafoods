import React, { useState } from 'react';
import { supabase } from '../supabase';

const ContactForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error: supabaseError } = await supabase
                .from('contact_submissions')
                .insert([
                    { name, email, message }
                ]);

            if (supabaseError) throw supabaseError;

            setSubmitted(true);
        } catch (err: any) {
            console.error('Error submitting form:', err);
            setError('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <section id="contact" className="text-center bg-slate-800 rounded-xl p-8 md:p-12 border border-slate-700">
                <h2 className="text-3xl font-serif font-bold text-white">Thank You!</h2>
                <p className="mt-4 text-slate-300 text-lg">Your message has been sent. We'll get back to you shortly.</p>
            </section>
        );
    }

    return (
        <section id="contact" className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-12">Have a question or a special request? Drop us a line.</p>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-slate-800 p-8 rounded-xl border border-slate-700">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <label htmlFor="name" className="sr-only">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your Email"
                            required
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="message" className="sr-only">Message</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your Message"
                        rows={5}
                        required
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
                {error && (
                    <div className="bg-red-500/20 text-red-400 p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-brand-blue text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-opacity-80 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </section>
    );
};

export default ContactForm;