import { db } from '../firebase';
import { prisma } from '../prisma';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Main migration function
export async function migrateToFirestore() {
  try {
    console.log('Starting migration to Firestore...');
    
    // Migrate VIP Prediction Categories
    await migrateVIPPredictionCategories();
    
    // Migrate VIP Predictions
    await migrateVIPPredictions();
    
    // Migrate Packages
    await migratePackages();
    
    // Migrate Users and Subscriptions
    await migrateUsersAndSubscriptions();
    
    console.log('Migration completed successfully!');
    return { success: true, message: 'Migration completed successfully!' };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, message: `Migration failed: ${error.message}` };
  }
}

// Migrate VIP Prediction Categories
async function migrateVIPPredictionCategories() {
  console.log('Migrating VIP Prediction Categories...');
  
  const categories = await prisma.vIPPredictionCategory.findMany();
  
  for (const category of categories) {
    await setDoc(doc(db, 'vipPredictionCategories', category.id.toString()), {
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      successRate: category.successRate,
      totalPicks: category.totalPicks,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    });
  }
  
  console.log(`Migrated ${categories.length} VIP Prediction Categories`);
}

// Migrate VIP Predictions
async function migrateVIPPredictions() {
  console.log('Migrating VIP Predictions...');
  
  const predictions = await prisma.vIPPrediction.findMany();
  
  for (const prediction of predictions) {
    await setDoc(doc(db, 'vipPredictions', prediction.id.toString()), {
      categoryId: prediction.categoryId.toString(),
      homeTeam: prediction.homeTeam,
      awayTeam: prediction.awayTeam,
      league: prediction.league,
      matchTime: prediction.matchTime,
      prediction: prediction.prediction,
      odds: prediction.odds,
      analysis: prediction.analysis,
      confidence: prediction.confidence,
      status: prediction.status,
      result: prediction.result || '',
      isArchived: prediction.isArchived,
      createdAt: prediction.createdAt,
      updatedAt: prediction.updatedAt,
      createdBy: prediction.createdBy.toString(),
      publishAt: prediction.publishAt
    });
  }
  
  console.log(`Migrated ${predictions.length} VIP Predictions`);
}

// Migrate Packages
async function migratePackages() {
  console.log('Migrating Packages...');
  
  const packages = await prisma.package.findMany();
  
  for (const pkg of packages) {
    await setDoc(doc(db, 'packages', pkg.id.toString()), {
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      duration: pkg.duration,
      features: pkg.features || [],
      isActive: pkg.isActive || true,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt
    });
  }
  
  console.log(`Migrated ${packages.length} Packages`);
}

// Migrate Users and Subscriptions
async function migrateUsersAndSubscriptions() {
  console.log('Migrating Users and Subscriptions...');
  
  const users = await prisma.user.findMany({
    include: {
      subscriptions: true
    }
  });
  
  for (const user of users) {
    // Migrate user
    await setDoc(doc(db, 'users', user.id.toString()), {
      uid: user.id.toString(),
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      role: user.role || 'customer',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || serverTimestamp(),
      profile: user.profile || {},
      status: user.status || 'active'
    });
    
    // Migrate subscriptions
    for (const subscription of user.subscriptions) {
      await setDoc(doc(db, 'vipSubscriptions', subscription.id.toString()), {
        userId: user.id.toString(),
        packageId: subscription.packageId.toString(),
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        status: subscription.status,
        lastNotificationDate: subscription.lastNotificationDate || null,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt
      });
    }
  }
  
  console.log(`Migrated ${users.length} Users and their Subscriptions`);
}

// Create a CLI script to run the migration
if (require.main === module) {
  migrateToFirestore()
    .then(result => {
      console.log(result.message);
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error during migration:', error);
      process.exit(1);
    });
}