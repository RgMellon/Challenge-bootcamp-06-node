import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddColumnTitleOnTransactionTablw1587823983829
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.addColumn(
      'transactions',
      new TableColumn({
        name: 'title',
        type: 'varchar',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropColumn('transactions', 'title');
  }
}
