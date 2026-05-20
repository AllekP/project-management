import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateIssueDto } from './dto/create-issue.dto';

@ApiTags('issues')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('issues')
export class IssuesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all issues in the organization' })
  async findAll(@Request() req: any) {
    return this.prisma.issue.findMany({
      where: {
        project: {
          client: {
            organizationId: req.user.organizationId
          }
        }
      },
      include: {
        project: true,
        assignee: true,
        reporter: true,
        sprint: true
      }
    });
  }

  @Post()
  @ApiOperation({ summary: 'Create a new issue' })
  async create(@Body() data: CreateIssueDto, @Request() req: any) {
    // Verify project belongs to organization
    const project = await this.prisma.project.findFirst({
      where: {
        id: data.projectId,
        client: { organizationId: req.user.organizationId }
      }
    });
    if (!project) throw new ForbiddenException('Project not found in your organization');

    return this.prisma.issue.create({
      data: {
        ...data,
        reporterId: req.user.id,
      }
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get issue details' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const issue = await this.prisma.issue.findUnique({
      where: { id },
      include: {
        project: {
          include: { client: true }
        },
        assignee: true,
        reporter: true,
        sprint: true,
        comments: {
          include: {
            author: true
          }
        },
        timeLogs: true
      }
    });

    if (!issue) throw new NotFoundException();
    if (issue.project.client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('You do not have access to this issue');
    }

    return issue;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an issue' })
  async update(@Param('id') id: string, @Body() data: any, @Request() req: any) {
    const issue = await this.prisma.issue.findUnique({
      where: { id },
      include: {
        project: {
          include: { client: true }
        }
      }
    });

    if (!issue) throw new NotFoundException();
    if (issue.project.client.organizationId !== req.user.organizationId) {
      throw new ForbiddenException('You do not have access to this issue');
    }

    return this.prisma.issue.update({
      where: { id },
      data: data
    });
  }
}
