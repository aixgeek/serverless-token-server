import { Column, CreateDateColumn, Index, UpdateDateColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";

@Index("idx_secret_realm", ["realm"], {})
@EntityModel("secret", { schema: "weibanzhushou" })
export class Secret {

  @Column("varchar", { primary: true, name: "realm", length: 50 })
  realm: string;

  @Column("varchar", { primary: true, name: "key", length: 200 })
  key: string;

  @Column("varchar", { name: "key_1", length: 200 })
  key_1: string;

  @Column("varchar", { name: "key_2", length: 200 })
  key_2: string;

  @Column("varchar", { name: "key_3", length: 200 })
  key_3: string;

  @Column("varchar", { name: "key_4", length: 200 })
  key_4: string;

  @Column("varchar", { name: "key_5", length: 200 })
  key_5: string;

  @CreateDateColumn({
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  created_at: Date;

  @UpdateDateColumn({
    name: "updated_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updated_at: Date;

  @Column("text", { name: "token", nullable: true })
  token: string | null;

  @Column("bigint", { name: "expires_at", nullable: true })
  expires_at: number | null;
}