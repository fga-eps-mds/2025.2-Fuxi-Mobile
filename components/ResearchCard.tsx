import { ResearchData } from '@/app/tabs/home';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from "../theme/colors";

interface ResearchCardProps {
    research: ResearchData;
    onPress?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    showActions?: boolean;
}

// React.fc = componente funcional com tipagem de props
export const ResearchCard: React.FC<ResearchCardProps> = ({ research, onPress, onEdit, onDelete, showActions = false }) => {
    const membersList = research.members.length > 1 ? `Membros: ${research.members[0]}, ${research.members[1]}, ...` : `Membro: ${research.members[0]}`;

    const cardContent = (
        <>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{research.title}</Text>
                <Text style={styles.cardDescription}>{research.description}</Text>
                <Text style={styles.cardInfo}>{membersList}</Text>
            </View>

            {showActions ? (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity onPress={() => onEdit?.(research.id)} style={styles.actionButton}>
                        <Feather name='edit' color={colors.primary} size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete?.(research.id)} style={styles.actionButton}>
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
                onPress={() => onPress(research.id)}
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