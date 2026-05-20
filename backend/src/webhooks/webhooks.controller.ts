import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private prisma: PrismaService) {}

  @Post('github')
  @ApiOperation({ summary: 'Receive GitHub webhooks' })
  async handleGithub(@Body() payload: any, @Headers('x-github-event') event: string) {
    await this.prisma.webhookLog.create({
      data: {
        source: 'github',
        payload: { event, ...payload }
      }
    });

    // Simple logic: if PR is closed and merged, update issue status if linked in PR title/desc
    if (event === 'pull_request' && payload.action === 'closed' && payload.pull_request.merged) {
      const body = payload.pull_request.body || '';
      const title = payload.pull_request.title || '';
      const match = (title + body).match(/#([a-zA-Z0-9-]+)/);
      if (match) {
        const issueKey = match[1];
        // Note: this is a simple example. In a real app, you'd match by key or ID.
        // For simplicity here, we just log it.
      }
    }

    return { received: true };
  }

  @Post('generic')
  async handleGeneric(@Body() payload: any) {
    await this.prisma.webhookLog.create({
      data: {
        source: 'generic',
        payload: payload
      }
    });
    return { received: true };
  }
}
