
export const type_mail:string='Confirmation Mail'

export interface bnc_mail_type
{
    id:number ;
    active:boolean;
    token:string; //m2o
    type_mail:string;
    user_uid:number;
    email:string;
}
