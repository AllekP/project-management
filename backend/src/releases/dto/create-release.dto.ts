import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReleaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  version: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  releasedAt?: string;

  @ApiProperty()
  @IsUUID()
  projectId: string;
}
