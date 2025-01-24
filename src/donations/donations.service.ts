import { Injectable } from '@nestjs/common';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { ILike, Between } from 'typeorm';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepository: Repository<Donation>,
    private readonly usersService: UsersService,
  ) {}

  async getAdminDashboardStats() {
    const donationStats = await this.getTotalAndTodayDonation();
    const totalUsers = await this.usersService.getTotalUsers();
    const todayUsers = await this.usersService.getTodayUsers();

    return {
      ...donationStats,
      totalUsers,
      todayUsers,
    };
  }

  async getTotalAndTodayDonation() {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const todayDonation = await this.donationRepository
      .createQueryBuilder('donations')
      .select('SUM(donations.amount)', 'sum')
      .where('donations.createdAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      })
      .getRawOne();

    const totalDonation = await this.donationRepository
      .createQueryBuilder('donations')
      .select('SUM(donations.amount)', 'sum')
      .getRawOne();

    return {
      totalDonation: totalDonation.sum || 0,
      todayDonation: todayDonation.sum || 0,
    };
  }

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
    from?: Date,
    to?: Date,
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sort]: order };

    const where: any = {
      ...(q && {
        name: ILike(`%${q}%`),
        email: ILike(`%${q}%`),
      }),
      ...(from && {
        createdAt: MoreThanOrEqual(new Date(from + 'T00:00:00Z')),
      }),
      ...(to && {
        createdAt: LessThanOrEqual(new Date(to + 'T23:59:59Z')),
      }),
    };

    if (from && to) {
      where.createdAt = Between(
        new Date(from + 'T00:00:00Z'),
        new Date(to + 'T23:59:59Z'),
      );
    }

    const [data, total] = await this.donationRepository.findAndCount({
      skip,
      take: limit,
      where,
      order: orderBy,
    });

    const totalDonation = await this.donationRepository
      .createQueryBuilder('donations')
      .select('SUM(donations.amount)', 'total')
      .where(where)
      .getRawOne();

    return {
      data,
      total,
      totalDonation: totalDonation.total || 0,
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
    from?: Date,
    to?: Date,
  ) {
    const skip = (page - 1) * limit;
    const orderBy = { [sort]: order };

    const where: any = {
      email: user.email,
      ...(from && {
        createdAt: MoreThanOrEqual(new Date(from + 'T00:00:00Z')),
      }),
      ...(to && {
        createdAt: LessThanOrEqual(new Date(to + 'T23:59:59Z')),
      }),
    };

    if (from && to) {
      where.createdAt = Between(
        new Date(from + 'T00:00:00Z'),
        new Date(to + 'T23:59:59Z'),
      );
    }

    const [data, total] = await this.donationRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: orderBy,
    });

    const totalDonation = await this.donationRepository
      .createQueryBuilder('donations')
      .select('SUM(donations.amount)', 'total')
      .where(where)
      .getRawOne();

    return {
      data,
      total,
      totalDonation: totalDonation.total || 0,
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
