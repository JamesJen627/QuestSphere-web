export interface PublicPackQuestion {
  id: string;
  type: string;
  question: string;
  optionsJson?: string;
  answer?: string;
  explanation?: string;
}

export interface PublicPackPayload {
  version: number;
  packId: string;
  title: string;
  description?: string;
  tags?: string[];
  authorNickname?: string;
  questions: PublicPackQuestion[];
}

export interface PublicPackRow {
  pack_id: string;
  title: string;
  description?: string;
  tags?: string[];
  author_nickname?: string;
  question_count?: number;
  version?: number;
  updated_at?: string;
  payload_json?: PublicPackPayload;
}
