# ⚠️ ALERTE SÉCURITÉ - ACTIONS REQUISES

## Problème détecté
Une clé API Google a été exposée publiquement sur GitHub dans le fichier `lib/firebase/config.ts`.

## Actions URGENTES à effectuer

### 1. ✅ Fait : Suppression des clés du code
- Les clés ont été supprimées du fichier config.ts
- Le code a été poussé sur GitHub

### 2. 🔴 À FAIRE MAINTENANT : Révoquer la clé exposée

1. Allez sur : https://console.cloud.google.com
2. Sélectionnez le projet : `guide-de-lyon-b6a38`
3. Allez dans : **APIs & Services** → **Credentials**
4. Trouvez la clé : `AIzaSyCx6EvZlp_pX9GaRu_NvCHTa3Tk_k18OU4`
5. **SUPPRIMEZ** cette clé ou **RESTREIGNEZ** son utilisation

### 3. 🔴 À FAIRE : Créer une nouvelle clé API

1. Dans Google Cloud Console, créez une nouvelle clé API
2. **IMPORTANT** : Configurez les restrictions :
   - Restriction d'application : Sites web
   - Ajoutez votre domaine : `https://guide-de-lyon.fr`
   - Ajoutez Vercel : `https://*.vercel.app`
3. Limitez les APIs autorisées (Maps, Places, etc.)

### 4. 🔴 À FAIRE : Configurer les variables d'environnement

#### Sur Vercel :
1. Allez sur : https://vercel.com/dashboard
2. Projet : guide-lyon-v2
3. Settings → Environment Variables
4. Ajoutez :
   - `NEXT_PUBLIC_FIREBASE_API_KEY` = [nouvelle clé]
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = guide-de-lyon-b6a38.firebaseapp.com
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = guide-de-lyon-b6a38
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = guide-de-lyon-b6a38.firebasestorage.app
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = 173827247208
   - `NEXT_PUBLIC_FIREBASE_APP_ID` = 1:173827247208:web:899a74bd3a5a24f1f63fdd

#### En local :
1. Créez un fichier `.env.local` (copie de `.env.local.example`)
2. Ajoutez vos clés (ce fichier ne sera jamais commité)

### 5. Nettoyer l'historique Git (Optionnel mais recommandé)

L'historique Git contient toujours la clé exposée. Pour la supprimer complètement :

```bash
# Option 1 : BFG Repo-Cleaner (plus simple)
brew install bfg
bfg --delete-files config.ts
git push --force

# Option 2 : git filter-branch (plus complexe)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch lib/firebase/config.ts" \
  --prune-empty --tag-name-filter cat -- --all
```

## Prévention future

1. **JAMAIS** de clés API dans le code
2. **TOUJOURS** utiliser des variables d'environnement
3. **VÉRIFIER** avant chaque commit
4. Utiliser des outils comme `git-secrets` ou `truffleHog`

## Ressources

- [Google Cloud Console](https://console.cloud.google.com)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)