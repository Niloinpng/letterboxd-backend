import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createConnection, Connection } from "mysql2/promise";

@Injectable()
export class DatabaseService {
  private connection: Connection;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private configService: ConfigService) {
    this.connect();
  }

  private async connect() {
    try {
      this.connection = await createConnection({
        host: this.configService.get<string>("DB_HOST"),
        user: this.configService.get<string>("DB_USER"),
        password: this.configService.get<string>("DB_PASS"),
        database: this.configService.get<string>("DB_SCHEMA"),
      });
      this.logger.log("Connected to MySQL database");
    } catch (error) {
      this.logger.error("Error connecting to MySQL database", error.stack);
    }
  }

  getConnection(): Connection {
    return this.connection;
  }
}
