export type FormOption = string;

export type ResponseValue =
  | string
  | string[];

export type ShowWhen = {
  question_id: string;
  operator:
    | "equals"
    | "contains";
  value: string;
};

export type IdentificationField = {
  id: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "radio"
    | "date"
    | "email"
    | "tel";
  required: boolean;
  options?: FormOption[];
};

export type Question = {
  id: string;
  number: number;
  section: string;
  question: string;
  type:
    | "text"
    | "textarea"
    | "number"
    | "radio"
    | "checkbox"
    | "heading";
  required: boolean;
  options?: FormOption[];
  show_when?: ShowWhen;
  hidden?: boolean;
};

export type Feeling = {
  id: string;
  label: string;
};

export type FormSchema = {
  version: string;
  title: string;
  subtitle: string;
  instructions: string;

  identification:
    IdentificationField[];

  questions: Question[];

  feelings_map: {
    title: string;
    question: string;
    type: string;
    options: string[];
    feelings: Feeling[];
  };

  additional_notes: {
    id: string;
    label: string;
    type: string;
    required: boolean;
  };
};

export type FormAnswers = {
  identification: Record<
    string,
    string
  >;

  responses: Record<
    string,
    ResponseValue
  >;

  feelings_map: Record<
    string,
    string
  >;

  additional_notes: string;

  consent: {
    privacy_accepted: boolean;
    truthfulness_accepted: boolean;
    version: string;
  };
};

export type AccessData = {
  paymentId: string;
  access_token: string;
  expires_at: string;
  form_url: string;
};