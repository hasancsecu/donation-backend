import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { Donation } from './donation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [DonationsService],
  controllers: [DonationsController],
  imports: [TypeOrmModule.forFeature([Donation])],
})
export class DonationsModule {}
