import { FileIcon, FileTextIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { FaRegFilePdf, FaRegFileExcel } from "react-icons/fa6";
import React from 'react'

interface IconProps {
    type: string;
  }


const IconForAttachmentType = ({ type }: IconProps) => {
    const filetype = type?.split(".").pop();
    switch (filetype) {
        case "jpg":
          return <ImageIcon className="w-4 h-4 text-blue-600" />;
        case "png":
            return <ImageIcon className="w-4 h-4 text-blue-600" />;
        case "jpeg":
                return <ImageIcon className="w-4 h-4 text-blue-600" />;
        case "pdf":
          return <FaRegFilePdf className="w-4 h-4 text-red-500" />;
        case "docx":
          return <FileIcon className="w-4 h-4 text-blue-600" />;
        case "txt":
            return <FileTextIcon className="w-4 h-4 text-gray-500" />;
        case "xlsx":
            return <FaRegFileExcel className="w-4 h-4 text-green-600" />;
        case "mp4":
          return <VideoIcon className="w-4 h-4 text-gray-500" />;
        default:
          return <FileIcon className="w-4 h-4 text-gray-500" />;
      }
}

export default IconForAttachmentType