import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/withObservables';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { database } from '../db';

const ExpenseItem = ({ expense }) => (
  <View style={styles.expenseItem}>
    <View>
      <Text style={styles.expenseCategory}>{expense.category.toUpperCase()}</Text>
      <Text style={styles.expenseDesc}>{expense.description || 'No description'}</Text>
    </View>
    <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
  </View>
);

const FinanceScreen = ({ expenses, budgets }) => {
  const currentBudget = budgets[0] || { limit_amount: 0, spent_amount: 0 };
  const percentSpent = currentBudget.limit_amount > 0 
    ? (currentBudget.spent_amount / currentBudget.limit_amount) * 100 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.budgetCard}>
        <View style={styles.budgetInfo}>
          <Text style={styles.budgetLabel}>Monthly Budget</Text>
          <Text style={styles.budgetValue}>₹{currentBudget.spent_amount} / ₹{currentBudget.limit_amount}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { 
            width: `${Math.min(percentSpent, 100)}%`,
            backgroundColor: percentSpent > 90 ? '#FF3B30' : percentSpent > 70 ? '#FF9500' : '#34C759'
          }]} />
        </View>
        <Text style={styles.budgetStatus}>
          {percentSpent.toFixed(1)}% of budget spent
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Recent Expenses</Text>
      <FlatList
        data={expenses}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ExpenseItem expense={item} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>No expenses recorded.</Text>}
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  budgetCard: {
    backgroundColor: '#1C1C1E',
    margin: 15,
    padding: 20,
    borderRadius: 15,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  budgetLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  budgetValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#2C2C2E',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  budgetStatus: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 15,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  expenseCategory: {
    color: '#5856D6',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expenseDesc: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 2,
  },
  expenseAmount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#5856D6',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const enhance = withObservables([], () => ({
  expenses: database.get('expenses').query(),
  budgets: database.get('budgets').query()
}));

export default enhance(FinanceScreen);
