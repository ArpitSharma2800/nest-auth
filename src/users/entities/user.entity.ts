import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class User {
    @PrimaryColumn()
    @Generated("uuid")
    userID: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
    })
    userEmail: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
        default: null
    })
    password: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        default: null
    })
    iv: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        default: null
    })
    salt: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true,
        default: null
    })
    keyDerivationInfo: string;

    @Column({
        type: "boolean",
        nullable: false,
    })
    isActive: boolean;

    @CreateDateColumn()
    createDate

    @UpdateDateColumn()
    updateDate
}
