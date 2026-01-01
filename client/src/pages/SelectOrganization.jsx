import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import supabase from '../config/supabase';
import { toast } from 'sonner';
import Logo from '../components/Logo';

const SelectOrganization = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        if (!orgName.trim()) return;

        setLoading(true);
        try {
            // 1. Create the organization
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .insert([{ name: orgName }])
                .select()
                .single();

            if (orgError) throw orgError;

            // 2. Add the user as an owner/member
            const { error: memberError } = await supabase
                .from('organization_members')
                .insert([{
                    organization_id: org.id,
                    user_id: user.id,
                    role: 'owner'
                }]);

            if (memberError) throw memberError;

            toast.success('Organization created successfully!');
            await refreshOrganizations();
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinOrg = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setLoading(true);
        try {
            // This is a simplified join logic assuming invite code is the org ID for now
            // In a real app, you'd lookup the invite code or verify it
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .select('id')
                .eq('id', inviteCode)
                .single();

            if (orgError) throw new Error('Invalid invite code or organization not found');

            const { error: memberError } = await supabase
                .from('organization_members')
                .insert([{
                    organization_id: org.id,
                    user_id: user.id,
                    role: 'member'
                }]);

            if (memberError) throw memberError;

            toast.success('Joined organization successfully!');
            await refreshOrganizations();
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Logo className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome to SyncSpace</h1>
                    <p className="mt-2 text-gray-600">To get started, create a new organization or join an existing one.</p>
                </div>

                <div className="space-y-4">
                    {!isCreating && !isJoining ? (
                        <>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full bg-white p-6 rounded-2xl border-2 border-transparent hover:border-brand-primary/20 shadow-sm hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Create a new organization</h3>
                                        <p className="text-sm text-gray-500">Start fresh and invite your team later.</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setIsJoining(true)}
                                className="w-full bg-white p-6 rounded-2xl border-2 border-transparent hover:border-brand-primary/20 shadow-sm hover:shadow-md transition-all text-left group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Join an existing organization</h3>
                                        <p className="text-sm text-gray-500">Use an invite code from your teammate.</p>
                                    </div>
                                </div>
                            </button>
                        </>
                    ) : isCreating ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-xl font-bold mb-4">Create Organization</h3>
                            <form onSubmit={handleCreateOrg} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Organization Name</label>
                                    <input
                                        type="text"
                                        value={orgName}
                                        onChange={(e) => setOrgName(e.target.value)}
                                        placeholder="e.g. Acme Corp"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreating(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-2 bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Organization'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-xl font-bold mb-4">Join Organization</h3>
                            <form onSubmit={handleJoinOrg} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Invite Code</label>
                                    <input
                                        type="text"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        placeholder="Enter your invite code"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                        required
                                    />
                                    <p className="mt-2 text-xs text-gray-400">Ask your organization administrator for the code.</p>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsJoining(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-2 bg-brand-primary text-white font-bold py-2 rounded-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Joining...' : 'Join Organization'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectOrganization;
