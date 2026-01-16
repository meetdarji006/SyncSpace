import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import supabase from "../config/supabase";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session: initialSession }, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session:", error.message);
            }
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (signed in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            toast.success("Login successful");
            return { data, error: null };
        } catch (error) {
            toast.error(error.message);
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    }

    const register = async (email, password, name) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name, // 👈 goes into raw_user_meta_data
                    },
                },
            });

            if (error) throw error;
            toast.success("Registration successful! Check your email for verification.");
            return { data, error: null };
        } catch (error) {
            toast.error(error.message);
            return { data: null, error };
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            toast.success("Logout successful");
        } catch (error) {
            toast.error(error.message);
        }
    }

    const value = {
        user,
        session,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default useAuth;
