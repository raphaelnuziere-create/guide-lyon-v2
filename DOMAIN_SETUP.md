# Configuration du domaine guide-de-lyon.fr sur Vercel

## Étapes pour connecter votre domaine

### 1. Dans Vercel (vercel.com/dashboard)

1. Allez sur votre projet **guide-lyon-v2**
2. Cliquez sur l'onglet **Settings**
3. Dans le menu latéral, cliquez sur **Domains**
4. Cliquez sur **Add Domain**
5. Entrez `guide-de-lyon.fr` et cliquez sur **Add**
6. Vercel va vous demander de configurer les DNS

### 2. Configuration DNS requise

Vercel va vous donner deux options :

#### Option A : Nameservers (Recommandé)
Changez les nameservers de votre domaine vers ceux de Vercel :
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

#### Option B : A Records + CNAME
Si vous préférez garder vos nameservers actuels :

**Pour guide-de-lyon.fr (apex domain) :**
- Type : A
- Name : @
- Value : `76.76.21.21`

**Pour www.guide-de-lyon.fr :**
- Type : CNAME
- Name : www
- Value : `cname.vercel-dns.com`

### 3. Chez votre registrar (OVH, Gandi, etc.)

1. Connectez-vous à votre compte
2. Trouvez la section DNS/Zone DNS
3. Supprimez les anciens enregistrements pointant vers Firebase
4. Ajoutez les nouveaux enregistrements Vercel

### 4. Vérification

- La propagation DNS peut prendre jusqu'à 48h (généralement 1-4h)
- Vercel vérifiera automatiquement et activera HTTPS
- Vous verrez un statut "Valid Configuration" une fois terminé

### 5. Redirection www vers apex (optionnel)

Dans Vercel Settings > Domains, vous pouvez configurer :
- Redirection de `www.guide-de-lyon.fr` vers `guide-de-lyon.fr`
- Ou l'inverse selon votre préférence

## Status actuel

- ✅ Site déployé sur : https://guide-lyon-v2.vercel.app
- ⏳ En attente : Configuration DNS de guide-de-lyon.fr
- ⏳ En attente : Activation HTTPS automatique

## Commandes utiles pour vérifier

```bash
# Vérifier les DNS actuels
nslookup guide-de-lyon.fr

# Vérifier la propagation
dig guide-de-lyon.fr

# Tester la connexion
curl -I https://guide-de-lyon.fr
```

## Support

Si vous avez des questions :
- Documentation Vercel : https://vercel.com/docs/projects/domains
- Support Vercel : https://vercel.com/support