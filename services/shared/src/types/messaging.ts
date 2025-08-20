type AuthEmailMessage = {
  receiverEmail: string;
  receiverName: string;
};

type SOSMessage = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
};

export type { AuthEmailMessage, SOSMessage };
