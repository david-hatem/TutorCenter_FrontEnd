// Previous interfaces remain the same

export interface Group {
  id: number;
  nom_groupe: string;
  niveau: {
    id: number;
    nom_niveau: string;
  };
  filiere: {
    id: number;
    nom_filiere: string;
  };
  max_etudiants: number;
  prix_subscription: number;
  professeurs: {
    id: number;
    nom: string;
    prenom: string;
    commission_fixe: number;
  }[];
  matieres: {
    id: number;
    nom_matiere: string;
  }[];
  created_at: string;
}

export interface Student {
  id: number;
  nom: string;
  prenom: string;
  date_naissance: string; // ISO date string
  telephone: string;
  adresse: string;
  sexe: string;
  nationalite: string;
  contact_urgence: string;
  created_at: string; // ISO date string
  groupes: Groupe[];
  paiements: Paiement[];
  total_paiements: number;
  total_groupes: number;
}

export interface Paiement {
  id: number;
  montant: number;
  date_paiement: string; // ISO date string
  statut_paiement: string;
  groupe: string;
  commission?: number;
  commission_percentage?: number;
}

export interface Groupe {
  id: number;
  nom_groupe: string;
  niveau: Niveau;
  filiere: Filiere;
  matieres: Matiere[];
  professeurs: Professeur[];
}

export interface Filiere {
  id: number;
  nom_filiere: string;
}

export interface Matiere {
  id: number;
  nom_matiere: string;
}

export interface Niveau {
  id: number;
  nom_niveau: string;
}

interface Professeur {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  adresse: string;
  date_naissance: string;
  sexe: string;
  nationalite: string;
  specialite: string;
}

export interface Commission {
  id: number;
  montant: number;
  date_comission: string; // ISO date string
  statut_comission: string;
  etudiant: Etudiant;
  groupe: {
    id: number;
    nom_groupe: string;
  };
}

export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
}
