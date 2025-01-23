import { PartialType } from '@nestjs/mapped-types';
import { CreateDonationDto } from './create-donation.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDonationDto extends PartialType(CreateDonationDto) {
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'Remarks must be less than or equal to 255 characters',
  })
  adminRemarks?: string;
}
