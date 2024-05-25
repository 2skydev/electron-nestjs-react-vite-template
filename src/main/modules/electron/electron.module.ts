import { Module } from '@nestjs/common'

import { ConfigModule } from '@main/modules/config/config.module'
import { ElectronController } from '@main/modules/electron/electron.controller'
import { ElectronService } from '@main/modules/electron/electron.service'

@Module({
  imports: [ConfigModule],
  providers: [ElectronController, ElectronService],
  exports: [ElectronService],
})
export class ElectronModule {}
