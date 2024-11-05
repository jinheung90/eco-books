import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EnvironmentName } from '@eco-books/type-common';
import { ChatMessage } from '../entity/chat-message';
import { ChatRoom } from '../entity/chat-room';
import { ChatRoomUser } from '../entity/chat-room-user';

export const chatDbProvider = [
  {
    inject: [ConfigService],
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'mysql',
        url: configService.get<string>('mysql-url'),
        username: configService.get<string>('mysql-name'),
        password: configService.get<string>('mysql-password'),
        database: configService.get<string>('mysql-db'),
        entities: [
          ChatMessage,
          ChatRoom,
          ChatRoomUser
        ],
        synchronize: configService.get<string>('APP_ENV') === EnvironmentName.LOCAL,
        namingStrategy: new SnakeNamingStrategy(),
        migrationsTableName: 'chat_migration',
        migrationsRun: true,
        migrations: [
          __dirname + '/../migrations/*.ts'
        ]
      });
      return dataSource.initialize();
    },
  },
]

