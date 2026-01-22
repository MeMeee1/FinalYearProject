import { useState } from 'react';
import {
    View,
    TextInput,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Pressable,
    ScrollView,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductListItem from '@/components/ProductListItem';
import { useBreakpointValue } from '@/components/ui/utils/use-break-point-value';
import { listProducts } from '@/api/products';
import { useQuery } from '@tanstack/react-query';
import { Text } from '@/components/ui/text';

// Product categories based on productTags from schema
const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🏠' },
    { id: 'Chicken', label: 'Chicken', icon: '🍗' },
    { id: 'Fish', label: 'Fish', icon: '🐟' },
    { id: 'Eggs', label: 'Eggs', icon: '🥚' },
];

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: listProducts,
    });

    const numColumns = useBreakpointValue({
        default: 2,
        sm: 3,
        xl: 4,
    });

    // Filter products based on search and category
    const filteredProducts = data?.data?.filter((product: any) => {
        const matchesSearch =
            !searchQuery ||
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            selectedCategory === 'all' || product.productTags === selectedCategory;

        return matchesSearch && matchesCategory;
    }) || [];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text className="text-2xl font-bold text-gray-800">Fresh Farm</Text>
                <Text className="text-gray-500 mt-1">Quality poultry products</Text>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Search size={20} color="#9ca3af" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search products..."
                        placeholderTextColor="#9ca3af"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
                            <X size={18} color="#9ca3af" />
                        </Pressable>
                    )}
                </View>
            </View>

            {/* Category Filters */}
            <View style={styles.categoriesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {CATEGORIES.map((category) => (
                        <Pressable
                            key={category.id}
                            style={[
                                styles.categoryChip,
                                selectedCategory === category.id && styles.categoryChipActive,
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Text style={styles.categoryIcon}>{category.icon}</Text>
                            <Text
                                className={
                                    selectedCategory === category.id
                                        ? 'text-white font-semibold'
                                        : 'text-gray-700'
                                }
                            >
                                {category.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Products */}
            {isLoading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#6366f1" />
                    <Text className="mt-4 text-gray-500">Loading products...</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text className="text-red-500 text-lg">Error fetching products</Text>
                    <Text className="text-gray-400 mt-2">Please try again later</Text>
                </View>
            ) : (
                <FlatList
                    key={numColumns}
                    data={filteredProducts}
                    numColumns={numColumns}
                    contentContainerStyle={styles.productsList}
                    columnWrapperClassName="gap-2"
                    renderItem={({ item }) => <ProductListItem product={item} />}
                    ListHeaderComponent={
                        <View style={styles.resultsHeader}>
                            <Text className="text-gray-600">
                                {filteredProducts.length} product
                                {filteredProducts.length !== 1 ? 's' : ''} found
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Text className="text-gray-500 text-lg">No products found</Text>
                            <Text className="text-gray-400 mt-2">
                                {searchQuery
                                    ? 'Try a different search term'
                                    : 'No products in this category'}
                            </Text>
                            {(searchQuery || selectedCategory !== 'all') && (
                                <Pressable
                                    style={styles.clearFiltersButton}
                                    onPress={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                    }}
                                >
                                    <Text className="text-indigo-600 font-medium">Clear filters</Text>
                                </Pressable>
                            )}
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
    },
    searchContainer: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    clearButton: {
        padding: 4,
    },
    categoriesContainer: {
        backgroundColor: '#ffffff',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    categoriesScroll: {
        paddingHorizontal: 16,
        gap: 10,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        gap: 6,
    },
    categoryChipActive: {
        backgroundColor: '#6366f1',
    },
    categoryIcon: {
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    productsList: {
        padding: 8,
        gap: 8,
    },
    resultsHeader: {
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        marginTop: 40,
    },
    clearFiltersButton: {
        marginTop: 16,
        padding: 12,
    },
});
