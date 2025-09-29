// Script de test pour vérifier la configuration Supabase Storage
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testStorage() {
  console.log('🔍 Test de la configuration Supabase Storage...')
  
  try {
    // 1. Vérifier si le bucket existe
    console.log('\n1. Vérification du bucket plant-images...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('❌ Erreur lors de la récupération des buckets:', bucketsError.message)
      return
    }
    
    const plantImagesBucket = buckets.find(bucket => bucket.name === 'plant-images')
    
    if (!plantImagesBucket) {
      console.log('⚠️  Bucket plant-images non trouvé')
      console.log('📋 Buckets disponibles:', buckets.map(b => b.name))
      return
    }
    
    console.log('✅ Bucket plant-images trouvé')
    console.log('📊 Détails du bucket:', {
      name: plantImagesBucket.name,
      public: plantImagesBucket.public,
      created_at: plantImagesBucket.created_at
    })
    
    // 2. Tester l'upload d'un fichier de test
    console.log('\n2. Test d\'upload...')
    const testContent = 'Test content for plant image'
    const testFileName = `test/${Date.now()}.txt`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('plant-images')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      })
    
    if (uploadError) {
      console.error('❌ Erreur d\'upload:', uploadError.message)
      return
    }
    
    console.log('✅ Upload réussi:', uploadData.path)
    
    // 3. Tester l'URL publique
    console.log('\n3. Test de l\'URL publique...')
    const { data: { publicUrl } } = supabase.storage
      .from('plant-images')
      .getPublicUrl(testFileName)
    
    console.log('✅ URL publique générée:', publicUrl)
    
    // 4. Nettoyer le fichier de test
    console.log('\n4. Nettoyage...')
    const { error: deleteError } = await supabase.storage
      .from('plant-images')
      .remove([testFileName])
    
    if (deleteError) {
      console.error('⚠️  Erreur lors du nettoyage:', deleteError.message)
    } else {
      console.log('✅ Fichier de test supprimé')
    }
    
    console.log('\n🎉 Test de storage réussi !')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
  }
}

testStorage()
