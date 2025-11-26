package com.prodify.api.model;

public enum Role {
    USER,       // Utilisateur lambda (peut devenir artiste)
    ADMIN       // Toi (pour gérer la plateforme)
    // Note : Le statut "PRODUCER" sera déterminé par la présence d'un profil Producer lié,
    // pas forcément par ce rôle, mais on peut l'ajouter ici si on veut simplifier la sécu plus tard.
}