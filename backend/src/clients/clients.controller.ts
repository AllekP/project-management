import { Controller, Get, Post, Body, UseGuards, Request, ForbiddenException, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.prisma.client.findMany({
      where: { organizationId: req.user.organizationId },
      include: { apps: true }
    });
  }

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.prisma.client.create({
      data: {
        ...data,
        organizationId: req.user.organizationId
      }
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: { apps: true, projects: true }
    });

    if (!client) throw new ForbiddenException('Client not found');
    if (client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('Access denied');
    }

    return client;
  }
}
