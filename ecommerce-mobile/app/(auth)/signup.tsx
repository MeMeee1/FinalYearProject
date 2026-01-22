import {
    View,
    StyleSheet,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/text';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    User,
    MapPin,
    ChevronDown,
    UserPlus,
} from 'lucide-react-native';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/store/authStore';
import { Redirect, Link } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Available LGAs from the schema
const LGA_OPTIONS = [
    'Abaji',
    'Abuja Municipal',
    'Bwari',
    'Gwagwalada',
    'Kuje',
    'Kwali',
];

async function signupUser(userData: {
    email: string;
    password: string;
    name?: string;
    address?: string;
    lga?: string;
}) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    const data = await res.json();
    if (!res.ok) {
        throw Error(data.message || 'Failed to create account');
    }
    return data;
}

export default function SignupScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLgaPicker, setShowLgaPicker] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [address, setAddress] = useState('');
    const [lga, setLga] = useState('');

    const setUser = useAuth((s) => s.setUser);
    const setToken = useAuth((s) => s.setToken);
    const isLoggedIn = useAuth((s) => !!s.token);

    // Combine first name and surname for the API
    const fullName = [firstName, surname].filter(Boolean).join(' ');

    const signupMutation = useMutation({
        mutationFn: () =>
            signupUser({
                email,
                password,
                name: fullName || undefined,
                address: address || undefined,
                lga: lga || undefined,
            }),
        onSuccess: (data) => {
            console.log('Success: ', data);
            if (data.user && data.token) {
                setUser(data.user);
                setToken(data.token);
            }
        },
        onError: (err: Error) => {
            console.log('Error:', err);
            setError(err.message || 'Failed to create account');
        },
    });

    const handleSignup = () => {
        setError('');

        // Validation
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        signupMutation.mutate();
    };

    if (isLoggedIn) {
        return <Redirect href={'/(tabs)'} />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <UserPlus size={48} color="#6366f1" />
                    </View>
                    <Text className="text-3xl font-bold text-gray-800 mt-4">Create Account</Text>
                    <Text className="text-gray-500 mt-2">Join us and start shopping</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {/* Error Message */}
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text className="text-red-500 text-center">{error}</Text>
                        </View>
                    ) : null}

                    {/* Section: Account Information */}
                    <View style={styles.section}>
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Account Information
                        </Text>

                        {/* Email Input */}
                        <View style={styles.inputGroup}>
                            <Text className="text-gray-700 font-medium mb-2">Email *</Text>
                            <View style={styles.inputWrapper}>
                                <Mail size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    placeholderTextColor="#9ca3af"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputGroup}>
                            <Text className="text-gray-700 font-medium mb-2">Password *</Text>
                            <View style={styles.inputWrapper}>
                                <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="At least 6 characters"
                                    placeholderTextColor="#9ca3af"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color="#9ca3af" />
                                    ) : (
                                        <Eye size={20} color="#9ca3af" />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputGroup}>
                            <Text className="text-gray-700 font-medium mb-2">Confirm Password *</Text>
                            <View style={styles.inputWrapper}>
                                <Lock size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Re-enter your password"
                                    placeholderTextColor="#9ca3af"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                />
                                <Pressable
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={styles.eyeButton}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color="#9ca3af" />
                                    ) : (
                                        <Eye size={20} color="#9ca3af" />
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Section: Personal Details */}
                    <View style={styles.section}>
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Personal Details
                        </Text>
                        <Text className="text-gray-400 text-sm mb-4">
                            Optional - you can add these later
                        </Text>

                        {/* Name Row - First Name and Surname */}
                        <View style={styles.rowInputs}>
                            {/* First Name Input */}
                            <View style={[styles.inputGroup, styles.halfInput]}>
                                <Text className="text-gray-700 font-medium mb-2">First Name</Text>
                                <View style={styles.inputWrapper}>
                                    <User size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="First name"
                                        placeholderTextColor="#9ca3af"
                                        value={firstName}
                                        onChangeText={setFirstName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            {/* Surname Input */}
                            <View style={[styles.inputGroup, styles.halfInput]}>
                                <Text className="text-gray-700 font-medium mb-2">Surname</Text>
                                <View style={styles.inputWrapper}>
                                    <User size={20} color="#9ca3af" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Surname"
                                        placeholderTextColor="#9ca3af"
                                        value={surname}
                                        onChangeText={setSurname}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Section: Location */}
                    <View style={styles.section}>
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Location
                        </Text>
                        <Text className="text-gray-400 text-sm mb-4">
                            Optional - helps us show nearby products
                        </Text>

                        {/* Address Input */}
                        <View style={styles.inputGroup}>
                            <Text className="text-gray-700 font-medium mb-2">Address</Text>
                            <View style={styles.inputWrapper}>
                                <MapPin size={20} color="#9ca3af" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Your delivery address"
                                    placeholderTextColor="#9ca3af"
                                    value={address}
                                    onChangeText={setAddress}
                                />
                            </View>
                        </View>

                        {/* LGA Picker */}
                        <View style={styles.inputGroup}>
                            <Text className="text-gray-700 font-medium mb-2">
                                Local Government Area
                            </Text>
                            <Pressable
                                style={styles.inputWrapper}
                                onPress={() => setShowLgaPicker(!showLgaPicker)}
                            >
                                <MapPin size={20} color="#9ca3af" style={styles.inputIcon} />
                                <Text
                                    style={[
                                        styles.pickerText,
                                        !lga && styles.pickerPlaceholder,
                                    ]}
                                >
                                    {lga || 'Select your LGA'}
                                </Text>
                                <ChevronDown
                                    size={20}
                                    color="#9ca3af"
                                    style={styles.chevronIcon}
                                />
                            </Pressable>

                            {/* LGA Options */}
                            {showLgaPicker && (
                                <View style={styles.pickerOptions}>
                                    {LGA_OPTIONS.map((option) => (
                                        <Pressable
                                            key={option}
                                            style={[
                                                styles.pickerOption,
                                                lga === option && styles.pickerOptionSelected,
                                            ]}
                                            onPress={() => {
                                                setLga(option);
                                                setShowLgaPicker(false);
                                            }}
                                        >
                                            <Text
                                                className={
                                                    lga === option
                                                        ? 'text-indigo-600 font-medium'
                                                        : 'text-gray-700'
                                                }
                                            >
                                                {option}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Sign Up Button */}
                    <Pressable
                        style={[
                            styles.signUpButton,
                            signupMutation.isPending && styles.signUpButtonDisabled,
                        ]}
                        onPress={handleSignup}
                        disabled={signupMutation.isPending}
                    >
                        {signupMutation.isPending ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Create Account</Text>
                        )}
                    </Pressable>

                    {/* Sign In Link */}
                    <View style={styles.signInContainer}>
                        <Text className="text-gray-600">Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <Pressable>
                                <Text className="text-indigo-600 font-bold">Sign In</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 24,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    errorContainer: {
        backgroundColor: '#fef2f2',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    section: {
        marginBottom: 24,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    inputGroup: {
        marginBottom: 16,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: {
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    inputIcon: {
        marginLeft: 12,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 10,
        fontSize: 15,
        color: '#1f2937',
    },
    eyeButton: {
        padding: 14,
    },
    pickerText: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 10,
        fontSize: 15,
        color: '#1f2937',
    },
    pickerPlaceholder: {
        color: '#9ca3af',
    },
    chevronIcon: {
        marginRight: 12,
    },
    pickerOptions: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        overflow: 'hidden',
    },
    pickerOption: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    pickerOptionSelected: {
        backgroundColor: '#eef2ff',
    },
    signUpButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
        marginTop: 8,
    },
    signUpButtonDisabled: {
        backgroundColor: '#a5b4fc',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
});
