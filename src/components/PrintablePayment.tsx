import React from 'react';
import type { Payment } from '../types';

interface PrintablePaymentProps {
  payment: Payment;
}

function PrintablePayment({ payment }: PrintablePaymentProps) {
  return (
    <div className="print-content p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Reçu de Paiement</h1>
        <p className="text-sm text-gray-500">
          Date: {new Date(payment.date_paiement).toLocaleString('fr-FR')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h2 className="font-bold mb-2">Informations de l'étudiant</h2>
          <p>
            Nom: {payment.etudiant.prenom} {payment.etudiant.nom}
          </p>
          <p>Téléphone: {payment.etudiant.telephone}</p>
          <p>Adresse: {payment.etudiant.adresse}</p>
        </div>
        <div>
          <h2 className="font-bold mb-2">Détails du paiement</h2>
          <p>Groupe: {payment.groupe.nom_groupe}</p>
          <p>Montant: {payment.montant.toLocaleString()} MAD</p>
          <p>Statut: {payment.statut_paiement}</p>
          {payment.remaining > 0 && (
            <p>Montant restant: {payment.remaining.toLocaleString()} MAD</p>
          )}
        </div>
      </div>

      {payment.professeurs && payment.professeurs.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold mb-2">Professeurs</h2>
          <ul className="list-disc list-inside">
            {payment.professeurs.map((prof) => (
              <li key={prof.id}>
                {prof.prenom} {prof.nom}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t pt-4 text-center text-sm text-gray-500">
        <p>Merci de votre confiance!</p>
      </div>
    </div>
  );
}

export default PrintablePayment;
