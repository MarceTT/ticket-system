"use client";

import { TicketList } from "@/types/ticket";
import { useState } from "react";
import { TicketDataTable } from "../tickets/data-table";
import { getColumns } from "../tickets/columns";
import ModalEditAssigned from "./ModalEditAssigned";
import ModalEditTicket from "./ModalEditTicket";

interface WrapperTableProps {
    data: TicketList[];
}

const WrapperTable = ({data}: WrapperTableProps) => {
  const [onOpenEditModal, setIsModalEditOpen] = useState<boolean>(false);
  const [onOpenEditAssignedModal, setIsModalAssignedOpen] = useState<boolean>(false);
  const openDialog = () => setIsModalEditOpen(true);
  const closeDialog = () => setIsModalEditOpen(false);
  const closeDialogAssigned = () => setIsModalAssignedOpen(false);

  const [selectedTicket, setSelectedTicket] = useState<TicketList | null>(null);


  const handleOpenModalEdit = (ticket: TicketList) => {
    setSelectedTicket(ticket); // Guarda la información del ticket seleccionado
    setIsModalEditOpen(true); // Abre el primer modal
  };

  // Función para manejar la apertura del segundo modal
  const handleOpenModalAssigned = (ticket: TicketList) => {
    setSelectedTicket(ticket); // Guarda la información del ticket seleccionado
    setIsModalAssignedOpen(true); // Abre el segundo modal
  };

  
  return (
    <>
    <TicketDataTable 
    data={data} 
    columns={getColumns({ onOpenEditModal: handleOpenModalEdit, onOpenEditAssignedModal: handleOpenModalAssigned  })}
    onOpenEditModal={handleOpenModalEdit} // Asegúrate de pasar esta función
    onOpenEditAssignedModal={handleOpenModalAssigned}
    />
    <ModalEditAssigned isOpen={onOpenEditAssignedModal} onCloseAssigned={closeDialogAssigned} ticket={selectedTicket} />
    <ModalEditTicket isOpen={onOpenEditModal} onClose={closeDialog} ticket={selectedTicket} />
    </>
  );

};

export default WrapperTable;
