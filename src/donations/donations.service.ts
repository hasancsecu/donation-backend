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

    const todayDonation = await this.donationRepository.find({
      select: ['amount'],
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const totalTodayDonation = todayDonation.reduce(
      (sum, donation) => sum + Number(donation.amount),
      0,
    );

    const totalDonation = await this.donationRepository.find({
      select: ['amount'],
    });
    const totalDonationSum = totalDonation.reduce(
      (sum, donation) => sum + Number(donation.amount),
      0,
    );

    return {
      totalDonation: totalDonationSum,
      todayDonation: totalTodayDonation,
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

    let where: any = [];

    if (q) {
      where.push({ name: ILike(`%${q}%`) }, { email: ILike(`%${q}%`) });
    }

    const dateCondition: any = {};
    if (from && to) {
      dateCondition.createdAt = Between(
        new Date(from + 'T00:00:00Z'),
        new Date(to + 'T23:59:59Z'),
      );
    } else if (from) {
      dateCondition.createdAt = MoreThanOrEqual(new Date(from + 'T00:00:00Z'));
    } else if (to) {
      dateCondition.createdAt = LessThanOrEqual(new Date(to + 'T23:59:59Z'));
    }

    if (Object.keys(dateCondition).length > 0) {
      if (where.length > 0) {
        where = where.map((condition) => ({ ...condition, ...dateCondition }));
      } else {
        where.push(dateCondition);
      }
    }

    const [data, totalRecords] = await this.donationRepository.findAndCount({
      skip,
      take: limit,
      where: where.length ? where : undefined,
      order: orderBy,
    });

    const donations = await this.donationRepository.find({
      where: where.length ? where : undefined,
      select: ['amount'],
    });

    const totalDonation = donations.reduce(
      (sum, donation) => sum + Number(donation.amount),
      0,
    );

    return {
      data,
      totalRecords,
      totalDonation,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
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
    };

    if (from && to) {
      where.createdAt = Between(
        new Date(`${from}T00:00:00Z`),
        new Date(`${to}T23:59:59Z`),
      );
    } else if (from) {
      where.createdAt = MoreThanOrEqual(new Date(`${from}T00:00:00Z`));
    } else if (to) {
      where.createdAt = LessThanOrEqual(new Date(`${to}T23:59:59Z`));
    }

    const [data, totalRecords] = await this.donationRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: orderBy,
    });

    const donations = await this.donationRepository.find({
      where,
      select: ['amount'],
    });

    const totalDonation = donations.reduce(
      (sum, donation) => sum + Number(donation.amount),
      0,
    );

    return {
      data,
      totalRecords,
      totalDonation,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
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
