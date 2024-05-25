import { Module } from '@nestjs/common'

import { ConfigController } from '@main/modules/config/config.controller'
import { ConfigService } from '@main/modules/config/config.service'

@Module({
  providers: [ConfigController, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
