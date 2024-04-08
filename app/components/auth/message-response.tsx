import { AlertCircle } from "lucide-react"
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@/components/ui/alert"

type MessageProps = {
    msg: string
}

const MessageResponse = ({msg}: MessageProps) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {msg}
      </AlertDescription>
    </Alert>
  )
}

export default MessageResponse