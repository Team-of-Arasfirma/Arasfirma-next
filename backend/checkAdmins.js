import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from './models/Admin.js';

// Always load the backend .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const checkAdmins = async () => {
  try {
    // Check Mongo URI
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in .env');
      process.exit(1);
    }

    // Connect MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('✅ MongoDB Connected');

    // Find all admins
    const admins = await Admin.find({}).select('+password');

    console.log('\n📌 Admins in Database:\n');

    admins.forEach((admin) => {
      console.log(`Email: ${admin.email}`);
      console.log(`Name: ${admin.name}`);
      console.log('-----------------------');
    });

    // CREATE ADMIN IF NOT EXISTS
    if (admins.length === 0) {
      console.log('⚡ No admins found. Creating new admin...');

      const newAdmin = await Admin.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: 'Afadmin123',
      });

      console.log('✅ Admin Created Successfully');
      console.log(`📧 Email: ${newAdmin.email}`);
      console.log(`🔑 Password: Afadmin123`);
    } else {
      // RESET EXISTING ADMIN PASSWORD
      console.log('⚡ Admin exists. Resetting password...');

      const firstAdmin = admins[0];

      // IMPORTANT:
      // DO NOT HASH HERE
      // Schema automatically hashes password

      firstAdmin.password = 'Afadmin123';

      await firstAdmin.save();

      console.log('✅ Password Updated Successfully');
      console.log(`📧 Email: ${firstAdmin.email}`);
      console.log(`🔑 New Password: Afadmin123`);
    }

    await mongoose.disconnect();

    console.log('\n✅ Done');
    process.exit();

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);

    try {
      await mongoose.disconnect();
    } catch (_) {}

    process.exit(1);
  }
};

checkAdmins();