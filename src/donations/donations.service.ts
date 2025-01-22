// src/donations/donations.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    const donation = this.donationRepository.create(createDonationDto);
    return await this.donationRepository.save(donation);
  }

  findAll() {
    return this.donationRepository.find();
  }

  findOne(id: number) {
    return this.donationRepository.findOne({ where: { id } });
  }

  update(id: number, updateDonationDto: UpdateDonationDto) {
    return this.donationRepository.update(id, updateDonationDto);
  }

  softDelete(id: number) {
    return this.donationRepository.softDelete(id);
  }
}
