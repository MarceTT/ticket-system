export interface Ticket {
    category: {
      id: string;
      name: string;
    };
    project: {
      id: string;
      name: string;
    };
    priority: {
      id: string;
      name: string;
    };
    createdBy: {
      id: string;
      name: string | null;
    };
    assigened: {
      id: string;
      name: string | null;
    };
    tracking: Array<{
      id: string;
      url: string;
    }>;
    status: string;
    description: string;
    id: string;
    createdAt: string;
    numberTicket: string;
    title: string;
  }