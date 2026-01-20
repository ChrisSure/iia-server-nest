import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'alarms' })
export class AlarmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime' })
  date: Date;
}
