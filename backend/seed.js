import mongoose from "mongoose";
import bcrypt from "bcrypt";
import doctorModel from "./models/doctorModel.js";
import dotenv from "dotenv";
import connectCloudinary from "./config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Sample doctor data
const doctors = [
  {
    name: "Dr. Richard James",
    email: "richard.james@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc1.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Richard James has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. With extensive experience in general practice, he provides personalized care to patients of all ages.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Emily Larson",
    email: "emily.larson@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc2.png",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Emily Larson specializes in women's health and provides comprehensive gynecological care. She is dedicated to ensuring the well-being of her patients through compassionate and evidence-based medical practice.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Sarah Patel",
    email: "sarah.patel@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc3.png",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about:
      "Dr. Sarah Patel is a skilled dermatologist specializing in skin health and cosmetic dermatology. She provides expert care for various skin conditions and helps patients achieve healthy, beautiful skin.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Christopher Lee",
    email: "christopher.lee@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc4.png",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Christopher Lee is a dedicated pediatrician who specializes in the health and well-being of children. He provides comprehensive medical care for infants, children, and adolescents with a focus on preventive care.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Jennifer Garcia",
    email: "jennifer.garcia@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc5.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Jennifer Garcia is a board-certified neurologist specializing in the diagnosis and treatment of disorders affecting the nervous system. She provides expert care for patients with neurological conditions.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Andrew Williams",
    email: "andrew.williams@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc6.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Andrew Williams is an experienced neurologist with expertise in treating complex neurological disorders. He is committed to providing the highest quality care to his patients.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Christopher Davis",
    email: "christopher.davis@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc7.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Christopher Davis is a dedicated general physician with extensive experience in primary care. He provides comprehensive medical services and focuses on building long-term relationships with his patients.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Timothy White",
    email: "timothy.white@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc8.png",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Timothy White is a compassionate gynecologist who provides comprehensive women's health services. He is known for his gentle approach and commitment to patient comfort and care.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Ava Mitchell",
    email: "ava.mitchell@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc9.png",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about:
      "Dr. Ava Mitchell is a rising star in dermatology, specializing in both medical and cosmetic dermatology. She provides innovative treatments for various skin conditions and aesthetic concerns.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Jeffrey King",
    email: "jeffrey.king@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc10.png",
    speciality: "Pediatricians",
    degree: "MBBS",
    experience: "2 Years",
    about:
      "Dr. Jeffrey King is a caring pediatrician who specializes in child development and preventive medicine. He creates a comfortable environment for children and their families during medical visits.",
    fees: 40,
    address: {
      line1: "47th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Zoe Kelly",
    email: "zoe.kelly@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc11.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Zoe Kelly is a highly skilled neurologist with expertise in treating movement disorders and epilepsy. She is committed to improving the quality of life for patients with neurological conditions.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Patrick Harris",
    email: "patrick.harris@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc12.png",
    speciality: "Neurologist",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Patrick Harris is a renowned neurologist specializing in stroke treatment and prevention. He leads a multidisciplinary team to provide comprehensive neurological care.",
    fees: 50,
    address: {
      line1: "57th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Chloe Evans",
    email: "chloe.evans@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc13.png",
    speciality: "General physician",
    degree: "MBBS",
    experience: "4 Years",
    about:
      "Dr. Chloe Evans is a dedicated general physician who provides comprehensive primary care services. She emphasizes preventive medicine and patient education in her practice.",
    fees: 50,
    address: {
      line1: "17th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Ryan Martinez",
    email: "ryan.martinez@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc14.png",
    speciality: "Gynecologist",
    degree: "MBBS",
    experience: "3 Years",
    about:
      "Dr. Ryan Martinez is a skilled gynecologist who provides comprehensive women's health services. He is known for his expertise in minimally invasive surgical procedures.",
    fees: 60,
    address: {
      line1: "27th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
  {
    name: "Dr. Amelia Hill",
    email: "amelia.hill@prescripto.com",
    password: "test1234",
    image: "./../frontend/src/assets/doc15.png",
    speciality: "Dermatologist",
    degree: "MBBS",
    experience: "1 Years",
    about:
      "Dr. Amelia Hill is a passionate dermatologist who specializes in treating skin conditions in patients of all ages. She combines medical expertise with a caring approach to patient care.",
    fees: 30,
    address: {
      line1: "37th Cross, Richmond",
      line2: "Circle, Ring Road, London",
    },
  },
];

// Function to seed doctors
const seedDoctors = async () => {
  try {
    // Clear existing doctors
    await doctorModel.deleteMany({});
    console.log("Cleared existing doctors");

    // Hash passwords and add doctors
    for (const doctor of doctors) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(doctor.password, salt);

      // Ensure Cloudinary is configured
      await connectCloudinary();

      if (doctor.image) {
        try {
          const uploadResult = await cloudinary.uploader.upload(doctor.image, {
            folder: "doctors",
            use_filename: true,
            unique_filename: false,
            overwrite: true,
          });
          doctor.image = uploadResult.secure_url;
        } catch (err) {
          console.error(`Failed to upload image for ${doctor.name}:`, err);
        }
      }

      const doctorData = {
        ...doctor,
        password: hashedPassword,
        date: Date.now(),
        available: true,
        slots_booked: {},
      };

      const newDoctor = new doctorModel(doctorData);
      await newDoctor.save();
      console.log(`Added doctor: ${doctor.name}`);
    }

    console.log("✅ Successfully seeded doctors database!");
  } catch (error) {
    console.error("❌ Error seeding doctors:", error);
  }
};

// Main function to run the seed
const runSeed = async () => {
  await connectDB();
  await seedDoctors();
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
};

// Run the seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed();
}

export { seedDoctors, doctors };
