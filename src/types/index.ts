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
  montant_total: number;
  remaining: number;
  frais_inscription: number;
  date_paiement: string; // ISO date string
  mois_paiement: string;
  month_name: string;
  statut_paiement: string;
  groupe: string;
  commission?: number;
  commission_percentage?: number;
}

export interface Payment {
  id: number;
  montant: number;
  montant_total: number;
  remaining: number;
  frais_inscription: number;
  date_paiement: string;
  mois_paiement: string;
  month_name: string;
  statut_paiement: string;
  groupe: string;
  etudiant: {
    id: number;
    nom: string;
    prenom: string;
  };
  niveau: {
    id: number;
    nom_niveau: string;
  };
  filiere: {
    id: number;
    nom_filiere: string;
  };
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
  mois_paiement: string;
  month_name: string;
  statut_comission: string;
  etudiant: Etudiant;
  groupe: {
    id: number;
    nom_groupe: string;
  };
  professeur: {
    id: number;
    nom: string;
    prenom: string;
  };
  niveau: {
    id: number;
    nom_niveau: string;
  };
  filiere: {
    id: number;
    nom_filiere: string;
  };
}

export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
}

export interface PaymentFormData {
  montant: number;
  frais_inscription: number;
  etudiant_id: number;
  groupe_id: number;
  commission_percentage: number | null;
  professeurs: number[];
  mois_paiement: string;
}
