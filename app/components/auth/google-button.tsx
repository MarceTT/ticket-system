
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react';


const GoogleButton = () => {
  return (
    <Button variant="ghost" onClick={() => {
        signIn("google",
        {
          callbackUrl: "http://localhost:3000/dashboard",
          redirect: false,
        });
        //router.push("/sign-in");
        //router.refresh();
      }}>
        {/* <Gmai className="mr-2 h-4 w-4" /> */}
        <FcGoogle className="mr-2 h-6 w-6" />
      </Button>
  )
}

export default GoogleButton