import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'units' })
export class UnitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  point: number;

  @Column({ type: 'datetime' })
  date: Date;
}
