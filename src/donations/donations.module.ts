import { Module } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { Donation } from './donation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [DonationsService],
  controllers: [DonationsController],
  imports: [TypeOrmModule.forFeature([Donation]), AuthModule, UsersModule],
})
export class DonationsModule {}
