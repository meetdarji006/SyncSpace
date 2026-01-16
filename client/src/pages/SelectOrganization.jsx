import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';
import { toast } from 'sonner';
import Logo from '../components/Logo';

const SelectOrganization = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [orgDescription, setOrgDescription] = useState(''); // Added description
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        if (user) {
            fetchOrganizations();
        }
    }, [user]);

    const fetchOrganizations = async () => {
        try {
            const response = await api.get('/organizations', {
                params: { userId: user.id }
            });
            setOrganizations(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load organizations");
        }
    }

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        if (!orgName.trim()) return;

        setLoading(true);
        try {
            const response = await api.post('/organizations', {
                name: orgName,
                description: orgDescription,
                userId: user.id
            });

            toast.success('Organization created successfully!');
            navigate('/dashboard', { state: { organizationId: response.data.id } });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create organization");
        } finally {
            setLoading(false);
        }
    };

    const handleJoinOrg = async (e) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setLoading(true);
        try {
            // Assuming inviteCode is the organization ID for now
            const response = await api.post('/organizations/join', {
                organizationId: inviteCode,
                userId: user.id
            });

            toast.success('Joined organization successfully!');
            navigate('/dashboard', { state: { organizationId: inviteCode } });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to join organization");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOrg = (orgId) => {
        navigate('/dashboard', { state: { organizationId: orgId } });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <Logo className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome to SyncSpace</h1>
                    <p className="mt-2 text-gray-600">To get started, create a new organization, join an existing one, or select one below.</p>
                </div>

                <div className="space-y-4">
                    {!isCreating && !isJoining ? (
                        <>
                            {organizations.length > 0 && (
                                <div className="mb-6 space-y-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Organizations</p>
                                    {organizations.map(org => (
                                        <button
                                            key={org.id}
                                            onClick={() => handleSelectOrg(org.id)}
                                            className="w-full bg-white p-4 rounded-xl border border-gray-200 hover:border-brand-primary/50 hover:shadow-md transition-all text-left flex items-center justify-between group"
                                        >
                                            <div>
                                                <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">{org.name}</h3>
                                                {org.description && <p className="text-xs text-gray-500">{org.description}</p>}
                                            </div>
                                            <svg className="w-5 h-5 text-gray-300 group-hover:text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            )}

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
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={orgDescription}
                                        onChange={(e) => setOrgDescription(e.target.value)}
                                        placeholder="What's this organization about?"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Invite Code (Organization ID)</label>
                                    <input
                                        type="text"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                        placeholder="Enter Organization ID"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                        required
                                    />
                                    <p className="mt-2 text-xs text-gray-400">Ask your organization administrator for the ID.</p>
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
