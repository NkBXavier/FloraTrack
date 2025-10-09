# Configuration Production - FloraTrack

## Variables d'environnement requises

### 1. Variables Supabase (OBLIGATOIRES)

Ajoutez ces variables dans votre projet Vercel :

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Comment obtenir ces valeurs

1. **Connectez-vous à Supabase** : https://supabase.com/dashboard
2. **Sélectionnez votre projet**
3. **Allez dans Settings > API**
4. **Copiez** :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configuration Vercel

1. **Allez dans votre projet Vercel**
2. **Settings > Environment Variables**
3. **Ajoutez les variables** pour l'environnement Production
4. **Redeployez** votre application

### 4. Test de la configuration

Visitez `/test-db` sur votre site en production pour tester la connexion.

## Problèmes courants

### ❌ "Missing Supabase environment variables"
- Vérifiez que les variables sont bien définies dans Vercel
- Assurez-vous qu'elles sont activées pour l'environnement Production
- Redéployez après avoir ajouté les variables

### ❌ "Invalid API key"
- Vérifiez que la clé anon est correcte
- Assurez-vous qu'elle n'a pas d'espaces avant/après

### ❌ "Connection refused"
- Vérifiez que l'URL Supabase est correcte
- Assurez-vous que votre projet Supabase est actif

### ❌ "Row Level Security policy"
- Vérifiez que les tables existent dans Supabase
- Exécutez les scripts SQL dans l'ordre :
  1. `001_create_tables.sql`
  2. `002_create_functions.sql`
  3. `003_add_location_column.sql`
  4. `004_setup_storage.sql`

## Scripts SQL à exécuter

Exécutez ces scripts dans l'ordre dans l'éditeur SQL de Supabase :

1. `scripts/001_create_tables.sql`
2. `scripts/002_create_functions.sql`
3. `scripts/003_add_location_column.sql`
4. `scripts/004_setup_storage.sql`

## Vérification finale

1. ✅ Variables d'environnement configurées dans Vercel
2. ✅ Tables créées dans Supabase
3. ✅ RLS activé et policies créées
4. ✅ Test `/test-db` réussi
5. ✅ Connexion et inscription fonctionnent
