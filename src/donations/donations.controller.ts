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
} from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dtos/create-donation.dto';
import { UpdateDonationDto } from './dtos/update-donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  async create(@Body() createDonationDto: CreateDonationDto) {
    return await this.donationsService.create(createDonationDto);
  }

  @Get()
  async adminReport(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') q: string = '',
    @Query('sortKey') sort: string = 'createdAt',
    @Query('sortDirection') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    const maxLimit = 100;
    limit = Math.min(limit, maxLimit);
    return this.donationsService.adminReport(page, limit, sort, order, q);
  }

  @Get('user')
  async userReport(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortKey') sort: string = 'createdAt',
    @Query('sortDirection') order: 'ASC' | 'DESC' = 'DESC',
    @Request() req,
  ) {
    const maxLimit = 100;
    limit = Math.min(limit, maxLimit);
    return this.donationsService.userReport(req.user, page, limit, sort, order);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationsService.update(+id, updateDonationDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.donationsService.softDelete(+id);
  }
}
