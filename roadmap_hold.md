# Roadmap - Hold (mettre une pièce de côté)

Permettre au joueur de mettre la pièce actuelle de côté (une seule fois par pièce) et de la récupérer plus tard.

## Étapes

1. État du Hold dans Game.jsx: ❌
- Ajouter `holdPiece` (state, la pièce mise de côté) et `canHold` (ref, autorise ou non le hold) (≈10 min)

2. Touche Hold: ❌
- Ajouter une touche (ex: 'c') dans `handleKey` qui déclenche la logique de hold (≈15 min)

3. Logique stockage/échange: ❌
- Si `holdPiece` est vide: on stocke la pièce actuelle et on demande une nouvelle pièce au serveur (`emitNeedNewPiece`)
- Si `holdPiece` contient déjà une pièce: on échange avec la pièce actuelle (reset position/rotation)
- Dans les deux cas, `canHold` passe à `false` (≈30 min)

4. Réautoriser le Hold: ❌
- Remettre `canHold` à `true` quand une nouvelle pièce arrive naturellement (`onNewPiece`) (≈10 min)

5. Affichage de la pièce en Hold: ❌
- Petit encart dans l'UI qui affiche la forme de `holdPiece` (≈20-30 min)

6. Tests: ❌
- Test manuel: hold une pièce, vérifier qu'on ne peut pas re-hold avant la pièce suivante, vérifier l'échange (≈15 min)

---

**Total estimé : ~1h30**

Game.jsx

let hodlPiece = null;
let canHold = true;
