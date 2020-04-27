import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactionsRepository = getRepository(Transaction);

    const transactions = await transactionsRepository.find();

    const incomes = transactions.filter(item => item.type === 'income');
    const sumIncomes = incomes.reduce(
      (total, current) => total + current.value,
      0,
    );

    const outcomes = transactions.filter(item => item.type === 'outcome');
    const sumOutcomes = outcomes.reduce(
      (total, current) => total + current.value,
      0,
    );

    return {
      income: sumIncomes,
      outcome: sumOutcomes,
      total: sumIncomes - sumOutcomes,
    };
  }
}

export default TransactionsRepository;
