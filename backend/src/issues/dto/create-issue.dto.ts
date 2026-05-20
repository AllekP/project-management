import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus, IssueType } from '@prisma/client';

export class CreateIssueDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: IssueType })
  @IsEnum(IssueType)
  @IsOptional()
  type?: IssueType;

  @ApiProperty({ enum: IssuePriority })
  @IsEnum(IssuePriority)
  @IsOptional()
  priority?: IssuePriority;

  @ApiProperty({ enum: IssueStatus })
  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  sprintId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  assigneeId?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  estimate?: number;
}
