import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'senha',
      database: process.env.DB_NAME || 'letterboxd',
      autoLoadEntities: true,
      synchronize: false, // Deixa falso para criar as tabelas via SQL
    }),
  ],
})
export class AppModule {}
