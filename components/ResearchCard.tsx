import { ResearchData } from '@/app/home/';
import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ResearchCardProps {
    research: ResearchData;
    onPress: (id: number) => void;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({ research, onPress }) => {
    const authorsList = research.authors.length > 1 ? `Autores: ${research.authors[0]}, ${research.authors[1]}, ...` : `Autor: ${research.authors[0]}`;

    // Toda a área do card deve ser clicável.
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => onPress(research.id)} 
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{research.title}</Text>
                <Text style={styles.cardDescription}>{research.description}</Text> 
                <Text style={styles.cardInfo}>{authorsList}</Text>
            </View>
            
            <Feather name='chevron-right' color="#003366" size={24} style={styles.icon} /> 
        </TouchableOpacity>
    );
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
        color: '#003366',
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
    icon: {
        alignSelf: 'center',
    }
});