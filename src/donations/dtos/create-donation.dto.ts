import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateDonationDto {
  @IsString()
  @MaxLength(100, {
    message: 'Donor name must be less than or equal to 100 characters',
  })
  name: string;

  @IsNumber()
  @Min(1, { message: 'Donation amount must be at least 1' })
  amount: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Message must be less than or equal to 255 characters',
  })
  message?: string;
}
