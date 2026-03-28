import { prisma } from '../db';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary explicitly from URL
if (!process.env.CLOUDINARY_URL) {
  console.error("CLOUDINARY_URL not found in .env");
  process.exit(1);
}

const url = process.env.CLOUDINARY_URL;
const [auth, cloudName] = url.replace('cloudinary://', '').split('@');
const [apiKey, apiSecret] = auth.split(':');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

async function migrate() {
  console.log("--- Starting Cloudinary Migration ---");

  const resources = await prisma.resource.findMany();
  console.log(`Found ${resources.length} resources in database.`);

  for (const res of resources) {
    // Check if it's a local path
    if (res.file_path.startsWith('http')) {
      console.log(`Skipping ${res.title} - already a URL.`);
      continue;
    }

    // Local path resolution
    // Standardizing path: if file_path is "resources/lecture_notes/file.pdf"
    // We need to look in "../resources/lecture_notes/file.pdf" relative to this script or provide absolute path
    const localPath = path.resolve(__dirname, '../../', res.file_path);
    console.log(`Checking path: ${localPath}`);
    
    if (!fs.existsSync(localPath)) {
      console.error(`File NOT found: ${localPath} (Source: ${res.file_path})`);
      continue;
    }

    console.log(`Uploading ${res.title} (${res.file_path})...`);

    try {
      const uploadResult = await cloudinary.uploader.upload(localPath, {
        resource_type: "auto",
        folder: "juris_resources",
        use_filename: true,
        unique_filename: true
      });

      console.log(`Success! New URL: ${uploadResult.secure_url}`);

      await prisma.resource.update({
        where: { id: res.id },
        data: { file_path: uploadResult.secure_url }
      });

    } catch (error) {
      console.error(`Failed to upload ${res.title}:`, error);
    }
  }

  console.log("--- Migration Completed ---");
}

migrate()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
