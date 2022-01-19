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
import { RegionService } from './regions.service';
import {
  BulkCreateRegionDto,
  BulkUpdateStatusRegionDto,
  CreateRegionDto,
  QueryRegionDto,
  UpdateRegionDto,
} from './dto/regions.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('regions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('regions')
export class RegionController {
  constructor(private readonly service: RegionService) {}

  @Post()
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'Create regions record' })
  create(@Body() dto: CreateRegionDto, @CurrentUser() user: { id: string }) {
    return this.service.create(dto, user.id);
  }

  @Post('bulk')
  @Roles('admin', 'garage')
  @ApiOperation({ summary: 'Bulk create regions records' })
  bulkCreate(@Body() dto: BulkCreateRegionDto, @CurrentUser() user: { id: string }) {
    return this.service.bulkCreate(dto, user.id);
  }

  @Get()
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'List regions records' })
  findAll(@Query() query: QueryRegionDto) {
    return this.service.findAll(query);
  }

  @Get('stats/by-status')
  @Roles('admin', 'garage', 'inspector')
  @ApiOperation({ summary: 'Count regions by status' })
  countByStatus(@Query('organizationId') organizationId?: string) {
    return this.service.countByStatus(organizationId);
  }

  @Get('recent')
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'Recent regions records' })
  recent(
    @Query('limit') limit?: number,
    @Query('organizationId') organizationId?: string,
  ) {
    return this.service.getRecent(limit ? Number(limit) : 10, organizationId);
  }

  @Get('export/csv')
  @Roles('admin', 'garage')
  @Header('Content-Type', 'text/csv')
  @ApiOperation({ summary: 'Export regions as CSV' })
  exportCsv(@Query() query: QueryRegionDto) {
    return this.service.exportCsv(query);
  }

  @Get('health')
  @Roles('admin')
  health() {
    return this.service.healthCheck();
  }

  @Get(':id')
  @Roles('admin', 'inspector', 'garage', 'customer')
  @ApiOperation({ summary: 'Get regions by id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('admin', 'inspector', 'garage')
  @ApiOperation({ summary: 'Update regions' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRegionDto,
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
  bulkStatus(@Body() dto: BulkUpdateStatusRegionDto, @CurrentUser() user: { id: string }) {
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
