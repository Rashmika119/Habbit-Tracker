export type UserType={
    id:number;
    username:string;
    email:string;
    password:string;
}

export type userTextType={
    userText:UserType;
    setUserText:(value:string,key:keyof UserType)=>void;
    clearUserText: ()=> void;
}

export type userInputType={
  username:string;
  password:string;
}

export type userStoreType={
  users: UserType[];
  signUpUser: (navigation: any) => Promise<void>;
  signInUser: (userData:userInputType) => Promise<void>;
  logoutUser: (navigation: any) => Promise<void>;
  setHabits: (users: UserType[]) => void;
}