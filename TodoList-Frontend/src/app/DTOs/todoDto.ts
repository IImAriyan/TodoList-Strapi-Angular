export interface ITodoGetDto {
  id:number;
  documentId:string;
  Name:string;
  Description:string;
  completed:boolean;
  createdAt?:string;
  updatedAt?:string;
  publishedAt?:string;
  users:[
    {
      id:number
    }
  ]
}

export interface ITodoAddDto {
  Name:string;
  Description:string;
  completed:boolean;
}

export interface ITodoAddToApiDto {
  data :{
      Name:string;
  Description:string;
  completed:boolean;
  users:[
    {
      id:number
    }
  ]
  }
}



export interface ITodoAddDtoResponse {
  data:ITodoAddDto;
}

export interface ITodoGetAPI {
  data:ITodoGetDto[];
}



