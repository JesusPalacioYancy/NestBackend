import { User } from "../entities/user.entity";

export interface LoguinRespounse {
    user: User;
    token: string;
};