import { Module } from '@nestjs/common'

import { ConfigModule } from '@main/modules/config/config.module'
import { DeveloperController } from '@main/modules/developer/developer.controller'
import { DeveloperService } from '@main/modules/developer/developer.service'

@Module({
  imports: [ConfigModule],
  providers: [DeveloperController, DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
