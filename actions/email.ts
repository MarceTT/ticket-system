// 'use server';

// import { Resend } from 'resend';
// import { render } from '@react-email/render';
// import ChangeAssigned from '@/email/change-assigned';
// import React from 'react';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendAssignedEmail = async(values: any) => {

//     const {message, assigned, emailAssigned, imageAssigned} = values;

//     try {

//        await resend.emails.send({
//         from: 'onboarding@resend.dev',
//         to: [emailAssigned],
//         subject: 'Hello World',
//         react: ChangeAssigned({
//             assigned: assigned as string,
//             emailAssigned: emailAssigned as string,
//             imageAssigned: imageAssigned as string
//         })
//       });
      
//       return { success: true}

//     } catch (error: unknown) {
//         console.log(error);
//         return { message: error , success: false}
        
//     }

    

// }