import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lnt: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Expose()
  price: number;

  @Expose()
  @Transform(({ obj }) => obj.user.id)
  userId: number;
}
