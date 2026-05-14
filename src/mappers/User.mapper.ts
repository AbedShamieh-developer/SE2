import { toRole } from "../config/roles";
import { IUser } from "../model/IUser.model";
import { User } from "../model/User.model";
import { SQLiteUser } from "../repository/sqlite/User.repository";
import { IMapper } from "./IMapper";

export class UserMapper implements IMapper<SQLiteUser,IUser>{
    map(data: SQLiteUser): IUser {
        return new User(data.id,data.name,data.email,data.password,toRole(data.role))
    }
    reverseMap(data: IUser): SQLiteUser {
        return {
            id: data.getId(),
            name: data.getName(),
            email: data.getEmail(),
            password: data.getPassword(),
            role: data.getRole()
        }
    }
    
}