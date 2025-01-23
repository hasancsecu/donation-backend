import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

UseGuards(RolesGuard);
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return await this.donationsService.create(createDonationDto);
  }

  @Roles('admin')
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') q: string = '',
    @Query('sortKey') sort: string = 'createdAt',
    @Query('sortDirection') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const maxLimit = 100;
    limit = Math.min(limit, maxLimit);
    return this.donationsService.findAll(page, limit, sort, order, q);
  }

  @Roles('admin')
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

  @Roles('admin')
  @Get('report')
  getReport() {
    // Admin-only logic
  }
}
