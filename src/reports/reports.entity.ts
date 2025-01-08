import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  lnt: number;

  @Column()
  lat: number;

  @Column()
  mileage: number;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
