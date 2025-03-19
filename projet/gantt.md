```mermaid
gantt
    title Ficus
    dateFormat  YYYY-MM-DD
    Prototype Spec Minimale: milestone, 2025-04-02

    section Préparation
    Organisation           :a1, 2025-02-19, 30d
    Identification des enjeux     :20d
    Prototype schéma avec préconception :12d
    Schéma suivant les enjeux : 12d
    Readme : 1d
    Relecture : 12d

    section Social
    Contact      :s1, 2025-02-24  , 1d
    Entretiens      :after s1, 24d

    section Programmation
    Définition standards: 1d

    L - Maquette: m1, 2025-03-01, 2025-03-26
    M & C - Prototype interface: 2025-03-15, 2025-03-26
    M & C - Interface: after m1, 14d
    M & C - Spec 1: spec_1, 2025-03-19, 7d
    M & C - Spec 2: spec_2, 2025-03-19, 7d
    M & C - Spec 3: spec_3, after spec_2, 7d 
    M & C - Spec 4: spec_4, after spec_3, 2d
    M & C - Spec 5: spec_5, after spec_4, 2d
    M & C - Spec 6: spec_6, after spec_5, 7d
    M & C - Spec 7: spec_7, 2025-03-26, 2d
    M & C - Spec 8: spec_8, after spec_1, 2d
    M & C - Spec 9: spec_9, 2025-04-01, 1d

    section Rendu
    LORELEI - Keynote: 2025-04-12, 14d
    Présentation: crit, r1, 2025-04-30, 1d
    Soutenance: crit, r2, 2025-05-21, 1d
    Rapport: 1d
```
