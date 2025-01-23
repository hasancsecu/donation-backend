import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { ILike } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
  ) {}

  async create(createDonationDto: CreateDonationDto) {
    const amount = Number(createDonationDto.amount.toFixed(2));
    const donation = this.donationRepository.create({
      ...createDonationDto,
      amount,
    });

    return await this.donationRepository.save(donation);
  }

  async adminReport(
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

  async userReport(
    user: User,
    page: number = 1,
    limit: number = 10,
    sort: string = 'createdAt',
    order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sort]: order };

    const [data, total] = await this.donationRepository.findAndCount({
      where: { email: user.email },
      skip,
      take: limit,
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
