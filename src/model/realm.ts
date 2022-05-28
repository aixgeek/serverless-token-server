import { Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { EntityModel } from "@midwayjs/orm";
import { Secret } from "./secret";

@EntityModel("realm", { schema: "weibanzhushou" })
export class Realm {
  @Column("varchar", { primary: true, name: "id", length: 50 })
  id: string;

  @Column("json", { name: "config", nullable: true })
  config: object;

  @Column("varchar", { name: "logic_code", length: 5000 })
  logic_code: string;

  @Column("varchar", { name: "comment", length: 5000 })
  comment: string;

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

  @OneToMany(type => Secret, secret => secret.realm)
  secrets: Secret[];
}
