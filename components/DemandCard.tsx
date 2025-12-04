import { DemandData } from '@/app/tabs/home';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from "../theme/colors";

interface DemandCardProps {
    demand: DemandData;
    onPress?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    showActions?: boolean;
}

// React.fc = componente funcional com tipagem de props
export const DemandCard: React.FC<DemandCardProps> = ({ demand, onPress, onEdit, onDelete, showActions = false }) => {
    const cardContent = (
        <>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{demand.title}</Text>
                <Text style={styles.cardDescription}>{demand.description}</Text>
            </View>

            {showActions ? (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => onEdit?.(demand.id)} style={styles.actionButton}>
                        <Feather name='edit' color={colors.primary} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete?.(demand.id)} style={styles.actionButton}>
                        <Feather name='trash-2' color={colors.danger} size={24} />
                    </TouchableOpacity>
                </View>
            ) : (
                onPress && <Feather name='chevron-right' color={colors.primary} size={24} style={styles.icon} />
            )}
        </>
    );

    if (onPress) {
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => onPress(demand.id)}
                activeOpacity={0.7}
            >
                {cardContent}
            </TouchableOpacity>
        );
    }

    return <View style={styles.card}>{cardContent}</View>;
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f5f8ff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        paddingRight: 10,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#003A7A',
        marginBottom: 5,
    },
    cardDescription: {
        fontSize: 14,
        color: '#333',
        marginBottom: 3,
    },
    cardInfo: {
        fontSize: 12,
        color: '#666',
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        marginLeft: 15,
    },
    icon: {
        alignSelf: 'center',
    }
});