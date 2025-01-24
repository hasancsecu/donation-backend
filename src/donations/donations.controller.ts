import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
@UseGuards(RolesGuard)
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return await this.donationsService.create(createDonationDto);
  }

  @Roles('admin')
  @Get()
  async adminReport(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') q: string = '',
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('sortKey') sort: string = 'createdAt',
    @Query('sortDirection') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const maxLimit = 100;
    limit = Math.min(limit, maxLimit);
    return this.donationsService.adminReport(
      page,
      limit,
      sort,
      order,
      q,
      from,
      to,
    );
  }

  @Roles('user', 'admin')
  @Get('user')
  async userReport(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('sortKey') sort: string = 'createdAt',
    @Query('sortDirection') order: 'ASC' | 'DESC' = 'DESC',
    @Request() req,
  ) {
    const maxLimit = 100;
    limit = Math.min(limit, maxLimit);
    return this.donationsService.userReport(
      req.user,
      page,
      limit,
      sort,
      order,
      from,
      to,
    );
  }

  @Roles('admin')
  @Get('stats')
  getAdminDashboardStats() {
    return this.donationsService.getAdminDashboardStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(+id);
  }

  @Roles('admin')
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationsService.update(+id, updateDonationDto);
  }

  @Roles('admin')
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.donationsService.softDelete(+id);
  }
}
