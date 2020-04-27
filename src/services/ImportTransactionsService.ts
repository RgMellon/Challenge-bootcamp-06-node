import fs from 'fs';
import csv from 'csv-parser';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';
import FindOrCreateCategoryService from './FindOrCreateCategoryService';

interface Row {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const readStream = fs.createReadStream(path);

    const parser = readStream.pipe(
      csv({
        headers: ['title', 'type', 'value', 'category'],
        mapValues: ({ value }) => value.trim(),
        skipLines: 1,
      }),
    );

    const transactions: Row[] = [];

    parser.on('data', async (transaction: Row) => {
      transactions.push(transaction);
    });

    parser.on('error', () => {
      throw new Error('Error trying to read CSV file');
    });

    await new Promise(resolve => parser.on('end', resolve));

    const createTransaction = new CreateTransactionService();

    const transactionsResult: Transaction[] = [];

    for (const item of transactions) {
      // console.log('Antes de entrar no metodo');
      const transaction = await createTransaction.execute({
        title: item.title,
        value: item.value,
        type: item.type,
        category: item.category,
      });
      // console.log('Executei uma vez');

      transactionsResult.push(transaction);
    }

    return transactionsResult;
  }
}

export default ImportTransactionsService;
