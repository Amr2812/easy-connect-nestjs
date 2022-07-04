import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudStorageService, GCStorage } from "@common/providers";
import { UserRepository } from "./user.repository";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: new GCStorage(configService, {
          destination: (req, file, cb) => {
            cb(null, {
              name: req.user["id"]
                .toString()
                .replace(/\s/g, "_")
                .concat(`_${Date.now().toString()}`),
              folder: configService.get("storage.usersFoler")
            });
          },
          fileType: "image"
        })
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, CloudStorageService]
})
export class UsersModule {}
