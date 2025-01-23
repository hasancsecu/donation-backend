import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { Like, ILike } from 'typeorm';

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

  async findAll(
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
    q: string = '',
  ) {
    const skip = (page - 1) * limit;

    const where = q
      ? {
          name: ILike(`%${q}%`),
          email: ILike(`%${q}%`),
        }
      : {};

    const orderBy = { [sort]: order };

    const [data, total] = await this.donationRepository.findAndCount({
      skip,
      take: limit,
      where,
      order: orderBy,
    });

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
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
