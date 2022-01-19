import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SubscriptionService } from './subscriptions.service';
import {
  BulkCreateSubscriptionDto,
  BulkUpdateStatusSubscriptionDto,
  CreateSubscriptionDto,
  QuerySubscriptionDto,
  UpdateSubscriptionDto,
} from './dto/subscriptions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly service: SubscriptionService) {}

  @Post()
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'Create subscriptions record' })
  create(@Body() dto: CreateSubscriptionDto, @CurrentUser() user: { id: string }) {
    return this.service.create(dto, user.id);
  }

  @Post('bulk')
  @Roles('admin', 'garage')
  @ApiOperation({ summary: 'Bulk create subscriptions records' })
  bulkCreate(@Body() dto: BulkCreateSubscriptionDto, @CurrentUser() user: { id: string }) {
    return this.service.bulkCreate(dto, user.id);
  }

  @Get()
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'List subscriptions records' })
  findAll(@Query() query: QuerySubscriptionDto) {
    return this.service.findAll(query);
  }

  @Get('stats/by-status')
  @Roles('admin', 'garage', 'inspector')
  @ApiOperation({ summary: 'Count subscriptions by status' })
  countByStatus(@Query('organizationId') organizationId?: string) {
    return this.service.countByStatus(organizationId);
  }

  @Get('recent')
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'Recent subscriptions records' })
  recent(
    @Query('limit') limit?: number,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.service.getRecent(limit ? Number(limit) : 10, organizationId);
  }

  @Get('export/csv')
  @Roles('admin', 'garage')
  @Header('Content-Type', 'text/csv')
  @ApiOperation({ summary: 'Export subscriptions as CSV' })
  exportCsv(@Query() query: QuerySubscriptionDto) {
    return this.service.exportCsv(query);
  }

  @Get('health')
  @Roles('admin')
  health() {
    return this.service.healthCheck();
  }

  @Get(':id')
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'Get subscriptions by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'inspector', 'garage')
  @ApiOperation({ summary: 'Update subscriptions' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubscriptionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.update(id, dto, user.id);
  }

  @Post(':id/clone')
  @Roles('admin', 'garage', 'inspector')
  clone(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: { id: string }) {
    return this.service.clone(id, user.id);
  }

  @Post(':id/metadata')
  @Roles('admin', 'inspector', 'garage')
  attachMetadata(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() patch: Record<string, unknown>,
    @CurrentUser() user: { id: string },
  ) {
    return this.service.attachMetadata(id, patch, user.id);
  }

  @Post(':id/tags')
  @Roles('admin', 'inspector', 'garage')
  setTags(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('tags') tags: string[],
    @CurrentUser() user: { id: string },
  ) {
    return this.service.setTags(id, tags, user.id);
  }

  @Post('bulk/status')
  @Roles('admin')
  bulkStatus(@Body() dto: BulkUpdateStatusSubscriptionDto, @CurrentUser() user: { id: string }) {
    return this.service.bulkUpdateStatus(dto, user.id);
  }

  @Delete(':id')
  @Roles('admin', 'garage')
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: { id: string }) {
    return this.service.remove(id, user.id);
  }

  @Post(':id/restore')
  @Roles('admin')
  restore(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: { id: string }) {
    return this.service.restore(id, user.id);
  }
}
