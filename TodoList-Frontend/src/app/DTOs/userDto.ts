export interface IUserDto {
  username : string;
  email: string,
  password: string,

}


export interface IUserRequestBody {
  identifier: string,
  password: string
}

export interface IUserResponse {
  jwt: string,
  user: {
    id:number,
    username:string,
    email:string,
    provider:string,
    confirmed:string,
    blocked:string,
    createdAt:string,
    updatedAt:string,
  }
}

export interface JwtPayload{
  id:number,
  iat:number,
  exp:number
}
