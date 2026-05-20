import { IsString, IsNotEmpty, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  clientAppId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  teamId?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  estimatedBudget?: number;
}
