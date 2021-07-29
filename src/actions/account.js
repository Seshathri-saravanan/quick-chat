export const SET_ACCOUNT = "account/setAccount";
export function addAccount(account){
   return ({
      type:SET_ACCOUNT,
      payload:{
         account:account
      }
   })
}