import { Column, CreateDateColumn, Entity, Generated, PrimaryColumn, UpdateDateColumn } from "typeorm";



@Entity()
export class User {
    @PrimaryColumn()
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
    })
    password: string;

    @Column({
        type: "boolean",
        nullable: false,
    })
    isActive: boolean;

    @Column({
        type: "varchar",
        nullable: true,
        unique: true,
        default: null
    })
    otpsecreat: string;

    @CreateDateColumn()
    createDate

    @UpdateDateColumn()
    updateDate
}
