export interface Specie {
  id: number;
  created: Date;
  edited: Date;
  name: string;
  homeworld_id: number | null;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  language: string;
}
