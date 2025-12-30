export interface User {
  id: string;
  email: string;
  nume: string;
  pfaData?: PFAData;
}

export interface PFAData {
  denumire?: string;
  cui?: string;
  nrRegCom?: string;
  adresa?: string;
  telefon?: string;
  email?: string;
  banca?: string;
  iban?: string;
  caen?: string;
}

export interface IncasarePlata {
  _id: string;
  nrCrt: number;
  data: string | Date;
  document?: {
    tip: string;
    numar: string;
  };
  felulOperatiunii: string;
  tip: "incasare" | "plata";
  suma: number;
  metodaPlata: "banca" | "numerar";
  an: number;
  luna: number;
}

export interface IntrareIesire {
  _id: string;
  nrInregistrare: number;
  dataInregistrarii: string | Date;
  nrSiDataDocument?: {
    numar: string;
    data: string | Date;
  };
  emitent?: string;
  continutPeScurt: string;
  compartimentSiSemnatura?: string;
  dataExpedierii?: string | Date;
  destinatar?: string;
  nrInregistrareLaCare?: string;
  an: number;
}

export interface Document {
  _id: string;
  tip:
    | "contract"
    | "extras"
    | "declaratie"
    | "plati-impozite"
    | "divers"
    | "factura-emisa"
    | "factura-primita";
  titlu: string;
  descriere?: string;
  data?: string | Date;
  fisier?: {
    url: string;
    key: string;
    nume: string;
    marime: number;
  };
  metadata?: any;
  createdAt?: string | Date;
}

export interface TotalsMonthly {
  luna: number;
  incasari: number;
  plati: number;
  sold: number;
}

export interface TotalsAnnual {
  incasari: number;
  plati: number;
  sold: number;
}

export interface CalculatorTaxe {
  venit: number;
  cheltuieli: number;
  baza: number;
  cas: number;
  cass: number;
  impozit: number;
  total: number;
  net: number;
}
