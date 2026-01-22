import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useAuth } from '@/store/authStore';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText } from '@/components/ui/button';
import {
    User,
    Mail,
    Settings,
    HelpCircle,
    Shield,
    LogOut,
    ChevronRight,
    Bell,
    CreditCard,
    MapPin,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

type MenuItemProps = {
    icon: any;
    label: string;
    onPress?: () => void;
    danger?: boolean;
};

function MenuItem({ icon: Icon, label, onPress, danger }: MenuItemProps) {
    return (
        <Pressable onPress={onPress} style={styles.menuItem}>
            <HStack className="items-center flex-1" space="md">
                <View style={[styles.iconContainer, danger && styles.dangerIcon]}>
                    <Icon size={20} color={danger ? '#ef4444' : '#6366f1'} />
                </View>
                <Text className={`flex-1 ${danger ? 'text-red-500' : 'text-gray-800'}`}>
                    {label}
                </Text>
                <ChevronRight size={18} color="#9ca3af" />
            </HStack>
        </Pressable>
    );
}

export default function ProfileScreen() {
    const user = useAuth((s) => s.user);
    const logout = useAuth((s) => s.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/login');
    };

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <User size={40} color="#6366f1" />
                </View>
                <VStack className="items-center mt-4">
                    <Text className="text-xl font-bold text-gray-800">
                        {user?.name || 'Guest User'}
                    </Text>
                    <HStack className="items-center mt-1" space="xs">
                        <Mail size={14} color="#9ca3af" />
                        <Text className="text-gray-500">{user?.email || 'Not logged in'}</Text>
                    </HStack>
                </VStack>
            </View>

            {/* Menu Sections */}
            <View style={styles.section}>
                <Text className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">
                    Account
                </Text>
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon={User}
                        label="Edit Profile"
                        onPress={() => console.log('Edit profile')}
                    />
                    <MenuItem
                        icon={MapPin}
                        label="Addresses"
                        onPress={() => console.log('Addresses')}
                    />
                    <MenuItem
                        icon={CreditCard}
                        label="Payment Methods"
                        onPress={() => console.log('Payment methods')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">
                    Preferences
                </Text>
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon={Bell}
                        label="Notifications"
                        onPress={() => console.log('Notifications')}
                    />
                    <MenuItem
                        icon={Settings}
                        label="Settings"
                        onPress={() => console.log('Settings')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text className="text-xs font-semibold text-gray-400 uppercase mb-2 px-4">
                    Support
                </Text>
                <View style={styles.menuGroup}>
                    <MenuItem
                        icon={HelpCircle}
                        label="Help Center"
                        onPress={() => console.log('Help')}
                    />
                    <MenuItem
                        icon={Shield}
                        label="Privacy Policy"
                        onPress={() => console.log('Privacy')}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <View style={styles.menuGroup}>
                    <MenuItem icon={LogOut} label="Log Out" onPress={handleLogout} danger />
                </View>
            </View>

            {/* App Version */}
            <Text className="text-center text-gray-400 text-xs mt-6 mb-8">
                Version 1.0.0
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#ffffff',
        paddingVertical: 32,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginTop: 24,
    },
    menuGroup: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
    },
    menuItem: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dangerIcon: {
        backgroundColor: '#fef2f2',
    },
});
